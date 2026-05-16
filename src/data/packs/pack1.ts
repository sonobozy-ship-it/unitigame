import { Level } from '../levels';

// Pack 1 — 5x5 grid, Tutorial (levels 1–25)
const pack1: Level[] = [
  // Level 1 — 2 colors, simple L-shape
  { id: 1,  size: 5, par: 10, dots: [{ color: 'red',  start: [0,0], end: [2,2] }, { color: 'blue', start: [0,4], end: [4,0] }] },
  // Level 2
  { id: 2,  size: 5, par: 12, dots: [{ color: 'red',  start: [0,0], end: [4,4] }, { color: 'blue', start: [0,4], end: [4,0] }, { color: 'green', start: [2,0], end: [2,4] }] },
  // Level 3
  { id: 3,  size: 5, par: 12, dots: [{ color: 'red',  start: [0,0], end: [0,4] }, { color: 'blue', start: [4,0], end: [4,4] }, { color: 'green', start: [2,1], end: [2,3] }] },
  // Level 4
  { id: 4,  size: 5, par: 14, dots: [{ color: 'red',  start: [0,0], end: [4,2] }, { color: 'blue', start: [0,4], end: [4,4] }, { color: 'green', start: [1,1], end: [3,3] }] },
  // Level 5
  { id: 5,  size: 5, par: 14, dots: [{ color: 'red',  start: [0,1], end: [4,3] }, { color: 'blue', start: [0,3], end: [4,1] }, { color: 'yellow',start: [2,0], end: [2,4] }] },
  // Level 6
  { id: 6,  size: 5, par: 15, dots: [{ color: 'red',  start: [0,0], end: [2,4] }, { color: 'blue', start: [0,2], end: [4,4] }, { color: 'green', start: [4,0], end: [2,2] }] },
  // Level 7
  { id: 7,  size: 5, par: 16, dots: [{ color: 'red',  start: [0,0], end: [4,0] }, { color: 'blue', start: [0,4], end: [4,4] }, { color: 'green', start: [0,2], end: [4,2] }, { color: 'yellow', start: [2,1], end: [2,3] }] },
  // Level 8
  { id: 8,  size: 5, par: 16, dots: [{ color: 'red',  start: [0,0], end: [3,3] }, { color: 'blue', start: [0,4], end: [3,1] }, { color: 'green', start: [4,0], end: [1,3] }, { color: 'yellow', start: [4,4], end: [1,1] }] },
  // Level 9
  { id: 9,  size: 5, par: 17, dots: [{ color: 'red',  start: [0,0], end: [4,4] }, { color: 'blue', start: [0,2], end: [2,4] }, { color: 'green', start: [2,0], end: [4,2] }, { color: 'yellow', start: [0,4], end: [4,0] }] },
  // Level 10
  { id: 10, size: 5, par: 18, dots: [{ color: 'red',  start: [0,0], end: [2,2] }, { color: 'blue', start: [0,4], end: [2,4] }, { color: 'green', start: [4,0], end: [4,4] }, { color: 'yellow', start: [1,2], end: [4,2] }] },
  // Level 11
  { id: 11, size: 5, par: 18, dots: [{ color: 'red',  start: [0,1], end: [2,3] }, { color: 'blue', start: [0,3], end: [4,3] }, { color: 'green', start: [1,0], end: [3,0] }, { color: 'yellow', start: [3,2], end: [4,4] }] },
  // Level 12
  { id: 12, size: 5, par: 19, dots: [{ color: 'red',  start: [0,0], end: [4,3] }, { color: 'blue', start: [0,3], end: [4,0] }, { color: 'green', start: [1,1], end: [3,3] }, { color: 'yellow', start: [1,3], end: [3,1] }] },
  // Level 13
  { id: 13, size: 5, par: 20, dots: [{ color: 'red',  start: [0,0], end: [1,4] }, { color: 'blue', start: [0,2], end: [4,4] }, { color: 'green', start: [2,0], end: [4,2] }, { color: 'yellow', start: [2,2], end: [4,0] }, { color: 'orange', start: [0,4], end: [3,1] }] },
  // Level 14
  { id: 14, size: 5, par: 20, dots: [{ color: 'red',  start: [0,0], end: [2,1] }, { color: 'blue', start: [0,4], end: [2,3] }, { color: 'green', start: [4,0], end: [2,0] }, { color: 'yellow', start: [4,4], end: [2,4] }, { color: 'orange', start: [1,2], end: [4,2] }] },
  // Level 15
  { id: 15, size: 5, par: 20, dots: [{ color: 'red',  start: [0,0], end: [0,4] }, { color: 'blue', start: [4,0], end: [4,4] }, { color: 'green', start: [0,2], end: [4,2] }, { color: 'yellow', start: [2,0], end: [2,4] }, { color: 'orange', start: [1,1], end: [3,3] }] },
  // Level 16
  { id: 16, size: 5, par: 21, dots: [{ color: 'red',  start: [0,0], end: [3,2] }, { color: 'blue', start: [0,4], end: [3,3] }, { color: 'green', start: [2,0], end: [4,2] }, { color: 'yellow', start: [1,3], end: [4,1] }, { color: 'orange', start: [2,4], end: [4,4] }] },
  // Level 17
  { id: 17, size: 5, par: 21, dots: [{ color: 'red',  start: [0,1], end: [4,1] }, { color: 'blue', start: [0,3], end: [4,3] }, { color: 'green', start: [1,0], end: [3,4] }, { color: 'yellow', start: [1,4], end: [3,0] }, { color: 'orange', start: [2,2], end: [4,4] }] },
  // Level 18
  { id: 18, size: 5, par: 22, dots: [{ color: 'red',  start: [0,0], end: [4,4] }, { color: 'blue', start: [0,4], end: [4,0] }, { color: 'green', start: [0,2], end: [4,2] }, { color: 'yellow', start: [2,0], end: [2,4] }, { color: 'orange', start: [1,1], end: [3,1] }, { color: 'purple', start: [1,3], end: [3,3] }] },
  // Level 19
  { id: 19, size: 5, par: 22, dots: [{ color: 'red',  start: [0,0], end: [2,4] }, { color: 'blue', start: [0,2], end: [4,4] }, { color: 'green', start: [0,4], end: [4,2] }, { color: 'yellow', start: [2,0], end: [4,0] }, { color: 'orange', start: [4,1], end: [1,3] }, { color: 'purple', start: [3,2], end: [1,1] }] },
  // Level 20
  { id: 20, size: 5, par: 23, dots: [{ color: 'red',  start: [0,0], end: [4,1] }, { color: 'blue', start: [0,1], end: [4,0] }, { color: 'green', start: [0,3], end: [4,4] }, { color: 'yellow', start: [0,4], end: [4,3] }, { color: 'orange', start: [2,1], end: [2,3] }, { color: 'purple', start: [1,2], end: [3,2] }] },
  // Level 21
  { id: 21, size: 5, par: 23, dots: [{ color: 'red',  start: [0,0], end: [1,2] }, { color: 'blue', start: [0,4], end: [1,2] }, { color: 'green', start: [3,0], end: [2,3] }, { color: 'yellow', start: [3,4], end: [4,1] }, { color: 'orange', start: [0,2], end: [4,4] }, { color: 'purple', start: [2,1], end: [4,3] }] },
  // Level 22
  { id: 22, size: 5, par: 24, dots: [{ color: 'red',  start: [0,0], end: [0,3] }, { color: 'blue', start: [1,0], end: [1,4] }, { color: 'green', start: [2,1], end: [2,3] }, { color: 'yellow', start: [3,0], end: [3,4] }, { color: 'orange', start: [4,1], end: [4,3] }, { color: 'purple', start: [0,4], end: [4,0] }] },
  // Level 23
  { id: 23, size: 5, par: 24, dots: [{ color: 'red',  start: [0,0], end: [4,4] }, { color: 'blue', start: [0,4], end: [4,0] }, { color: 'green', start: [1,1], end: [3,3] }, { color: 'yellow', start: [1,3], end: [3,1] }, { color: 'orange', start: [0,2], end: [2,0] }, { color: 'purple', start: [2,4], end: [4,2] }] },
  // Level 24
  { id: 24, size: 5, par: 25, dots: [{ color: 'red',  start: [0,0], end: [0,2] }, { color: 'blue', start: [0,4], end: [2,4] }, { color: 'green', start: [4,0], end: [4,2] }, { color: 'yellow', start: [4,4], end: [2,0] }, { color: 'orange', start: [1,1], end: [3,3] }, { color: 'purple', start: [1,3], end: [3,1] }, { color: 'cyan', start: [2,2], end: [0,3] }] },
  // Level 25 — hard finale for pack 1
  { id: 25, size: 5, par: 25, dots: [{ color: 'red',  start: [0,0], end: [2,3] }, { color: 'blue', start: [0,2], end: [3,4] }, { color: 'green', start: [0,4], end: [4,2] }, { color: 'yellow', start: [2,0], end: [4,4] }, { color: 'orange', start: [1,1], end: [4,0] }, { color: 'purple', start: [3,1], end: [1,4] }, { color: 'cyan', start: [3,3], end: [4,1] }] },
];

export default pack1;
