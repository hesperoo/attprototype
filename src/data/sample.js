// ALL DATA HERE IS SIMULATED for the academic prototype. It is not real Alfonso terminal data.
export const TYPES = ['Jeepney', 'Bus', 'Tricycle'];
export const STATUSES = ['Waiting', 'Loading', 'Ready', 'Departed'];
export const CAP = { Jeepney: 16, Bus: 50, Tricycle: 3 };
const bump = (h, c) => Math.exp(-((h - c) ** 2) / 4);
export const HOURS = Array.from({ length: 16 }, (_, i) => i + 5);
export const initialCounts = () => HOURS.map((h) => ({ hour: h,
  Jeepney: Math.round(25 + 70 * bump(h, 7) + 60 * bump(h, 17)),
  Bus: Math.round(10 + 35 * bump(h, 6) + 30 * bump(h, 18)),
  Tricycle: Math.round(15 + 30 * bump(h, 8) + 25 * bump(h, 16)) }));
const S = (id, type, dest, depart, eta, status, pax) => ({ id, type, dest, depart, eta, status, cap: CAP[type], pax });
export const initialSchedules = [
  S('JE-101', 'Jeepney', 'Tagaytay', '06:30', '07:30', 'Departed', 16), S('JE-102', 'Jeepney', 'Indang', '08:00', '08:45', 'Ready', 15),
  S('JE-103', 'Jeepney', 'Amadeo', '08:20', '08:50', 'Loading', 9), S('JE-104', 'Jeepney', 'Mendez', '08:40', '09:10', 'Waiting', 0),
  S('BU-201', 'Bus', 'Dasmariñas', '07:45', '08:45', 'Departed', 48), S('BU-202', 'Bus', 'Trece Martires', '09:00', '09:50', 'Loading', 31),
  S('BU-203', 'Bus', 'Tagaytay', '09:30', '10:30', 'Waiting', 0), S('TR-301', 'Tricycle', 'Poblacion', '08:05', '08:20', 'Ready', 3),
  S('TR-302', 'Tricycle', 'Magallanes Road', '08:10', '08:30', 'Loading', 2), S('TR-303', 'Tricycle', 'Poblacion', '08:25', '08:40', 'Waiting', 0),
];
