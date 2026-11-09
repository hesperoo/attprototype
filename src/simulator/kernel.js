// Kernel: the ONLY path from user actions to process/thread changes is syscall().
// Each call: USER -> KERNEL mode switch, do the work, log it, then back to USER mode.
import { createProcess, terminateProcess, ioRequest, yieldCpu } from './processManager.js';
import { createThread, joinThread } from './threadManager.js';

export const SYSCALLS = ['CREATE_PROCESS', 'TERMINATE_PROCESS', 'CREATE_THREAD', 'JOIN_THREAD', 'IO_REQUEST', 'YIELD'];
const stamp = (now) => now.toTimeString().slice(0, 8);

export function createOS(sim, threads = []) {
  return { sim, threads, kernel: { mode: 'USER', booted: false, log: [], syscalls: 0 } };
}

const add = (os, now, msg) => os.kernel.log.push(`[${stamp(now)}] ${msg}`);

export function boot(os, now = new Date()) {
  const o = structuredClone(os);
  o.kernel.mode = 'KERNEL';
  ['BOOT: loading kernel', 'KERNEL: memory, scheduler and device tables initialised', 'KERNEL: init process started'].forEach((m) => add(o, now, m));
  o.kernel.booted = true; o.kernel.mode = 'USER'; add(o, now, 'MODE: KERNEL -> USER (boot complete)');
  return o;
}

export function syscall(os, name, args = {}, now = new Date()) {
  if (!os.kernel.booted) return { os, error: 'Kernel not booted.' };
  let o = structuredClone(os);
  add(o, now, `SYSTEM CALL: ${name}`);
  o.kernel.mode = 'KERNEL'; add(o, now, 'MODE: USER -> KERNEL (trap)'); o.kernel.syscalls++;
  switch (name) {
    case 'CREATE_PROCESS': { const r = createProcess(o.sim, args); o.sim = r.sim; add(o, now, `KERNEL: Process ${r.pid} created successfully.`); add(o, now, 'KERNEL: CPU scheduling initiated.'); break; }
    case 'TERMINATE_PROCESS': o.sim = terminateProcess(o.sim, args.pid); add(o, now, `KERNEL: Process ${args.pid} terminated; resources released.`); break;
    case 'CREATE_THREAD': { const r = createThread(o.threads, args.pid, args.name); o.threads = r.threads; add(o, now, `KERNEL: Thread ${r.tid} created in ${args.pid}.`); break; }
    case 'JOIN_THREAD': { const r = joinThread(o.threads, args.callerTid, args.targetTid); o.threads = r.threads; add(o, now, r.blocked ? `KERNEL: ${args.callerTid} WAITING for ${args.targetTid}.` : `KERNEL: ${args.targetTid} already finished; join returns.`); break; }
    case 'IO_REQUEST': { const r = ioRequest(o.sim, args.pid, args.burst); o.sim = r.sim; add(o, now, `KERNEL: ${args.pid} moved to WAITING for I/O; CPU rescheduled.`); break; }
    case 'YIELD': { const r = yieldCpu(o.sim); o.sim = r.sim; add(o, now, r.pid ? `KERNEL: ${r.pid} yielded the CPU (RUNNING -> READY).` : 'KERNEL: Nothing running; yield ignored.'); break; }
    default: add(o, now, `KERNEL: unknown system call ${name}`);
  }
  o.kernel.mode = 'USER'; add(o, now, 'MODE: KERNEL -> USER (return)');
  return { os: o };
}
