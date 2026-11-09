// Thread Manager: many threads (TCBs) inside one process.
// Threads SHARE the process's resources but each owns registers, a stack and an execution state.
export const SHARED = ['Terminal Database', 'Vehicle Information', 'Departure Schedule'];
export const PRIVATE = ['Thread Registers', 'Thread Stack', 'Individual Execution State'];
const clone = (x) => structuredClone(x);
const NEXT = { NEW: 'READY', READY: 'RUNNING', RUNNING: 'TERMINATED' };

export function createThread(threads, pid, name) {
  const t = clone(threads);
  const tid = 'T' + String(t.length + 1).padStart(3, '0');
  t.push({ tid, pid, name, state: 'NEW', waitingOn: null, registers: { PC: 0x1000, SP: 0x6000 }, stack: [name] });
  return { threads: t, tid };
}

// Advance one thread NEW -> READY -> RUNNING -> TERMINATED. Finishing wakes any thread joined on it.
export function advanceThread(threads, tid) {
  const t = clone(threads); const th = t.find((x) => x.tid === tid);
  if (!th || !NEXT[th.state]) return t;
  th.state = NEXT[th.state]; th.registers.PC += 4; th.stack.push(`frame@${th.registers.PC}`);
  if (th.state === 'TERMINATED')
    t.filter((x) => x.waitingOn === tid).forEach((x) => { x.waitingOn = null; x.state = 'READY'; });
  return t;
}

// join: caller blocks (WAITING) until the target thread terminates; no wait if it already has.
export function joinThread(threads, callerTid, targetTid) {
  const t = clone(threads);
  const caller = t.find((x) => x.tid === callerTid), target = t.find((x) => x.tid === targetTid);
  if (!caller || !target || callerTid === targetTid) return { threads: t, blocked: false, ok: false };
  if (target.state === 'TERMINATED') return { threads: t, blocked: false, ok: true };
  caller.state = 'WAITING'; caller.waitingOn = targetTid;
  return { threads: t, blocked: true, ok: true };
}
