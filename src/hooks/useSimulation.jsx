import { createContext, useContext, useEffect, useReducer } from 'react';
import { reducer, initState } from '../simulator/store.js';
const Ctx = createContext(null);
export function SimProvider({ children }) {
  const [st, dispatch] = useReducer(reducer, undefined, initState);
  // A timer drives ticks, so the UI never blocks; cleanup stops it on pause/unmount.
  useEffect(() => {
    if (!st.running) return;
    const id = setInterval(() => dispatch({ type: 'step' }), 700);
    return () => clearInterval(id);
  }, [st.running]);
  return <Ctx.Provider value={{ st, dispatch }}>{children}</Ctx.Provider>;
}
export const useSim = () => useContext(Ctx);
