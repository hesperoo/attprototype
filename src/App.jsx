// App shell: login -> layout with sidebar. One SimProvider + one TerminalProvider keep state alive across pages and views.
import { useEffect, useState } from 'react';
import { SimProvider } from './hooks/useSimulation.jsx';
import { TerminalProvider } from './hooks/useTerminal.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Schedules from './pages/Schedules.jsx';
import Passengers from './pages/Passengers.jsx';
import Queues from './pages/Queues.jsx';
import OSSimulator from './pages/OSSimulator.jsx';
import Threads from './pages/Threads.jsx';
import Deadlock from './pages/Deadlock.jsx';
const PAGES = { Dashboard, Schedules, Passengers, 'Vehicle Queues': Queues, 'OS Simulator': OSSimulator, Threads, 'Deadlock Demo': Deadlock };
const SIZES = [16, 18, 20, 22];
export default function App() {
  const [user, setUser] = useState(null); const [page, setPage] = useState('Dashboard'); const [size, setSize] = useState(1);
  useEffect(() => { document.documentElement.style.fontSize = `${SIZES[size]}px`; }, [size]);
  const Page = PAGES[page];
  return (
    <SimProvider><TerminalProvider>
      {user ? <AppLayout page={page} setPage={setPage} onLogout={() => setUser(null)} size={size} setSize={setSize}><Page /></AppLayout> : <Login onLogin={setUser} />}
    </TerminalProvider></SimProvider>);
}
