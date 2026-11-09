// Central simulation store (pure reducer). ONE state object feeds OS View and Terminal View,
// so switching views never resets anything. history[t] = snapshot of the scheduler at time t (Time Machine).
import { makeState, tick, isDone } from './scheduler.js';
import { SAMPLE } from './sampleProcesses.js';
import { createOS, boot, syscall } from './kernel.js';
import { createThread, advanceThread } from './threadManager.js';
import { setPriority } from './processManager.js';
import { initialDeadlock, acquire, release } from './deadlock.js';

export function initState() {
  let threads = [];
  ['Check Vehicle Availability', 'Count Waiting Passengers', 'Verify Departure Schedule', 'Update Departure Records']
    .forEach((n) => { threads = createThread(threads, 'P001', n).threads; });
  const os = createOS(makeState(SAMPLE), threads);
  return { os, history: [os.sim], cfg: { algo: 'FCFS', quantum: 2 }, running: false, view: 'OS', dl: initialDeadlock() };
}

export function reducer(st, a) {
  switch (a.type) {
    case 'step': {
      if (isDone(st.os.sim)) return { ...st, running: false };
      const sim = tick(st.os.sim, st.cfg);
      return { ...st, os: { ...st.os, sim }, history: [...st.history, sim], running: st.running && !isDone(sim) };
    }
    case 'run': return { ...st, running: true };
    case 'pause': return { ...st, running: false };
    case 'reset': { const sim = makeState(SAMPLE); return { ...st, os: { ...st.os, sim }, history: [sim], running: false }; }
    case 'cfg': return { ...st, cfg: { ...st.cfg, ...a.cfg } };
    case 'view': return { ...st, view: a.view };
    // Time Machine: restore the real snapshot and drop the future; pressing START replays deterministically.
    case 'rewind': { const t = Math.max(0, Math.min(a.t, st.history.length - 1));
      return { ...st, os: { ...st.os, sim: st.history[t] }, history: st.history.slice(0, t + 1), running: false }; }
    case 'boot': return { ...st, os: boot(st.os) };
    case 'syscall': {
      const r = syscall(st.os, a.name, a.args);
      if (r.error) return st;
      const history = [...st.history.slice(0, -1), r.os.sim]; // keep latest snapshot in sync with the syscall
      return { ...st, os: r.os, history };
    }
    case 'priority': { const sim = setPriority(st.os.sim, a.pid, a.priority);
      return { ...st, os: { ...st.os, sim }, history: [...st.history.slice(0, -1), sim] }; }
    case 'advanceThread': return { ...st, os: { ...st.os, threads: advanceThread(st.os.threads, a.tid) } };
    case 'dlAcquire': return { ...st, dl: acquire(st.dl, a.thread, a.res) };
    case 'dlRelease': return { ...st, dl: release(st.dl, a.thread, a.res) };
    case 'dlReset': return { ...st, dl: initialDeadlock() };
    default: return st;
  }
}
