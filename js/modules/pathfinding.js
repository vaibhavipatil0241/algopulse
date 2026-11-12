/**
 * Pathfinding & Graph Visualizer
 * Supports Dijkstra, A*, BFS, DFS, and Maze Generation with interactive drawing.
 */

class PathfindingVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.rows = 20;
    this.cols = 40;
    this.grid = [];
    this.startNode = { r: 9, c: 8 };
    this.targetNode = { r: 9, c: 31 };

    this.isMouseDown = false;
    this.isDraggingStart = false;
    this.isDraggingTarget = false;
    this.drawMode = 'wall'; // 'wall' or 'weight'

    this.nodeElements = [];
  }

  init() {
    this.createGrid();
    this.setupEventListeners();
  }

  createGrid() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.grid = [];
    this.nodeElements = [];

    const board = document.createElement('div');
    board.className = 'grid-board';
    board.style.gridTemplateColumns = `repeat(${this.cols}, 25px)`;
    board.style.gridTemplateRows = `repeat(${this.rows}, 25px)`;

    for (let r = 0; r < this.rows; r++) {
      const rowArr = [];
      const rowElements = [];
      for (let c = 0; c < this.cols; c++) {
        const isStart = r === this.startNode.r && c === this.startNode.c;
        const isTarget = r === this.targetNode.r && c === this.targetNode.c;

        const nodeData = {
          r, c,
          isWall: false,
          weight: 1,
          isVisited: false,
          isPath: false
        };
        rowArr.push(nodeData);

        const nodeEl = document.createElement('div');
        nodeEl.className = 'grid-node';
        nodeEl.dataset.r = r;
        nodeEl.dataset.c = c;

        if (isStart) nodeEl.classList.add('node-start');
        if (isTarget) nodeEl.classList.add('node-target');

        board.appendChild(nodeEl);
        rowElements.push(nodeEl);
      }
      this.grid.push(rowArr);
      this.nodeElements.push(rowElements);
    }

    this.container.appendChild(board);
  }

  setupEventListeners() {
    if (!this.container) return;

    this.container.addEventListener('mousedown', (e) => {
      const target = e.target.closest('.grid-node');
      if (!target) return;
      e.preventDefault();
      this.isMouseDown = true;

      const r = parseInt(target.dataset.r);
      const c = parseInt(target.dataset.c);

      if (r === this.startNode.r && c === this.startNode.c) {
        this.isDraggingStart = true;
      } else if (r === this.targetNode.r && c === this.targetNode.c) {
        this.isDraggingTarget = true;
      } else {
        this.toggleNodeWallOrWeight(r, c);
      }
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
      this.isDraggingStart = false;
      this.isDraggingTarget = false;
    });

    this.container.addEventListener('mouseover', (e) => {
      if (!this.isMouseDown) return;
      const target = e.target.closest('.grid-node');
      if (!target) return;

      const r = parseInt(target.dataset.r);
      const c = parseInt(target.dataset.c);

      if (this.isDraggingStart) {
        if (!this.grid[r][c].isWall && !(r === this.targetNode.r && c === this.targetNode.c)) {
          this.nodeElements[this.startNode.r][this.startNode.c].classList.remove('node-start');
          this.startNode = { r, c };
          this.nodeElements[r][c].classList.add('node-start');
        }
      } else if (this.isDraggingTarget) {
        if (!this.grid[r][c].isWall && !(r === this.startNode.r && c === this.startNode.c)) {
          this.nodeElements[this.targetNode.r][this.targetNode.c].classList.remove('node-target');
          this.targetNode = { r, c };
          this.nodeElements[r][c].classList.add('node-target');
        }
      } else {
        this.toggleNodeWallOrWeight(r, c);
      }
    });
  }

  toggleNodeWallOrWeight(r, c) {
    if ((r === this.startNode.r && c === this.startNode.c) ||
        (r === this.targetNode.r && c === this.targetNode.c)) {
      return;
    }

    const node = this.grid[r][c];
    const el = this.nodeElements[r][c];

    if (this.drawMode === 'weight') {
      node.isWall = false;
      node.weight = node.weight === 1 ? 5 : 1;
      el.classList.remove('node-wall');
      el.classList.toggle('node-weight', node.weight > 1);
    } else {
      node.weight = 1;
      node.isWall = !node.isWall;
      el.classList.remove('node-weight');
      el.classList.toggle('node-wall', node.isWall);
    }
  }

  clearPathOnly() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c].isVisited = false;
        this.grid[r][c].isPath = false;
        const el = this.nodeElements[r][c];
        el.classList.remove('node-visited', 'node-path');
      }
    }
  }

  clearBoard() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.grid[r][c].isWall = false;
        this.grid[r][c].weight = 1;
        this.grid[r][c].isVisited = false;
        this.grid[r][c].isPath = false;
        const el = this.nodeElements[r][c];
        el.className = 'grid-node';
        if (r === this.startNode.r && c === this.startNode.c) el.classList.add('node-start');
        if (r === this.targetNode.r && c === this.targetNode.c) el.classList.add('node-target');
      }
    }
  }

  generateRandomMaze(density = 0.28) {
    this.clearBoard();
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if ((r === this.startNode.r && c === this.startNode.c) ||
            (r === this.targetNode.r && c === this.targetNode.c)) {
          continue;
        }
        if (Math.random() < density) {
          this.grid[r][c].isWall = true;
          this.nodeElements[r][c].classList.add('node-wall');
        }
      }
    }
  }

  generateRecursiveMaze() {
    this.clearBoard();
    // Fill perimeter walls
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (r === 0 || r === this.rows - 1 || c === 0 || c === this.cols - 1) {
          if (!(r === this.startNode.r && c === this.startNode.c) &&
              !(r === this.targetNode.r && c === this.targetNode.c)) {
            this.grid[r][c].isWall = true;
            this.nodeElements[r][c].classList.add('node-wall');
          }
        }
      }
    }

    const divide = (r1, r2, c1, c2) => {
      if (r2 - r1 < 3 || c2 - c1 < 3) return;

      const horizontal = (r2 - r1) > (c2 - c1);
      if (horizontal) {
        const wallR = Math.floor((r1 + r2) / 2);
        const passageC = Math.floor(Math.random() * (c2 - c1 - 1)) + c1 + 1;

        for (let c = c1; c <= c2; c++) {
          if (c !== passageC &&
              !(wallR === this.startNode.r && c === this.startNode.c) &&
              !(wallR === this.targetNode.r && c === this.targetNode.c)) {
            this.grid[wallR][c].isWall = true;
            this.nodeElements[wallR][c].classList.add('node-wall');
          }
        }

        divide(r1, wallR - 1, c1, c2);
        divide(wallR + 1, r2, c1, c2);
      } else {
        const wallC = Math.floor((c1 + c2) / 2);
        const passageR = Math.floor(Math.random() * (r2 - r1 - 1)) + r1 + 1;

        for (let r = r1; r <= r2; r++) {
          if (r !== passageR &&
              !(r === this.startNode.r && wallC === this.startNode.c) &&
              !(r === this.targetNode.r && wallC === this.targetNode.c)) {
            this.grid[r][wallC].isWall = true;
            this.nodeElements[r][wallC].classList.add('node-wall');
          }
        }

        divide(r1, r2, c1, wallC - 1);
        divide(r1, r2, wallC + 1, c2);
      }
    };

    divide(1, this.rows - 2, 1, this.cols - 2);
  }

  // ----------------------------------------------------------
  // STEP EXECUTION & UNDO
  // ----------------------------------------------------------
  applyStep(step, isFastForward = false) {
    if (step.type === 'visit') {
      const { r, c } = step.node;
      const el = this.nodeElements[r][c];
      if (!el.classList.contains('node-start') && !el.classList.contains('node-target')) {
        el.classList.add('node-visited');
      }
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playStep(step.weight || 1);
      }
    } else if (step.type === 'path') {
      const { r, c } = step.node;
      const el = this.nodeElements[r][c];
      if (!el.classList.contains('node-start') && !el.classList.contains('node-target')) {
        el.classList.add('node-path');
      }
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playValueTone(step.cost || 50, 0, 100, 0.04);
      }
    }
  }

  undoStep(step) {
    const { r, c } = step.node;
    const el = this.nodeElements[r][c];
    if (step.type === 'path') {
      el.classList.remove('node-path');
    } else if (step.type === 'visit') {
      el.classList.remove('node-visited');
    }
  }

  // ----------------------------------------------------------
  // ALGORITHM RECORDING
  // ----------------------------------------------------------
  recordAlgorithm(algoId) {
    this.clearPathOnly();
    const steps = [];
    const key = (r, c) => `${r},${c}`;
    const start = this.startNode;
    const target = this.targetNode;

    const getNeighbors = (r, c) => {
      const neighbors = [];
      const dirs = [
        [-1, 0], [1, 0], [0, -1], [0, 1] // Up, Down, Left, Right
      ];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
          if (!this.grid[nr][nc].isWall) {
            neighbors.push({ r: nr, c: nc, weight: this.grid[nr][nc].weight });
          }
        }
      }
      return neighbors;
    };

    let visitedCount = 0;
    const parentMap = new Map();

    const reconstructPath = () => {
      const pathNodes = [];
      let curr = key(target.r, target.c);
      while (parentMap.has(curr)) {
        const [pr, pc] = parentMap.get(curr).split(',').map(Number);
        if (pr === start.r && pc === start.c) break;
        pathNodes.unshift({ r: pr, c: pc });
        curr = key(pr, pc);
      }

      pathNodes.forEach((node, idx) => {
        steps.push({
          type: 'path',
          node,
          cost: idx * 2,
          lineKey: 'pathFound',
          narration: `Reconstructing optimal path: node (${node.r}, ${node.c})`,
          metrics: { comparisons: visitedCount, swaps: pathNodes.length }
        });
      });
    };

    if (algoId === 'bfs') {
      const queue = [{ r: start.r, c: start.c }];
      const visited = new Set([key(start.r, start.c)]);
      let found = false;

      while (queue.length > 0) {
        const curr = queue.shift();
        visitedCount++;

        if (curr.r === target.r && curr.c === target.c) {
          found = true;
          break;
        }

        if (!(curr.r === start.r && curr.c === start.c)) {
          steps.push({
            type: 'visit',
            node: curr,
            lineKey: 'dequeue',
            narration: `Visiting node at (${curr.r}, ${curr.c})`,
            metrics: { comparisons: visitedCount, swaps: 0 }
          });
        }

        for (const next of getNeighbors(curr.r, curr.c)) {
          const nKey = key(next.r, next.c);
          if (!visited.has(nKey)) {
            visited.add(nKey);
            parentMap.set(nKey, key(curr.r, curr.c));
            queue.push(next);
            steps.push({
              type: 'visit',
              node: next,
              lineKey: 'enqueue',
              narration: `Discovered frontier neighbor at (${next.r}, ${next.c})`,
              metrics: { comparisons: visitedCount, swaps: 0 }
            });
            if (next.r === target.r && next.c === target.c) {
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (found) reconstructPath();
    }

    else if (algoId === 'dfs') {
      const stack = [{ r: start.r, c: start.c }];
      const visited = new Set();
      let found = false;

      while (stack.length > 0) {
        const curr = stack.pop();
        const cKey = key(curr.r, curr.c);

        if (curr.r === target.r && curr.c === target.c) {
          found = true;
          break;
        }

        if (!visited.has(cKey)) {
          visited.add(cKey);
          visitedCount++;

          if (!(curr.r === start.r && curr.c === start.c)) {
            steps.push({
              type: 'visit',
              node: curr,
              lineKey: 'pop',
              narration: `Deep exploration visit to (${curr.r}, ${curr.c})`,
              metrics: { comparisons: visitedCount, swaps: 0 }
            });
          }

          for (const next of getNeighbors(curr.r, curr.c)) {
            const nKey = key(next.r, next.c);
            if (!visited.has(nKey)) {
              parentMap.set(nKey, cKey);
              stack.push(next);
            }
          }
        }
      }

      if (found) reconstructPath();
    }

    else if (algoId === 'dijkstra') {
      const dist = new Map();
      const unvisited = [];

      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          const k = key(r, c);
          dist.set(k, Infinity);
        }
      }

      dist.set(key(start.r, start.c), 0);
      unvisited.push({ r: start.r, c: start.c, d: 0 });

      let found = false;

      while (unvisited.length > 0) {
        unvisited.sort((a, b) => a.d - b.d);
        const curr = unvisited.shift();
        const cKey = key(curr.r, curr.c);

        if (curr.d > dist.get(cKey)) continue;
        visitedCount++;

        if (curr.r === target.r && curr.c === target.c) {
          found = true;
          break;
        }

        if (!(curr.r === start.r && curr.c === start.c)) {
          steps.push({
            type: 'visit',
            node: curr,
            weight: this.grid[curr.r][curr.c].weight,
            lineKey: 'extractMin',
            narration: `Relaxing node (${curr.r}, ${curr.c}) with total cost ${curr.d}`,
            metrics: { comparisons: visitedCount, swaps: 0 }
          });
        }

        for (const next of getNeighbors(curr.r, curr.c)) {
          const nKey = key(next.r, next.c);
          const alt = dist.get(cKey) + next.weight;
          if (alt < dist.get(nKey)) {
            dist.set(nKey, alt);
            parentMap.set(nKey, cKey);
            unvisited.push({ r: next.r, c: next.c, d: alt });
          }
        }
      }

      if (found) reconstructPath();
    }

    else if (algoId === 'astar') {
      const heuristic = (r, c) => Math.abs(r - target.r) + Math.abs(c - target.c);

      const gScore = new Map();
      const fScore = new Map();
      const openSet = [{ r: start.r, c: start.c, f: heuristic(start.r, start.c) }];

      gScore.set(key(start.r, start.c), 0);
      fScore.set(key(start.r, start.c), heuristic(start.r, start.c));

      let found = false;

      while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const curr = openSet.shift();
        const cKey = key(curr.r, curr.c);
        visitedCount++;

        if (curr.r === target.r && curr.c === target.c) {
          found = true;
          break;
        }

        if (!(curr.r === start.r && curr.c === start.c)) {
          steps.push({
            type: 'visit',
            node: curr,
            lineKey: 'extractMin',
            narration: `A* expanding node (${curr.r}, ${curr.c}) [f: ${curr.f.toFixed(1)}]`,
            metrics: { comparisons: visitedCount, swaps: 0 }
          });
        }

        for (const next of getNeighbors(curr.r, curr.c)) {
          const nKey = key(next.r, next.c);
          const tentativeG = gScore.get(cKey) + next.weight;

          if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
            parentMap.set(nKey, cKey);
            gScore.set(nKey, tentativeG);
            const f = tentativeG + heuristic(next.r, next.c);
            fScore.set(nKey, f);

            if (!openSet.some(n => n.r === next.r && n.c === next.c)) {
              openSet.push({ r: next.r, c: next.c, f });
            }
          }
        }
      }

      if (found) reconstructPath();
    }

    return steps;
  }
}

window.PathfindingVisualizer = PathfindingVisualizer;
