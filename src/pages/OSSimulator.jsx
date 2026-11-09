import { useMemo, useState } from 'react';
import { Play, Pause, StepForward, RotateCcw, Power } from 'lucide-react';
import { useSim } from '../hooks/useSimulation.jsx';
import { ALGOS, metrics, runAll } from '../simulator/scheduler.js';
import { pcb } from '../simulator/processManager.js';
import { word, stateLabel, STATE_COLOR } from '../utils/terms.js';

const COLORS = ['#142B45', '#4C956C', '#E9A23B', '#334E68', '#8B5E83', '#2A9D8F', '#B56576'];
const Card = ({ title, children }) => <section className="rounded-xl bg-white p-4 shadow-sm"><h3 className="mb-2 text-sm font-semibold text-[#334E68]">{title}</h3>{children}</section>;
const Btn = ({ children, ...p }) => <button {...p} className="inline-flex items-center gap-1 rounded-lg bg-[#142B45] px-3 py-1.5 text-sm text-white hover:bg-[#334E68] disabled:opacity-40">{children}</button>;

export default function OSSimulator() {
  const { st, dispatch } = useSim();
  const { os, history, cfg, running, view } = st; const sim = os.sim;
  const [sel, setSel] = useState('P001'); const [why, setWhy] = useState(null);
  const m = metrics(sim); const name = (pid) => (view === 'OS' ? pid : sim.procs.find((p) => p.pid === pid)?.name ?? pid);
  // Compare all four algorithms from the t=0 snapshot (real runs, not canned numbers).
  const compare = useMemo(() => ALGOS.map((algo) => ({ algo, ...metrics(runAll(history[0], { algo, quantum: cfg.quantum }).at(-1)) })), [history[0], cfg.quantum]);
  const sc = (n, args) => dispatch({ type: 'syscall', name: n, args });
  const card = pcb(sim, sel);

  return (
    <div className="space-y-4">
      <Card title={`${word(view, 'cpu')} Controls`}>
        <div className="flex flex-wrap items-center gap-2">
          <Btn onClick={() => dispatch({ type: 'run' })} disabled={running}><Play size={14} />START</Btn>
          <Btn onClick={() => dispatch({ type: 'pause' })} disabled={!running}><Pause size={14} />PAUSE</Btn>
          <Btn onClick={() => dispatch({ type: 'step' })}><StepForward size={14} />STEP</Btn>
          <Btn onClick={() => dispatch({ type: 'reset' })}><RotateCcw size={14} />RESET</Btn>
          <select value={cfg.algo} onChange={(e) => dispatch({ type: 'cfg', cfg: { algo: e.target.value } })} className="rounded border px-2 py-1 text-sm">{ALGOS.map((a) => <option key={a}>{a}</option>)}</select>
          {cfg.algo === 'RR' && <label className="text-sm">Quantum <input type="number" min="1" value={cfg.quantum} onChange={(e) => dispatch({ type: 'cfg', cfg: { quantum: Math.max(1, +e.target.value) } })} className="w-14 rounded border px-1" /></label>}
          <span className="ml-auto text-sm">Clock <b>{sim.time}</b> · {word(view, 'ctx')} <b>{sim.ctx}</b> · Running <b>{sim.running ? name(sim.running) : 'idle'}</b></span>
        </div>
        <p className="mt-2 text-sm">{word(view, 'queue')}: {sim.queue.length ? sim.queue.map(name).join(' → ') : 'empty'}</p>
        <div className="mt-3"><label className="text-xs text-slate-500">Time Machine: t = {sim.time}</label>
          <input type="range" min="0" max={history.length - 1} value={sim.time} onChange={(e) => dispatch({ type: 'rewind', t: +e.target.value })} className="w-full" /></div>
      </Card>

      <Card title={`${word(view, 'gantt')} (click a block for “Why?”)`}>
        <div className="flex overflow-x-auto">{sim.gantt.map((g, i) => (
          <button key={i} onClick={() => g.decision !== null && setWhy(sim.decisions[g.decision])} title={`t=${g.start}-${g.end}`}
            style={{ width: (g.end - g.start) * 32, background: g.pid ? COLORS[+g.pid.slice(1) % COLORS.length] : '#E5E7EB' }} className="h-9 shrink-0 border-r border-white text-xs text-white">{g.pid ? (view === 'OS' ? g.pid : g.pid.slice(1)) : ''}</button>))}</div>
        {why && <p className="mt-3 rounded-lg bg-[#F4F6F8] p-3 text-sm"><b>Why? (t={why.t})</b> {why.why}</p>}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Performance Metrics"><p className="text-sm">Avg waiting <b>{m.avgWaiting}</b> · Avg turnaround <b>{m.avgTurnaround}</b> · Avg response <b>{m.avgResponse}</b> · CPU util <b>{m.cpuUtil}%</b></p>
          <table className="mt-2 w-full text-left text-xs"><thead><tr><th>Algo</th><th>Wait</th><th>TAT</th><th>Resp</th></tr></thead><tbody>{compare.map((c) => <tr key={c.algo} className={c.algo === cfg.algo ? 'font-bold' : ''}><td>{c.algo}</td><td>{c.avgWaiting}</td><td>{c.avgTurnaround}</td><td>{c.avgResponse}</td></tr>)}</tbody></table></Card>
        <Card title="Kernel Control Center">
          <p className="mb-2 text-sm">Mode: <span className={`rounded px-2 py-0.5 text-xs text-white ${os.kernel.mode === 'KERNEL' ? 'bg-[#E9A23B]' : 'bg-[#4C956C]'}`}>{os.kernel.mode}</span></p>
          <div className="flex flex-wrap gap-1">
            <Btn onClick={() => dispatch({ type: 'boot' })} disabled={os.kernel.booted}><Power size={14} />Boot</Btn>
            <Btn onClick={() => sc('CREATE_PROCESS', { name: 'New Operation', burst: 4, parent: sel })}>Create Process</Btn>
            <Btn onClick={() => sc('TERMINATE_PROCESS', { pid: sel })}>Terminate</Btn>
            <Btn onClick={() => sc('CREATE_THREAD', { pid: sel, name: 'Worker' })}>Create Thread</Btn>
            <Btn onClick={() => sc('IO_REQUEST', { pid: sim.running ?? sel, burst: 2 })}>I/O Request</Btn>
            <Btn onClick={() => sc('YIELD')}>Yield</Btn></div>
          <pre className="mt-2 h-28 overflow-auto rounded bg-[#142B45] p-2 text-xs text-green-200">{os.kernel.log.slice(-40).join('\n') || 'Kernel not booted. Press Boot.'}</pre></Card>
      </div>

      <Card title={word(view, 'proc')}>
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th>{view === 'OS' ? 'PID' : 'ID'}</th><th>Name</th><th>State</th><th>Pri</th><th>Arr</th><th>Burst</th><th>Left</th></tr></thead>
          <tbody>{sim.procs.map((p) => <tr key={p.pid} onClick={() => setSel(p.pid)} className={`cursor-pointer border-t ${sel === p.pid ? 'bg-[#F4F6F8]' : ''}`}>
            <td>{p.pid}</td><td>{p.name}</td><td><span className={`rounded px-2 py-0.5 text-xs ${STATE_COLOR[p.state]}`}>{stateLabel(view, p.state)}</span></td>
            <td><select value={p.priority} onClick={(e) => e.stopPropagation()} onChange={(e) => dispatch({ type: 'priority', pid: p.pid, priority: +e.target.value })}>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select></td><td>{p.arrival}</td><td>{p.burst}</td><td>{p.remaining}</td></tr>)}</tbody></table>
        {card && <pre className="mt-3 rounded bg-[#F4F6F8] p-2 text-xs">{`PCB ${card.pid} — ${card.name}\nstate=${card.state} priority=${card.priority} parent=${card.parent ?? '-'} children=[${card.children}]\nI/O: ${card.io}\nregisters: ${JSON.stringify(card.registers)}`}</pre>}
      </Card>
    </div>
  );
}
