import { useSim } from '../hooks/useSimulation.jsx';
import { detectDeadlock } from '../simulator/deadlock.js';

export default function Deadlock() {
  const { st, dispatch } = useSim(); const d = st.dl; const r = detectDeadlock(d);
  const steps = [['A', 'R1', 'A acquires R1'], ['B', 'R2', 'B acquires R2'], ['A', 'R2', 'A requests R2'], ['B', 'R1', 'B requests R1']];
  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <p className="text-sm">Run the steps in order. Thread A holds R1 and wants R2; Thread B holds R2 and wants R1.</p>
      <div className="flex flex-wrap gap-2">{steps.map(([t, res, label]) => <button key={label} className="rounded bg-[#142B45] px-3 py-1 text-sm text-white" onClick={() => dispatch({ type: 'dlAcquire', thread: t, res })}>{label}</button>)}
        <button className="rounded bg-[#4C956C] px-3 py-1 text-sm text-white" onClick={() => dispatch({ type: 'dlRelease', thread: 'B', res: 'R2' })}>Recover: B releases R2</button>
        <button className="rounded border px-3 py-1 text-sm" onClick={() => dispatch({ type: 'dlReset' })}>Reset</button></div>
      <p className="text-sm">R1 owner: <b>{d.owner.R1 ?? 'free'}</b> · R2 owner: <b>{d.owner.R2 ?? 'free'}</b> · A waiting: <b>{d.waiting.A ?? '-'}</b> · B waiting: <b>{d.waiting.B ?? '-'}</b></p>
      {r.deadlocked ? <div className="rounded-lg border-l-4 border-[#E9A23B] bg-orange-50 p-3 text-sm"><b>DEADLOCK DETECTED.</b> {r.explanation}</div> : <p className="text-sm text-slate-600">{r.explanation}</p>}
      <pre className="rounded bg-[#F4F6F8] p-2 text-xs">{d.log.join('\n') || 'No events yet.'}</pre>
    </div>
  );
}
