import { ArrowRight } from 'lucide-react';
import { useTerm, useVehicleActions } from '../hooks/useTerminal.jsx';
import { Card, Btn, PageTitle } from '../components/ui.jsx';
import { TYPES, STATUSES } from '../data/sample.js';
const HELP = { Waiting: 'In line', Loading: 'Boarding passengers', Ready: 'Ready to leave', Departed: 'Already left' };
export default function Queues() {
  const { t } = useTerm(); const { setStatus, next } = useVehicleActions();
  return (
    <div className="space-y-4">
      <PageTitle title="Vehicle Queues" hint="Each vehicle moves left to right: In line → Boarding → Ready → Left. Press the button to move one forward." />
      {TYPES.map((ty) => <Card key={ty} title={`${ty} queue`}><div className="grid gap-3 md:grid-cols-4">{STATUSES.map((st) => (
        <div key={st} className="rounded-xl bg-[#F4F6F8] p-3"><h3 className="font-semibold">{st}</h3><p className="mb-2 text-sm text-slate-600">{HELP[st]}</p>
          <ul className="space-y-2">{t.schedules.filter((s) => s.type === ty && s.status === st).map((s) => (
            <li key={s.id} className="rounded-lg bg-white p-2 text-base"><b>{s.id}</b> to {s.dest}<br />{s.pax}/{s.cap} passengers
              {st !== 'Departed' && <Btn className="mt-1" variant="outline" icon={ArrowRight} onClick={() => setStatus(s, next(s))}>Move to {next(s)}</Btn>}</li>))}</ul></div>))}</div></Card>)}
    </div>);
}
