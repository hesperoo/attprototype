import { TYPES, CAP } from '../data/sample.js';
const PL = { Jeepney: 'jeepneys', Bus: 'buses', Tricycle: 'tricycles' };
export const hourTotal = (c) => TYPES.reduce((a, t) => a + c[t], 0);
export const totals = (counts) => Object.fromEntries(TYPES.map((t) => [t, counts.reduce((a, c) => a + c[t], 0)]));
export const peak = (counts) => counts.reduce((a, c) => (hourTotal(c) > hourTotal(a) ? c : a));
// Demand alert: a type's busiest hour is 50%+ above its own average -> suggest extra vehicles.
export function alerts(counts) {
  return TYPES.flatMap((type) => {
    const vals = counts.map((c) => c[type]); const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    const top = counts.reduce((a, c) => (c[type] > a[type] ? c : a)); if (top[type] < avg * 1.5) return [];
    return [{ type, hour: top.hour, peak: top[type], avg: Math.round(avg), extra: Math.max(1, Math.ceil((top[type] - avg) / CAP[type])),
      text: `High Passenger Demand Detected: Passenger volume for ${PL[type]} is higher than usual around ${top.hour}:00. Consider allocating additional vehicles.` }];
  });
}
