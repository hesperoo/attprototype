import { createContext, useContext, useReducer } from 'react';
import { reducer, init } from '../data/terminalStore.js';
import { STATUSES } from '../data/sample.js';
import { useSim } from './useSimulation.jsx';
const Ctx = createContext(null);
export function TerminalProvider({ children }) {
  const [t, dispatch] = useReducer(reducer, undefined, init);
  return <Ctx.Provider value={{ t, dispatch }}>{children}</Ctx.Provider>;
}
export const useTerm = () => useContext(Ctx);
// Moving a vehicle to a new status; "Departed" also spawns an OS process (a CREATE_PROCESS system call) so both worlds stay linked.
export function useVehicleActions() {
  const { dispatch } = useTerm(); const sim = useSim();
  const setStatus = (v, status) => {
    dispatch({ type: 'status', id: v.id, status });
    if (status === 'Departed') sim.dispatch({ type: 'syscall', name: 'CREATE_PROCESS', args: { name: `${v.type} Departure ${v.id}`, burst: 3 } });
  };
  return { setStatus, next: (v) => STATUSES[Math.min(STATUSES.indexOf(v.status) + 1, 3)] };
}
