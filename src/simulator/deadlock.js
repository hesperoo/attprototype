// Deadlock demo: Thread A holds R1 wants R2; Thread B holds R2 wants R1.
// Detection = finding a cycle in the wait-for graph (A waits for B, B waits for A).
export const initialDeadlock = () => ({ owner: { R1: null, R2: null }, waiting: { A: null, B: null }, log: [] });

export function acquire(d, thread, res) {
  const s = structuredClone(d);
  if (s.owner[res] === null) { s.owner[res] = thread; s.waiting[thread] = null; s.log.push(`${thread} acquired ${res}.`); }
  else { s.waiting[thread] = res; s.log.push(`${thread} requests ${res} (held by ${s.owner[res]}) and BLOCKS.`); }
  return s;
}

export function release(d, thread, res) {
  const s = structuredClone(d);
  if (s.owner[res] !== thread) return s;
  s.owner[res] = null; s.log.push(`${thread} released ${res}.`);
  const w = Object.keys(s.waiting).find((k) => s.waiting[k] === res);
  if (w) { s.owner[res] = w; s.waiting[w] = null; s.log.push(`${w} acquired ${res} after waiting.`); }
  return s;
}

export function detectDeadlock(d) {
  const waitsFor = (th) => (d.waiting[th] ? d.owner[d.waiting[th]] : null);
  for (const start of Object.keys(d.waiting)) {
    const path = [start]; let cur = waitsFor(start);
    while (cur && !path.includes(cur)) { path.push(cur); cur = waitsFor(cur); }
    if (cur === start) {
      return { deadlocked: true, cycle: path,
        explanation: `${path.join(' -> ')} -> ${start}: each thread holds a resource the next one needs. All four deadlock conditions hold (mutual exclusion, hold-and-wait, no preemption, circular wait), so nobody can proceed.` };
    }
  }
  return { deadlocked: false, cycle: [], explanation: 'No circular wait; every blocked thread can eventually continue.' };
}
