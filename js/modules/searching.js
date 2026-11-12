/**
 * Searching Visualizer: Binary Search, Linear Search, Jump Search.
 * Visual caliper indicators (low, mid, high), search interval narrowing, and target matching.
 */

class SearchingVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.array = [];
    this.size = 18;
    this.target = 42;
    this.cells = [];
    this.pointers = { low: -1, mid: -1, high: -1 };
  }

  init() {
    this.generateSortedArray();
  }

  generateSortedArray() {
    this.array = [];
    let curr = Math.floor(Math.random() * 5) + 5;
    for (let i = 0; i < this.size; i++) {
      curr += Math.floor(Math.random() * 6) + 3;
      this.array.push(curr);
    }
    // Random target picking
    if (Math.random() > 0.3) {
      this.target = this.array[Math.floor(Math.random() * this.array.length)];
    } else {
      this.target = curr + 5; // Unfound target
    }
    this.render();
  }

  setTarget(val) {
    this.target = parseInt(val);
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.cells = [];

    const wrapper = document.createElement('div');
    wrapper.className = 'search-array-container';

    this.array.forEach((val, idx) => {
      const cell = document.createElement('div');
      cell.className = 'search-cell';
      cell.dataset.index = idx;
      cell.dataset.value = val;

      const idxLabel = document.createElement('span');
      idxLabel.className = 'search-cell-index';
      idxLabel.textContent = `[${idx}]`;

      const valLabel = document.createElement('span');
      valLabel.textContent = val;

      const ptrLabel = document.createElement('span');
      ptrLabel.className = 'search-cell-pointer';

      cell.appendChild(idxLabel);
      cell.appendChild(valLabel);
      cell.appendChild(ptrLabel);

      wrapper.appendChild(cell);
      this.cells.push(cell);
    });

    this.container.appendChild(wrapper);
  }

  clearPointers() {
    this.cells.forEach(c => {
      c.classList.remove('pointer-low', 'pointer-mid', 'pointer-high', 'cell-match', 'cell-discarded');
      const ptr = c.querySelector('.search-cell-pointer');
      if (ptr) ptr.textContent = '';
    });
  }

  // ----------------------------------------------------------
  // STEP EXECUTION & UNDO
  // ----------------------------------------------------------
  applyStep(step, isFastForward = false) {
    this.clearPointers();

    if (step.discarded) {
      step.discarded.forEach(idx => {
        if (this.cells[idx]) this.cells[idx].classList.add('cell-discarded');
      });
    }

    if (step.low !== undefined && this.cells[step.low]) {
      this.cells[step.low].classList.add('pointer-low');
      this.cells[step.low].querySelector('.search-cell-pointer').textContent = 'L';
    }
    if (step.high !== undefined && this.cells[step.high]) {
      this.cells[step.high].classList.add('pointer-high');
      const ptr = this.cells[step.high].querySelector('.search-cell-pointer');
      ptr.textContent = (ptr.textContent ? ptr.textContent + '/' : '') + 'H';
    }
    if (step.mid !== undefined && this.cells[step.mid]) {
      this.cells[step.mid].classList.add('pointer-mid');
      const ptr = this.cells[step.mid].querySelector('.search-cell-pointer');
      ptr.textContent = (ptr.textContent ? ptr.textContent + '/' : '') + 'M';
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playCompare(this.array[step.mid], this.target, 5, 120);
      }
    }

    if (step.type === 'found' && this.cells[step.matchIndex]) {
      this.cells[step.matchIndex].classList.add('cell-match');
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playSuccess();
      }
    }
  }

  undoStep(step) {
    this.clearPointers();
  }

  // ----------------------------------------------------------
  // ALGORITHM RECORDING
  // ----------------------------------------------------------
  recordAlgorithm(algoId, targetVal = this.target) {
    this.target = targetVal;
    this.clearPointers();
    const steps = [];
    let comparisons = 0;

    if (algoId === 'binary-search') {
      let low = 0;
      let high = this.array.length - 1;
      let found = false;

      steps.push({
        type: 'init',
        low, high,
        lineKey: 'init',
        narration: `Initializing Binary Search: Low = 0, High = ${high}, Target = ${targetVal}`,
        metrics: { comparisons: 0, swaps: 0 }
      });

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        comparisons++;

        const discarded = [];
        for (let k = 0; k < low; k++) discarded.push(k);
        for (let k = high + 1; k < this.array.length; k++) discarded.push(k);

        steps.push({
          type: 'compare',
          low, mid, high,
          discarded,
          lineKey: 'calcMid',
          narration: `Midpoint index = ${mid} (Value: ${this.array[mid]}). Comparing with Target (${targetVal})`,
          metrics: { comparisons, swaps: 0 }
        });

        if (this.array[mid] === targetVal) {
          found = true;
          steps.push({
            type: 'found',
            low, mid, high,
            matchIndex: mid,
            discarded,
            lineKey: 'found',
            narration: `Target ${targetVal} FOUND at index ${mid}!`,
            metrics: { comparisons, swaps: 0 }
          });
          break;
        } else if (this.array[mid] < targetVal) {
          steps.push({
            type: 'shift',
            low, mid, high,
            discarded,
            lineKey: 'shiftRight',
            narration: `${this.array[mid]} < ${targetVal} → Target is in right half. Setting Low = ${mid + 1}`,
            metrics: { comparisons, swaps: 0 }
          });
          low = mid + 1;
        } else {
          steps.push({
            type: 'shift',
            low, mid, high,
            discarded,
            lineKey: 'shiftLeft',
            narration: `${this.array[mid]} > ${targetVal} → Target is in left half. Setting High = ${mid - 1}`,
            metrics: { comparisons, swaps: 0 }
          });
          high = mid - 1;
        }
      }

      if (!found) {
        const allDiscarded = this.array.map((_, i) => i);
        steps.push({
          type: 'not-found',
          discarded: allDiscarded,
          lineKey: 'shiftLeft',
          narration: `Target ${targetVal} NOT FOUND in array. (Search interval exhausted)`,
          metrics: { comparisons, swaps: 0 }
        });
      }
    }

    else if (algoId === 'linear-search') {
      let found = false;
      for (let i = 0; i < this.array.length; i++) {
        comparisons++;
        const discarded = [];
        for (let k = 0; k < i; k++) discarded.push(k);

        steps.push({
          type: 'compare',
          mid: i,
          discarded,
          lineKey: 'compare',
          narration: `Checking index ${i}: arr[${i}] = ${this.array[i]} (Target: ${targetVal})`,
          metrics: { comparisons, swaps: 0 }
        });

        if (this.array[i] === targetVal) {
          found = true;
          steps.push({
            type: 'found',
            mid: i,
            matchIndex: i,
            discarded,
            lineKey: 'found',
            narration: `Match found! arr[${i}] === ${targetVal}`,
            metrics: { comparisons, swaps: 0 }
          });
          break;
        }
      }

      if (!found) {
        steps.push({
          type: 'not-found',
          discarded: this.array.map((_, i) => i),
          lineKey: 'notFound',
          narration: `Target ${targetVal} not found after checking all ${this.array.length} elements.`,
          metrics: { comparisons, swaps: 0 }
        });
      }
    }

    return steps;
  }
}

window.SearchingVisualizer = SearchingVisualizer;
