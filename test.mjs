import { makeState, runAll, metrics } from './src/simulator/scheduler.js';
import { SAMPLE } from './src/simulator/sampleProcesses.js';
for (const algo of ['FCFS','SJF','RR','PRIORITY']) {
  const h = runAll(makeState(SAMPLE), { algo, quantum: 2 });
  const s = h.at(-1);
  console.log(algo, 'end t=', s.time, 'ctx', s.ctx, metrics(s));
  console.log(' ', s.gantt.map(g => `${g.pid||'idle'}[${g.start}-${g.end}]`).join(' '));
}
const h = runAll(makeState(SAMPLE), { algo: 'SJF', quantum: 2 });
console.log(h.at(-1).decisions[1].why, '| rewind t=5 running:', h[5].running);
