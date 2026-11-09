// Alfonso Terminal Tracker - CPU scheduler core (pure functions, no React).
// tick(state, cfg) -> NEW state. Keeping every state in an array gives the Time Machine for free.
export const ALGOS = ['FCFS', 'SJF', 'RR', 'PRIORITY'];

export function makeState(procs) {
  return {
    time: 0, queue: [], running: null, quantumLeft: 0, ctx: 0, gantt: [], decisions: [],
    procs: procs.map((p) => ({
      ioAt: null, ioBurst: 0, parent: null, priority: 1, ...p,
      remaining: p.burst, ran: 0, ioLeft: 0, ioDone: false,
      state: 'NEW', start: null, finish: null,
    })),
  };
}

// The scheduling decision. Returns the chosen process AND the reason, built from the real queue.
function pick(s, cfg) {
  const rq = s.queue.map((id) => s.procs.find((p) => p.pid === id));
  const list = rq.map((p) => p.pid).join(', ');
  let p, why;
  if (cfg.algo === 'SJF') {
    p = rq.reduce((a, b) => (b.remaining < a.remaining ? b : a));
    why = `${p.pid} was selected because it has the shortest remaining CPU burst (${p.remaining}) among ready processes [${list}].`;
  } else if (cfg.algo === 'PRIORITY') {
    p = rq.reduce((a, b) => (b.priority < a.priority ? b : a)); // lower number = higher priority
    why = `${p.pid} was selected because it has the highest priority (level ${p.priority}) among [${list}].`;
  } else if (cfg.algo === 'RR') {
    p = rq[0];
    why = `${p.pid} was selected because it was next in the circular ready queue [${list}]; it gets a quantum of ${cfg.quantum}.`;
  } else {
    p = rq[0];
    why = `${p.pid} was selected because it entered the ready queue earliest (arrival ${p.arrival}) among [${list}].`;
  }
  return { p, why };
}

export function tick(prev, cfg) {
  const s = structuredClone(prev);
  const t = s.time;
  const get = (id) => s.procs.find((p) => p.pid === id);

  // 1. Admit arrivals: NEW -> READY
  s.procs.filter((p) => p.state === 'NEW' && p.arrival <= t)
    .forEach((p) => { p.state = 'READY'; s.queue.push(p.pid); });

  // 2. I/O completion: WAITING -> READY
  s.procs.filter((p) => p.state === 'WAITING').forEach((p) => {
    if (--p.ioLeft <= 0) { p.state = 'READY'; s.queue.push(p.pid); }
  });

  // 3. Dispatch (context switch) if CPU is free
  if (!s.running && s.queue.length) {
    const { p, why } = pick(s, cfg);
    s.queue.splice(s.queue.indexOf(p.pid), 1);
    p.state = 'RUNNING';
    if (p.start === null) p.start = t;
    s.running = p.pid; s.quantumLeft = cfg.quantum; s.ctx++;
    s.decisions.push({ t, pid: p.pid, why, queue: [...s.queue] });
    s.newDispatch = true;
  }

  // 4. Execute one time unit (or idle)
  const last = s.gantt[s.gantt.length - 1];
  const pid = s.running;
  if (last && last.pid === pid && last.end === t && !s.newDispatch) last.end++;
  else s.gantt.push({ pid, start: t, end: t + 1, decision: pid ? s.decisions.length - 1 : null });
  s.newDispatch = false;

  if (pid) {
    const p = get(pid);
    p.remaining--; p.ran++; s.quantumLeft--;
    if (p.remaining === 0) { p.state = 'TERMINATED'; p.finish = t + 1; s.running = null; }
    else if (p.ioAt !== null && !p.ioDone && p.ran >= p.ioAt) {
      p.state = 'WAITING'; p.ioLeft = p.ioBurst; p.ioDone = true; s.running = null; // I/O request syscall
    } else if (cfg.algo === 'RR' && s.quantumLeft === 0) {
      p.state = 'READY'; s.queue.push(p.pid); s.running = null; // quantum expired: preempt
    }
  }
  s.time++;
  return s;
}

export const isDone = (s) => s.procs.every((p) => p.state === 'TERMINATED');

export function metrics(s) {
  const d = s.procs.filter((p) => p.finish !== null);
  const avg = (f) => (d.length ? +(d.reduce((a, p) => a + f(p), 0) / d.length).toFixed(2) : 0);
  const busy = s.gantt.filter((g) => g.pid).reduce((a, g) => a + g.end - g.start, 0);
  return {
    avgWaiting: avg((p) => p.finish - p.arrival - p.burst - (p.ioDone ? p.ioBurst : 0)),
    avgTurnaround: avg((p) => p.finish - p.arrival),
    avgResponse: avg((p) => p.start - p.arrival),
    cpuUtil: s.time ? +((busy / s.time) * 100).toFixed(1) : 0,
  };
}

// Run to completion, recording every snapshot: history[t] is the exact state at time t (Time Machine).
export function runAll(initial, cfg, limit = 500) {
  const history = [initial];
  while (!isDone(history.at(-1)) && history.length < limit) history.push(tick(history.at(-1), cfg));
  return history;
}
