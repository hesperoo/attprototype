// Shared, accessibility-minded building blocks: big touch targets, clear focus rings, icon + text labels.
const FOCUS = 'focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E9A23B]';
export const Card = ({ title, icon: I, children, className = '' }) => (
  <section className={`rounded-2xl bg-white p-5 shadow-sm ${className}`}>
    {title && <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#142B45]">{I && <I size={22} aria-hidden="true" />}{title}</h2>}{children}</section>);
export const Btn = ({ icon: I, variant = 'primary', children, ...p }) => (
  <button {...p} className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-base font-medium disabled:opacity-40 ${FOCUS} ${
    variant === 'primary' ? 'bg-[#142B45] text-white hover:bg-[#334E68]' : variant === 'danger' ? 'bg-[#B3261E] text-white' : variant === 'good' ? 'bg-[#2F7A52] text-white' : 'border-2 border-[#334E68] bg-white text-[#142B45] hover:bg-[#F4F6F8]'}`}>
    {I && <I size={18} aria-hidden="true" />}{children}</button>);
export const Stat = ({ label, value, icon: I }) => (
  <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm"><div className="rounded-xl bg-[#F4F6F8] p-3 text-[#334E68]"><I size={24} aria-hidden="true" /></div>
    <div><p className="text-2xl font-bold text-[#142B45]">{value}</p><p className="text-sm text-slate-600">{label}</p></div></div>);
const SC = { Waiting: 'bg-slate-200 text-slate-800', Loading: 'bg-[#E9A23B] text-[#142B45]', Ready: 'bg-blue-100 text-blue-900', Departed: 'bg-[#2F7A52] text-white' };
export const Badge = ({ s }) => <span className={`rounded-full px-3 py-1 text-sm font-medium ${SC[s]}`}>{s}</span>;
export const PageTitle = ({ title, hint }) => <div className="mb-4"><h1 className="text-2xl font-bold text-[#142B45]">{title}</h1><p className="text-slate-600">{hint}</p></div>;
export const Field = ({ label, children }) => <label className="flex flex-col gap-1 text-base font-medium text-[#142B45]">{label}{children}</label>;
export const inputCls = 'min-h-[44px] rounded-xl border-2 border-slate-300 bg-white px-3 text-base font-normal focus:outline-none focus-visible:ring-4 focus-visible:ring-[#E9A23B]';
