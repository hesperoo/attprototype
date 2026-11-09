import { useState } from 'react';
import { useSim } from '../hooks/useSimulation.jsx';
import { SHARED, PRIVATE } from '../simulator/threadManager.js';
import { STATE_COLOR } from '../utils/terms.js';

export default function Threads() {
  const { st, dispatch } = useSim(); const { threads } = st.os;
  const [caller, setCaller] = useState('T002'); const [target, setTarget] = useState('T001');
  const sc = (name, args) => dispatch({ type: 'syscall', name, args });
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-white p-4 shadow-sm"><h3 className="text-sm font-semibold text-[#4C956C]">SHARED by all threads</h3><ul className="text-sm">{SHARED.map((r) => <li key={r}>• {r}</li>)}</ul></div>
        <div className="rounded-xl bg-white p-4 shadow-sm"><h3 className="text-sm font-semibold text-[#E9A23B]">PRIVATE to each thread</h3><ul className="text-sm">{PRIVATE.map((r) => <li key={r}>• {r}</li>)}</ul></div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="mb-2 flex flex-wrap gap-2 text-sm">
          <button className="rounded bg-[#142B45] px-3 py-1 text-white" onClick={() => sc('CREATE_THREAD', { pid: 'P001', name: 'New Thread' })}>Create Thread</button>
          <select value={caller} onChange={(e) => setCaller(e.target.value)}>{threads.map((t) => <option key={t.tid}>{t.tid}</option>)}</select> joins
          <select value={target} onChange={(e) => setTarget(e.target.value)}>{threads.map((t) => <option key={t.tid}>{t.tid}</option>)}</select>
          <button className="rounded bg-[#334E68] px-3 py-1 text-white" onClick={() => sc('JOIN_THREAD', { callerTid: caller, targetTid: target })}>Join Thread</button>
        </div>
        <table className="w-full text-left text-sm"><thead className="text-xs text-slate-500"><tr><th>TID</th><th>PID</th><th>Name</th><th>State</th><th>Registers (private)</th><th>Stack depth</th><th /></tr></thead>
          <tbody>{threads.map((t) => <tr key={t.tid} className="border-t"><td>{t.tid}</td><td>{t.pid}</td><td>{t.name}</td>
            <td><span className={`rounded px-2 py-0.5 text-xs ${STATE_COLOR[t.state]}`}>{t.state}{t.waitingOn ? ` → ${t.waitingOn}` : ''}</span></td>
            <td className="font-mono text-xs">PC={t.registers.PC} SP={t.registers.SP}</td><td>{t.stack.length}</td>
            <td><button className="text-xs underline" onClick={() => dispatch({ type: 'advanceThread', tid: t.tid })}>advance</button></td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
