import { LayoutDashboard, CalendarClock, Users, ListOrdered, Cpu, GitBranch, AlertTriangle, LogOut, Bus } from 'lucide-react';
import { useSim } from '../hooks/useSimulation.jsx';
import { Btn } from '../components/ui.jsx';
export const NAV = [['Dashboard', LayoutDashboard], ['Schedules', CalendarClock], ['Passengers', Users], ['Vehicle Queues', ListOrdered], ['OS Simulator', Cpu], ['Threads', GitBranch], ['Deadlock Demo', AlertTriangle]];
export default function AppLayout({ page, setPage, onLogout, size, setSize, children }) {
  const { st, dispatch } = useSim();
  return (
    <div className="min-h-screen bg-[#F4F6F8] md:flex">
      <nav aria-label="Main menu" className="bg-[#142B45] text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-2 px-4 py-4 text-lg font-bold"><Bus aria-hidden="true" />Alfonso Terminal Tracker</div>
        <ul className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">{NAV.map(([n, I]) => (
          <li key={n}><button onClick={() => setPage(n)} aria-current={page === n ? 'page' : undefined}
            className={`flex min-h-[48px] w-full items-center gap-3 whitespace-nowrap rounded-xl px-4 text-base focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E9A23B] ${page === n ? 'bg-[#334E68] font-semibold' : 'hover:bg-[#334E68]/60'}`}><I size={22} aria-hidden="true" />{n}</button></li>))}</ul>
      </nav>
      <div className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center gap-3 bg-white px-4 py-3 shadow-sm">
          <div className="flex overflow-hidden rounded-xl border-2 border-[#142B45]" role="group" aria-label="Choose view">
            {[['OS', 'OS VIEW'], ['TERMINAL', 'TERMINAL VIEW']].map(([v, l]) => (
              <button key={v} onClick={() => dispatch({ type: 'view', view: v })} aria-pressed={st.view === v} className={`min-h-[44px] px-4 text-base font-semibold ${st.view === v ? 'bg-[#142B45] text-white' : 'text-[#142B45]'}`}>{l}</button>))}</div>
          <div className="ml-auto flex items-center gap-2" role="group" aria-label="Text size">
            <span className="text-base">Text size</span>
            <Btn variant="outline" aria-label="Smaller text" onClick={() => setSize(Math.max(0, size - 1))}>A−</Btn>
            <Btn variant="outline" aria-label="Larger text" onClick={() => setSize(Math.min(3, size + 1))}>A+</Btn>
            <Btn variant="outline" icon={LogOut} onClick={onLogout}>Log out</Btn></div>
        </header>
        <p className="bg-[#FFF4DC] px-4 py-2 text-base text-[#5C3B00]">All numbers shown are simulated sample data for a school project, not real terminal statistics.</p>
        <main className="mx-auto max-w-6xl p-4">{children}</main>
      </div>
    </div>);
}
