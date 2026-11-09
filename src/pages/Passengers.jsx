import { useState } from 'react';
import { BellRing, PlusCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useTerm } from '../hooks/useTerminal.jsx';
import { Card, Btn, Stat, Field, PageTitle, inputCls } from '../components/ui.jsx';
import { TYPES, HOURS } from '../data/sample.js';
import { totals, peak, alerts, hourTotal } from '../utils/analytics.js';
const COL = ['#142B45', '#4C956C', '#E9A23B'];
export default function Passengers() {
  const { t, dispatch } = useTerm(); const [hour, setHour] = useState(8); const [ptype, setPtype] = useState('Jeepney'); const [n, setN] = useState(10);
  const tot = totals(t.counts); const pk = peak(t.counts); const al = alerts(t.counts);
  return (
    <div className="space-y-4">
      <PageTitle title="Passenger Monitoring & Demand" hint="Only head counts are recorded. No faces or personal details are collected." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Total passengers (sample)" value={Object.values(tot).reduce((a, b) => a + b, 0)} icon={BellRing} />
        {TYPES.map((x) => <Stat key={x} label={`${x} passengers`} value={tot[x]} icon={BellRing} />)}</div>
      <Card title="Peak hour"><p className="text-lg">Busiest hour: <b>{pk.hour}:00</b> with <b>{hourTotal(pk)}</b> passengers.</p></Card>
      <Card title="Demand notices" icon={BellRing}>{al.length ? <ul className="space-y-2">{al.map((a) => <li key={a.type} className="rounded-xl border-l-4 border-[#E9A23B] bg-orange-50 p-3 text-base">{a.text}<br /><b>Suggestion:</b> add about {a.extra} more {a.type} vehicle(s) (peak {a.peak} vs average {a.avg}).</li>)}</ul> : <p>Demand looks normal.</p>}</Card>
      <Card title="Record a passenger count" icon={PlusCircle}><form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'count', hour, ptype, n: Math.max(1, +n) }); }}>
        <Field label="Hour"><select className={inputCls} value={hour} onChange={(e) => setHour(+e.target.value)}>{HOURS.map((h) => <option key={h} value={h}>{h}:00</option>)}</select></Field>
        <Field label="Vehicle type"><select className={inputCls} value={ptype} onChange={(e) => setPtype(e.target.value)}>{TYPES.map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="Passengers"><input type="number" min="1" className={inputCls} value={n} onChange={(e) => setN(e.target.value)} /></Field>
        <Btn type="submit" variant="good">Add count</Btn></form></Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Hourly traffic"><ResponsiveContainer width="100%" height={260}><BarChart data={t.counts}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><Legend />{TYPES.map((x, i) => <Bar key={x} dataKey={x} fill={COL[i]} />)}</BarChart></ResponsiveContainer></Card>
        <Card title="Demand comparison"><ResponsiveContainer width="100%" height={260}><LineChart data={t.counts}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><Legend />{TYPES.map((x, i) => <Line key={x} dataKey={x} stroke={COL[i]} strokeWidth={3} />)}</LineChart></ResponsiveContainer></Card></div>
    </div>);
}
