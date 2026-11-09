import { useState } from 'react';
import { Plus, Pencil, Trash2, PlaneTakeoff } from 'lucide-react';
import { useTerm, useVehicleActions } from '../hooks/useTerminal.jsx';
import { Card, Btn, Badge, Field, PageTitle, inputCls } from '../components/ui.jsx';
import { TYPES, STATUSES, CAP } from '../data/sample.js';
const blank = { type: 'Jeepney', dest: '', depart: '09:00', eta: '10:00', cap: 16, pax: 0 };
export default function Schedules() {
  const { t, dispatch } = useTerm(); const { setStatus } = useVehicleActions();
  const [form, setForm] = useState(null); const [f, setF] = useState({ type: 'All', dest: 'All', status: 'All' });
  const dests = [...new Set(t.schedules.map((s) => s.dest))];
  const rows = t.schedules.filter((s) => (f.type === 'All' || s.type === f.type) && (f.dest === 'All' || s.dest === f.dest) && (f.status === 'All' || s.status === f.status));
  const save = (e) => { e.preventDefault(); const v = { ...form, cap: +form.cap, pax: Math.min(+form.pax, +form.cap) };
    dispatch({ type: form.id ? 'edit' : 'add', v }); setForm(null); };
  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value, ...(k === 'type' ? { cap: CAP[e.target.value] } : {}) });
  const Sel = ({ k, opts }) => <select className={inputCls} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })}>{['All', ...opts].map((o) => <option key={o}>{o}</option>)}</select>;
  return (
    <div className="space-y-4">
      <PageTitle title="Transportation Schedules" hint="See, add, change or remove departures for jeepneys, buses and tricycles." />
      <Card><div className="flex flex-wrap items-end gap-3">
        <Field label="Type"><Sel k="type" opts={TYPES} /></Field><Field label="Destination"><Sel k="dest" opts={dests} /></Field><Field label="Status"><Sel k="status" opts={STATUSES} /></Field>
        <Btn icon={Plus} onClick={() => setForm(blank)}>Add Schedule</Btn></div></Card>
      {form && <Card title={form.id ? `Edit ${form.id}` : 'Add Schedule'}><form onSubmit={save} className="grid gap-3 sm:grid-cols-3">
        <Field label="Type"><select className={inputCls} value={form.type} onChange={up('type')}>{TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="Destination"><input required className={inputCls} value={form.dest} onChange={up('dest')} /></Field>
        <Field label="Departure time"><input required type="time" className={inputCls} value={form.depart} onChange={up('depart')} /></Field>
        <Field label="Estimated arrival"><input required type="time" className={inputCls} value={form.eta} onChange={up('eta')} /></Field>
        <Field label="Capacity"><input type="number" min="1" className={inputCls} value={form.cap} onChange={up('cap')} /></Field>
        <Field label="Passengers now"><input type="number" min="0" className={inputCls} value={form.pax} onChange={up('pax')} /></Field>
        <div className="flex gap-2"><Btn type="submit" variant="good">Save</Btn><Btn type="button" variant="outline" onClick={() => setForm(null)}>Cancel</Btn></div></form></Card>}
      <Card><div className="overflow-x-auto"><table className="w-full text-left text-base">
        <thead className="text-sm text-slate-600"><tr><th className="p-2">ID</th><th>Type</th><th>Destination</th><th>Departs</th><th>Arrives</th><th>Status</th><th>Passengers</th><th>Actions</th></tr></thead>
        <tbody>{rows.map((s) => <tr key={s.id} className="border-t"><td className="p-2 font-medium">{s.id}</td><td>{s.type}</td><td>{s.dest}</td><td>{s.depart}</td><td>{s.eta}</td><td><Badge s={s.status} /></td><td>{s.pax}/{s.cap}</td>
          <td><div className="flex flex-wrap gap-1 py-1">
            <Btn variant="outline" icon={Pencil} aria-label={`Edit ${s.id}`} onClick={() => setForm(s)}>Edit</Btn>
            <Btn variant="outline" icon={PlaneTakeoff} disabled={s.status === 'Departed'} onClick={() => setStatus(s, 'Departed')}>Mark as Departed</Btn>
            <Btn variant="danger" icon={Trash2} aria-label={`Delete ${s.id}`} onClick={() => window.confirm(`Delete schedule ${s.id}?`) && dispatch({ type: 'del', id: s.id })}>Delete</Btn></div></td></tr>)}</tbody></table>
        {!rows.length && <p className="p-3">No schedules match these filters.</p>}</div></Card>
    </div>);
}
