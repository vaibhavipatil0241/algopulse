/**
 * Dynamic Programming (DP) Visualizer:
 * 0/1 Knapsack Problem and Longest Common Subsequence (LCS).
 * Interactive 2D state matrix table with recurrence relation explanation.
 */

class DPVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentProblem = 'knapsack-dp';
    this.tableEl = null;
    this.formulaEl = null;
    this.cellElements = []; // [i][w]

    // Sample Knapsack items: [weight, value]
    this.items = [
      { name: 'Item 1', wt: 1, val: 3 },
      { name: 'Item 2', wt: 2, val: 5 },
      { name: 'Item 3', wt: 3, val: 8 },
      { name: 'Item 4', wt: 4, val: 10 }
    ];
    this.capacity = 6;
  }

  init() {
    this.renderKnapsackTable();
  }

  renderKnapsackTable() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.cellElements = [];

    const wrapper = document.createElement('div');
    wrapper.className = 'dp-table-wrapper';

    const table = document.createElement('table');
    table.className = 'dp-table';

    // Header row (Capacities 0..W)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const thCorner = document.createElement('th');
    thCorner.textContent = 'Items \\ Cap';
    headerRow.appendChild(thCorner);

    for (let w = 0; w <= this.capacity; w++) {
      const th = document.createElement('th');
      th.textContent = `W=${w}`;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body rows
    const tbody = document.createElement('tbody');
    for (let i = 0; i <= this.items.length; i++) {
      const tr = document.createElement('tr');
      const thItem = document.createElement('th');
      thItem.textContent = i === 0 ? '0 (None)' : `${this.items[i - 1].name} (w:${this.items[i - 1].wt}, v:${this.items[i - 1].val})`;
      tr.appendChild(thItem);

      const rowEls = [];
      for (let w = 0; w <= this.capacity; w++) {
        const td = document.createElement('td');
        td.dataset.i = i;
        td.dataset.w = w;
        td.textContent = '0';
        tr.appendChild(td);
        rowEls.push(td);
      }
      this.cellElements.push(rowEls);
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    wrapper.appendChild(table);

    const formula = document.createElement('div');
    formula.className = 'dp-formula-banner';
    formula.textContent = 'dp[i][w] = max( val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w] )';
    this.formulaEl = formula;

    this.container.appendChild(wrapper);
    this.container.appendChild(formula);
  }

  clearHighlights() {
    for (let i = 0; i < this.cellElements.length; i++) {
      for (let w = 0; w < this.cellElements[i].length; w++) {
        this.cellElements[i][w].classList.remove('dp-active', 'dp-source');
      }
    }
  }

  // ----------------------------------------------------------
  // STEP EXECUTION & UNDO
  // ----------------------------------------------------------
  applyStep(step, isFastForward = false) {
    this.clearHighlights();

    if (step.sources) {
      step.sources.forEach(([r, c]) => {
        if (this.cellElements[r] && this.cellElements[r][c]) {
          this.cellElements[r][c].classList.add('dp-source');
        }
      });
    }

    if (step.active) {
      const [r, c] = step.active;
      if (this.cellElements[r] && this.cellElements[r][c]) {
        this.cellElements[r][c].classList.add('dp-active');
        this.cellElements[r][c].textContent = step.val;
      }
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playValueTone(step.val * 5 + 10, 0, 100);
      }
    }

    if (this.formulaEl && step.formulaText) {
      this.formulaEl.textContent = step.formulaText;
    }
  }

  undoStep(step) {
    this.clearHighlights();
    if (step.active) {
      const [r, c] = step.active;
      if (this.cellElements[r] && this.cellElements[r][c]) {
        this.cellElements[r][c].textContent = step.prevVal ?? '0';
      }
    }
  }

  // ----------------------------------------------------------
  // ALGORITHM RECORDING
  // ----------------------------------------------------------
  recordAlgorithm(algoId) {
    this.renderKnapsackTable();
    const steps = [];
    const n = this.items.length;
    const W = this.capacity;

    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    // Base row initialization
    steps.push({
      type: 'init',
      active: [0, 0],
      val: 0,
      lineKey: 'init',
      formulaText: 'Base Case: with 0 items, max value for all capacities is 0.',
      narration: 'Initializing base row (i=0) and base column (w=0) to 0',
      metrics: { comparisons: 0, swaps: 0 }
    });

    let ops = 0;

    for (let i = 1; i <= n; i++) {
      const currItem = this.items[i - 1];
      for (let w = 1; w <= W; w++) {
        ops++;
        const prevVal = dp[i][w];

        if (currItem.wt <= w) {
          const includeVal = currItem.val + dp[i - 1][w - currItem.wt];
          const excludeVal = dp[i - 1][w];
          dp[i][w] = Math.max(includeVal, excludeVal);

          const choiceText = includeVal > excludeVal
            ? `Include ${currItem.name} (Value: ${includeVal} > ${excludeVal})`
            : `Exclude ${currItem.name} (Value: ${excludeVal} >= ${includeVal})`;

          steps.push({
            type: 'calc',
            active: [i, w],
            val: dp[i][w],
            prevVal,
            sources: [[i - 1, w], [i - 1, w - currItem.wt]],
            lineKey: includeVal > excludeVal ? 'include' : 'exclude',
            formulaText: `dp[${i}][${w}] = max(${currItem.val} + dp[${i-1}][${w - currItem.wt}], dp[${i-1}][${w}]) = ${dp[i][w]}`,
            narration: `${currItem.name} fits (wt:${currItem.wt} <= ${w}). ${choiceText}`,
            metrics: { comparisons: ops, swaps: 0 }
          });
        } else {
          dp[i][w] = dp[i - 1][w];
          steps.push({
            type: 'calc',
            active: [i, w],
            val: dp[i][w],
            prevVal,
            sources: [[i - 1, w]],
            lineKey: 'exclude',
            formulaText: `dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]} (wt ${currItem.wt} > cap ${w})`,
            narration: `${currItem.name} (wt: ${currItem.wt}) exceeds capacity ${w}. Must exclude.`,
            metrics: { comparisons: ops, swaps: 0 }
          });
        }
      }
    }

    steps.push({
      type: 'result',
      active: [n, W],
      val: dp[n][W],
      lineKey: 'result',
      formulaText: `Maximum achievable value: ${dp[n][W]}`,
      narration: `Knapsack DP completed! Maximum value with capacity ${W} is ${dp[n][W]}.`,
      metrics: { comparisons: ops, swaps: 0 }
    });

    return steps;
  }
}

window.DPVisualizer = DPVisualizer;
