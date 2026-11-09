// Process Manager: PCB creation and process-state changes. All functions are pure (return a new sim state).
const clone = (x) => structuredClone(x);
const find = (s, pid) => s.procs.find((p) => p.pid === pid);

export function nextPid(s) {
  return 'P' + String(Math.max(0, ...s.procs.map((p) => +p.pid.slice(1))) + 1).padStart(3, '0');
}

// New PCB. State starts as NEW; the scheduler admits it to READY when arrival <= clock.
export function createProcess(sim, { name, burst, priority = 2, parent = null, ioAt = null, ioBurst = 0 }) {
  const s = clone(sim);
  const pid = nextPid(s);
  s.procs.push({ pid, name, arrival: s.time, burst, priority, parent, ioAt, ioBurst, remaining: burst,
    ran: 0, ioLeft: 0, ioDone: false, state: 'NEW', start: null, finish: null });
  return { sim: s, pid };
}

// Terminate: remove from CPU and ready queue, mark TERMINATED, and cascade to children (as Unix-style cleanup).
export function terminateProcess(sim, pid) {
  const s = clone(sim);
  const kill = (id) => {
    const p = find(s, id);
    if (!p || p.state === 'TERMINATED') return;
    p.state = 'TERMINATED'; p.finish = s.time; p.remaining = 0;
    s.queue = s.queue.filter((q) => q !== id);
    if (s.running === id) s.running = null;
    s.procs.filter((c) => c.parent === id).forEach((c) => kill(c.pid));
  };
  kill(pid);
  return s;
}

export function setPriority(sim, pid, priority) {
  const s = clone(sim); const p = find(s, pid);
  if (p) p.priority = priority;
  return s;
}

// RUNNING -> READY (voluntary give-up of the CPU).
export function yieldCpu(sim) {
  const s = clone(sim);
  if (!s.running) return { sim: s, pid: null };
  const p = find(s, s.running);
  p.state = 'READY'; s.queue.push(p.pid); const pid = s.running; s.running = null;
  return { sim: s, pid };
}

// RUNNING -> WAITING. The scheduler's tick() counts ioLeft down and returns the process to READY.
export function ioRequest(sim, pid, burst = 2) {
  const s = clone(sim); const p = find(s, pid);
  if (!p || p.state === 'TERMINATED') return { sim: s, ok: false };
  s.queue = s.queue.filter((q) => q !== pid);
  if (s.running === pid) s.running = null;
  p.state = 'WAITING'; p.ioLeft = burst; p.ioBurst += burst; p.ioDone = true;
  return { sim: s, ok: true };
}

// PCB view: stored fields plus simulated registers derived from execution progress.
export function pcb(sim, pid) {
  const p = find(sim, pid); if (!p) return null;
  return {
    pid: p.pid, name: p.name, state: p.state, priority: p.priority, arrival: p.arrival,
    burst: p.burst, remaining: p.remaining, parent: p.parent,
    children: sim.procs.filter((c) => c.parent === pid).map((c) => c.pid),
    io: p.ioAt === null && !p.ioDone ? 'none' : `${p.ioBurst} units, after ${p.ioAt ?? '-'} units of CPU`,
    registers: { PC: 0x4000 + p.ran * 4, SP: 0x7fff - p.ran * 8, ACC: p.ran * 3 },
  };
}
