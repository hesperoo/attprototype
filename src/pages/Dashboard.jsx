import { Bus, Truck, Bike, Users, Hourglass, Route, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { useTerm } from '../hooks/useTerminal.jsx';
import { useSim } from '../hooks/useSimulation.jsx';
import { Card, Stat, Badge, PageTitle } from '../components/ui.jsx';
import { TYPES } from '../data/sample.js';
import { totals, hourTotal } from '../utils/analytics.js';
import { word, stateLabel } from '../utils/terms.js';
const COL = ['#142B45', '#4C956C', '#E9A23B'];
export default function Dashboard() {
  const { t } = useTerm(); const { st } = useSim(); const sim = st.os.sim; const v = st.view;
  const live = t.schedules.filter((s) => s.status !== 'Departed'); const tot = totals(t.counts);
  const act = (ty) => live.filter((s) => s.type === ty).length;
  const upcoming = [...live].sort((a, b) => a.depart.localeCompare(b.depart)).slice(0, 4);
  const line = t.counts.map((c) => ({ hour: `${c.hour}:00`, Passengers: hourTotal(c) }));
  const pie = TYPES.map((n) => ({ name: n, value: tot[n] }));
  return (
    <div className="space-y-4">
      <PageTitle title="Dashboard" hint="A quick look at today’s terminal: vehicles, passengers and what leaves next." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Registered vehicles" value={t.schedules.length} icon={Route} /><Stat label="Active jeepneys" value={act('Jeepney')} icon={Truck} />
        <Stat label="Active buses" value={act('Bus')} icon={Bus} /><Stat label="Active tricycles" value={act('Tricycle')} icon={Bike} />
        <Stat label="Passengers today (sample)" value={Object.values(tot).reduce((a, b) => a + b, 0)} icon={Users} />
        <Stat label="Waiting passengers" value={live.reduce((a, s) => a + s.pax, 0)} icon={Hourglass} />
        <Stat label="Vehicles in operation" value={live.filter((s) => s.status !== 'Waiting').length} icon={Route} />
        <Stat label={`${word(v, 'ctx')}`} value={sim.ctx} icon={Clock} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Passenger demand">
          <ResponsiveContainer width="100%" height={240}><LineChart data={line}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><Line dataKey="Passengers" stroke="#142B45" strokeWidth={3} /></LineChart></ResponsiveContainer></Card>
        <Card title="Vehicle type share">
          <ResponsiveContainer width="100%" height={240}><PieChart><Pie data={pie} dataKey="value" nameKey="name" label>{pie.map((_, i) => <Cell key={i} fill={COL[i]} />)}</Pie><Legend /><Tooltip /></PieChart></ResponsiveContainer></Card>
        <Card title="Hourly traffic by type">
          <ResponsiveContainer width="100%" height={240}><BarChart data={t.counts}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><Legend />{TYPES.map((n, i) => <Bar key={n} dataKey={n} stackId="a" fill={COL[i]} />)}</BarChart></ResponsiveContainer></Card>
        <Card title="Upcoming departures"><ul className="space-y-2">{upcoming.map((s) => <li key={s.id} className="flex items-center justify-between gap-2 rounded-xl bg-[#F4F6F8] p-3"><span><b>{s.depart}</b> {s.type} to {s.dest}</span><Badge s={s.status} /></li>)}</ul></Card>
        <Card title={v === 'OS' ? 'CPU activity' : 'Terminal Processing Unit'}>
          <p className="text-base">Now: <b>{sim.running ? (v === 'OS' ? sim.running : sim.procs.find((p) => p.pid === sim.running).name) : 'idle'}</b> · {word(v, 'queue')}: {sim.queue.length}</p>
          <ul className="mt-2 text-base">{sim.procs.slice(0, 6).map((p) => <li key={p.pid}>{v === 'OS' ? `${p.pid} · ` : ''}{p.name}: <b>{stateLabel(v, p.state)}</b></li>)}</ul></Card>
        <Card title="Recent activity"><ul className="space-y-1 text-base">{t.activity.map((a, i) => <li key={i}>• {a}</li>)}</ul></Card>
      </div>
    </div>);
}
