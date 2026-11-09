import { initialSchedules, initialCounts } from './sample.js';
export const init = () => ({ schedules: initialSchedules, counts: initialCounts(), activity: ['Simulated sample data loaded.'], nextId: 400 });
const log = (s, m) => ({ ...s, activity: [`${new Date().toTimeString().slice(0, 5)} ${m}`, ...s.activity].slice(0, 12) });
export function reducer(s, a) {
  switch (a.type) {
    case 'add': { const id = `${a.v.type.slice(0, 2).toUpperCase()}-${s.nextId}`;
      return log({ ...s, nextId: s.nextId + 1, schedules: [...s.schedules, { ...a.v, id, status: 'Waiting' }] }, `Added schedule ${id} to ${a.v.dest}.`); }
    case 'edit': return log({ ...s, schedules: s.schedules.map((x) => (x.id === a.v.id ? { ...x, ...a.v } : x)) }, `Updated schedule ${a.v.id}.`);
    case 'del': return log({ ...s, schedules: s.schedules.filter((x) => x.id !== a.id) }, `Deleted schedule ${a.id}.`);
    case 'status': return log({ ...s, schedules: s.schedules.map((x) => (x.id === a.id ? { ...x, status: a.status } : x)) }, `${a.id} is now ${a.status}.`);
    case 'count': return log({ ...s, counts: s.counts.map((c) => (c.hour === a.hour ? { ...c, [a.ptype]: c[a.ptype] + a.n } : c)) }, `Recorded ${a.n} ${a.ptype} passengers for ${a.hour}:00.`);
    default: return s;
  }
}
