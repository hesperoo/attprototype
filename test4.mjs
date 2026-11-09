import { reducer, init } from './src/data/terminalStore.js';
import { alerts, peak, totals } from './src/utils/analytics.js';
let s = init(); const d = (a) => { s = reducer(s, a); };
d({ type: 'add', v: { type: 'Bus', dest: 'Silang', depart: '10:00', eta: '11:00', cap: 50, pax: 0 } });
d({ type: 'status', id: 'BU-400', status: 'Departed' }); d({ type: 'edit', v: { id: 'BU-400', dest: 'Indang' } });
console.log(s.schedules.at(-1)); d({ type: 'del', id: 'BU-400' }); console.log('rows', s.schedules.length);
d({ type: 'count', hour: 8, ptype: 'Jeepney', n: 200 });
console.log('peak', peak(s.counts).hour, totals(s.counts)); console.log(alerts(s.counts).map((a) => a.text + ' +' + a.extra));
