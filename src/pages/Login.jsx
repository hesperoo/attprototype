import { useState } from 'react';
import { Bus, LogIn } from 'lucide-react';
import { Btn, Field, inputCls } from '../components/ui.jsx';
export default function Login({ onLogin }) {
  let saved = ''; try { saved = localStorage.getItem('att-user') || ''; } catch { /* storage blocked: ignore */ }
  const [u, setU] = useState(saved); const [p, setP] = useState(''); const [rem, setRem] = useState(!!saved); const [err, setErr] = useState('');
  const submit = (e) => { e.preventDefault();
    if (u === 'admin' && p === 'terminal123') { try { rem ? localStorage.setItem('att-user', u) : localStorage.removeItem('att-user'); } catch { /* ignore */ } onLogin(u); }
    else setErr('Wrong username or password. Tip: use the Demo Login button.'); };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#142B45] p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-center gap-2 text-2xl font-bold text-[#142B45]"><Bus aria-hidden="true" />Alfonso Terminal Tracker</div>
        <p className="text-slate-700">A terminal management system that doubles as an Operating System simulator. Demo login: <b>admin</b> / <b>terminal123</b>.</p>
        <Field label="Username"><input className={inputCls} value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" /></Field>
        <Field label="Password"><input className={inputCls} type="password" value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" /></Field>
        <label className="flex items-center gap-2 text-base"><input type="checkbox" className="h-5 w-5" checked={rem} onChange={(e) => setRem(e.target.checked)} />Remember me</label>
        {err && <p role="alert" className="rounded-lg bg-orange-50 p-2 text-[#8A4B00]">{err}</p>}
        <div className="flex flex-wrap gap-2"><Btn icon={LogIn} type="submit">Log in</Btn><Btn variant="good" type="button" onClick={() => onLogin('admin')}>Demo Login</Btn></div>
      </form>
    </div>);
}
