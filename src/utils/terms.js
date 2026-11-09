// OS View <-> Terminal View vocabulary. Same data, different words.
export const STATE_TERM = { NEW: 'Registered', READY: 'Waiting for Dispatch', RUNNING: 'Currently Being Processed', WAITING: 'Waiting for Passenger Loading', TERMINATED: 'Departure Completed' };
const W = { cpu: ['CPU', 'Terminal Processing Unit'], queue: ['Ready Queue', 'Dispatch Queue'], ctx: ['Context Switches', 'Operation Switches'], proc: ['Processes', 'Terminal Operations'], gantt: ['Gantt Chart', 'Operations Timeline'] };
export const word = (view, k) => W[k][view === 'OS' ? 0 : 1];
export const stateLabel = (view, s) => (view === 'OS' ? s : STATE_TERM[s]);
export const STATE_COLOR = { NEW: 'bg-slate-200 text-slate-700', READY: 'bg-blue-100 text-blue-800', RUNNING: 'bg-[#4C956C] text-white', WAITING: 'bg-[#E9A23B] text-white', TERMINATED: 'bg-gray-300 text-gray-600' };
