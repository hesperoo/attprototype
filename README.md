# Alfonso Terminal Tracker
Scenario-driven Operating System simulator themed as a public transport terminal in Alfonso, Cavite. All data is simulated.

## Install and run
    npm install
    npm run dev          # open the printed http://localhost:5173 address
    npm run build        # production build
    npm run test:sim     # Node tests for the scheduler, kernel, managers and store

Demo login: `admin` / `terminal123` (or press **Demo Login**).

## Demo flow
Login -> Dashboard -> Schedules -> Passengers (record a count) -> OS Simulator (press **Boot**, create a process, pick an algorithm, START, click a Gantt block for "Why?", drag the Time Machine slider) -> toggle OS VIEW / TERMINAL VIEW -> Threads -> Deadlock Demo.
Marking a vehicle **Departed** (Schedules or Queues) creates an OS process via a CREATE_PROCESS system call once the kernel is booted.

## Structure
`src/simulator/` scheduler, kernel, processManager, threadManager, deadlock, store (pure JS, own code) · `src/pages/` screens · `src/layouts/` sidebar layout · `src/data/` sample data · `src/hooks/` providers · `src/utils/` analytics and OS/Terminal vocabulary.

## Accessibility
Large touch targets, text-size buttons (A−/A+), icon + text labels, visible focus rings, plain-language hints on every page, responsive menu.
