/**
 * Sorting Module: Implements Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, and Radix Sort.
 * Renders clean bar representations with value and zero-based index numbers,
 * dynamic curved SVG movement arrows, and educational step details (what, why, next).
 */

class SortingVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.array = [];
    this.size = 28;
    this.minVal = 10;
    this.maxVal = 95;
    this.bars = [];
    this.arrowSvg = null;
    this.stats = { comparisons: 0, swaps: 0 };
    this.currentAlgo = 'bubble-sort';
    this.historyStates = [];
  }

  init() {
    this.generateArray('random');
  }

  setSize(newSize) {
    this.size = parseInt(newSize);
    this.generateArray('random');
  }

  generateArray(type = 'random', customValues = null) {
    if (customValues && Array.isArray(customValues) && customValues.length > 0) {
      this.array = [...customValues];
      this.size = this.array.length;
    } else {
      this.array = [];
      for (let i = 0; i < this.size; i++) {
        let val;
        if (type === 'random') {
          val = Math.floor(Math.random() * (this.maxVal - this.minVal + 1)) + this.minVal;
        } else if (type === 'reversed') {
          val = Math.round(this.maxVal - (i / (this.size - 1 || 1)) * (this.maxVal - this.minVal));
        } else if (type === 'nearly-sorted') {
          val = Math.round(this.minVal + (i / (this.size - 1 || 1)) * (this.maxVal - this.minVal));
          if (Math.random() < 0.25 && i > 0) {
            val += (Math.random() > 0.5 ? 8 : -8);
            val = Math.max(this.minVal, Math.min(this.maxVal, val));
          }
        } else if (type === 'few-unique') {
          const uniques = [20, 45, 70, 90];
          val = uniques[Math.floor(Math.random() * uniques.length)];
        }
        this.array.push(val);
      }
    }
    this.stats = { comparisons: 0, swaps: 0 };
    this.render();
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.bars = [];

    // Create SVG overlay for movement arrows
    this.arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.arrowSvg.setAttribute('class', 'movement-arrow-overlay');
    this.arrowSvg.innerHTML = `
      <defs>
        <marker id="arrow-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent-primary)" />
        </marker>
      </defs>
      <g id="arrow-layer"></g>
    `;
    this.container.appendChild(this.arrowSvg);

    const showLabels = this.array.length <= 40;

    this.array.forEach((val, idx) => {
      const bar = document.createElement('div');
      bar.className = 'sort-bar';
      bar.style.height = `${(val / this.maxVal) * 85}%`;
      bar.dataset.index = idx;
      bar.dataset.value = val;

      if (showLabels) {
        const label = document.createElement('span');
        label.className = 'sort-bar-value';
        label.textContent = val;
        bar.appendChild(label);
      }

      const idxLabel = document.createElement('span');
      idxLabel.className = 'sort-bar-index';
      idxLabel.textContent = idx;
      bar.appendChild(idxLabel);

      this.container.appendChild(bar);
      this.bars.push(bar);
    });
  }

  clearHighlights() {
    this.bars.forEach(bar => {
      bar.className = 'sort-bar';
    });
    this.clearMovementArrow();
  }

  highlight(indices, stateClass) {
    indices.forEach(idx => {
      if (this.bars[idx]) {
        this.bars[idx].classList.add(stateClass);
      }
    });
  }

  updateBar(idx, val) {
    if (this.bars[idx]) {
      this.bars[idx].style.height = `${(val / this.maxVal) * 85}%`;
      this.bars[idx].dataset.value = val;
      const label = this.bars[idx].querySelector('.sort-bar-value');
      if (label) label.textContent = val;
    }
  }

  // ----------------------------------------------------------
  // DYNAMIC MOVEMENT ARROWS (SVG OVERLAY)
  // ----------------------------------------------------------
  drawMovementArrow(arrow) {
    if (!this.arrowSvg) return;
    const arrowLayer = this.arrowSvg.querySelector('#arrow-layer');
    if (!arrowLayer) return;
    arrowLayer.innerHTML = '';

    if (!arrow || arrow.from === undefined || arrow.to === undefined) return;
    const barFrom = this.bars[arrow.from];
    const barTo = this.bars[arrow.to];
    if (!barFrom || !barTo) return;

    const contRect = this.container.getBoundingClientRect();
    const fromRect = barFrom.getBoundingClientRect();
    const toRect = barTo.getBoundingClientRect();

    const x1 = fromRect.left - contRect.left + fromRect.width / 2;
    const y1 = fromRect.top - contRect.top;
    const x2 = toRect.left - contRect.left + toRect.width / 2;
    const y2 = toRect.top - contRect.top;

    let pathD = '';
    const midX = (x1 + x2) / 2;
    const peakY = Math.max(18, Math.min(y1, y2) - 34);

    if (Math.abs(x1 - x2) < 4) {
      // Focus arc pointing to single element (e.g. pickKey)
      pathD = `M ${x1 - 14} ${peakY + 12} Q ${x1} ${peakY - 10} ${x1 + 14} ${peakY + 12}`;
    } else {
      pathD = `M ${x1} ${y1 - 6} Q ${midX} ${peakY} ${x2} ${y2 - 6}`;
    }

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('class', 'arrow-arc');
    path.setAttribute('marker-end', 'url(#arrow-head)');
    arrowLayer.appendChild(path);

    if (arrow.text) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', midX);
      text.setAttribute('y', Math.max(14, peakY - 6));
      text.setAttribute('class', 'arrow-label');
      text.textContent = arrow.text;
      arrowLayer.appendChild(text);
    }
  }

  clearMovementArrow() {
    if (this.arrowSvg) {
      const arrowLayer = this.arrowSvg.querySelector('#arrow-layer');
      if (arrowLayer) arrowLayer.innerHTML = '';
    }
  }

  // ----------------------------------------------------------
  // STEP EXECUTION & UNDO
  // ----------------------------------------------------------
  applyStep(step, isFastForward = false) {
    // Clear transient classes
    this.bars.forEach(b => {
      b.classList.remove('state-comparing', 'state-swapping', 'state-pivot', 'state-key');
    });

    this.clearMovementArrow();
    if (step.arrow && !isFastForward) {
      this.drawMovementArrow(step.arrow);
    }

    if (step.type === 'compare') {
      const [i, j] = step.indices;
      if (this.bars[i]) this.bars[i].classList.add('state-comparing');
      if (this.bars[j]) this.bars[j].classList.add('state-comparing');
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playCompare(step.values[0], step.values[1], this.minVal, this.maxVal);
      }
    } else if (step.type === 'swap') {
      const [i, j] = step.indices;
      this.updateBar(i, step.values[0]);
      this.updateBar(j, step.values[1]);
      if (this.bars[i]) this.bars[i].classList.add('state-swapping');
      if (this.bars[j]) this.bars[j].classList.add('state-swapping');
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playSwap(step.values[0], step.values[1], this.minVal, this.maxVal);
      }
    } else if (step.type === 'overwrite') {
      const [i] = step.indices;
      this.updateBar(i, step.values[0]);
      if (this.bars[i]) this.bars[i].classList.add('state-swapping');
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playValueTone(step.values[0], this.minVal, this.maxVal);
      }
    } else if (step.type === 'pivot') {
      const [i] = step.indices;
      if (this.bars[i]) {
        this.bars[i].classList.add('state-key');
        this.bars[i].classList.add('state-pivot');
      }
    } else if (step.type === 'sorted') {
      step.indices.forEach(idx => {
        if (this.bars[idx]) this.bars[idx].classList.add('state-sorted');
      });
    }
  }

  undoStep(step) {
    this.clearMovementArrow();
    if (step.previousState) {
      step.previousState.forEach(({ index, value, classes }) => {
        this.updateBar(index, value);
        if (this.bars[index]) {
          this.bars[index].className = classes;
        }
      });
    }
  }

  // ----------------------------------------------------------
  // ALGORITHM RECORDING
  // ----------------------------------------------------------
  recordAlgorithm(algoId) {
    this.currentAlgo = algoId;
    const arr = [...this.array];
    const steps = [];
    let comparisons = 0;
    let swaps = 0;

    const captureState = (indices) => {
      return indices.map(idx => ({
        index: idx,
        value: arr[idx],
        classes: this.bars[idx] ? this.bars[idx].className : 'sort-bar'
      }));
    };

    // 1. BUBBLE SORT
    if (algoId === 'bubble-sort') {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          comparisons++;
          const prevState = captureState([j, j + 1]);
          const willSwap = arr[j] > arr[j + 1];

          steps.push({
            type: 'compare',
            indices: [j, j + 1],
            values: [arr[j], arr[j + 1]],
            lineKey: 'compare',
            narration: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]})`,
            details: {
              what: `Compare ${arr[j]} and ${arr[j + 1]} at indices [${j}] and [${j + 1}]`,
              why: `Bubble Sort checks adjacent pairs to push larger elements toward the right.`,
              next: willSwap ? `${arr[j]} > ${arr[j + 1]}, so we swap them.` : `In correct order (${arr[j]} <= ${arr[j + 1]}), no swap needed.`
            },
            arrow: { from: j, to: j + 1, text: `Compare ${arr[j]} & ${arr[j + 1]}` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });

          if (willSwap) {
            swaps++;
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            const swapPrev = captureState([j, j + 1]);
            steps.push({
              type: 'swap',
              indices: [j, j + 1],
              values: [arr[j], arr[j + 1]],
              lineKey: 'swap',
              narration: `Swapped arr[${j}] and arr[${j + 1}]`,
              details: {
                what: `Swapped positions of ${arr[j + 1]} and ${arr[j]}`,
                why: `The earlier element was larger, violating the ascending sort order.`,
                next: `Advance to the next adjacent pair.`
              },
              arrow: { from: j, to: j + 1, text: `Swap ${arr[j + 1]} ⇄ ${arr[j]}` },
              metrics: { comparisons, swaps },
              previousState: swapPrev,
              currentArray: [...arr]
            });
          }
        }

        const sortedIdx = n - i - 1;
        steps.push({
          type: 'sorted',
          indices: [sortedIdx],
          values: [arr[sortedIdx]],
          lineKey: 'passDone',
          narration: `Element at index ${sortedIdx} (${arr[sortedIdx]}) locked in sorted position`,
          details: {
            what: `Locked element ${arr[sortedIdx]} at index [${sortedIdx}]`,
            why: `Pass ${i + 1} is complete; the largest remaining element has bubbled to the end.`,
            next: `Start next pass over remaining unsorted elements.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });
      }

      steps.push({
        type: 'sorted',
        indices: [0],
        values: [arr[0]],
        lineKey: 'complete',
        narration: 'Array is fully sorted!',
        details: {
          what: `Array fully sorted`,
          why: `All passes completed. All elements are in non-decreasing order.`,
          next: `Algorithm complete.`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });
    }

    // 2. SELECTION SORT
    else if (algoId === 'selection-sort') {
      const n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        steps.push({
          type: 'pivot',
          indices: [i],
          values: [arr[i]],
          lineKey: 'findMin',
          narration: `Assuming minimum is at index ${i} (${arr[i]})`,
          details: {
            what: `Set initial minimum to arr[${i}] = ${arr[i]}`,
            why: `Selection sort assumes the first unsorted element is the minimum, then scans the rest.`,
            next: `Scan indices ${i + 1} through ${n - 1} to find any smaller element.`
          },
          arrow: { from: i, to: i, text: `Current min candidate: ${arr[i]}` },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });

        for (let j = i + 1; j < n; j++) {
          comparisons++;
          const prevState = captureState([j, minIdx]);
          steps.push({
            type: 'compare',
            indices: [j, minIdx],
            values: [arr[j], arr[minIdx]],
            lineKey: 'compare',
            narration: `Comparing arr[${j}] (${arr[j]}) with current min arr[${minIdx}] (${arr[minIdx]})`,
            details: {
              what: `Compare ${arr[j]} at [${j}] with current minimum ${arr[minIdx]} at [${minIdx}]`,
              why: `Determining if there is a smaller element in the unsorted subarray.`,
              next: arr[j] < arr[minIdx] ? `Found new smaller element ${arr[j]}! Update minimum index.` : `Not smaller. Continue scanning.`
            },
            arrow: { from: j, to: minIdx, text: `Compare with min (${arr[minIdx]})` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });

          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            steps.push({
              type: 'pivot',
              indices: [minIdx],
              values: [arr[minIdx]],
              lineKey: 'updateMin',
              narration: `New minimum found: ${arr[minIdx]} at index ${minIdx}`,
              details: {
                what: `Updated minimum candidate to ${arr[minIdx]} at [${minIdx}]`,
                why: `Found a smaller value than previously recorded.`,
                next: `Continue checking remaining elements.`
              },
              arrow: { from: minIdx, to: minIdx, text: `New min: ${arr[minIdx]}` },
              metrics: { comparisons, swaps },
              currentArray: [...arr]
            });
          }
        }

        if (minIdx !== i) {
          swaps++;
          const prevState = captureState([i, minIdx]);
          [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
          steps.push({
            type: 'swap',
            indices: [i, minIdx],
            values: [arr[i], arr[minIdx]],
            lineKey: 'swap',
            narration: `Swapping arr[${i}] (${arr[minIdx]}) with min element (${arr[i]})`,
            details: {
              what: `Swap arr[${i}] and arr[${minIdx}] to place ${arr[i]} into sorted position [${i}]`,
              why: `The minimum unsorted value belongs at the start of the unsorted section.`,
              next: `Lock index [${i}] as sorted.`
            },
            arrow: { from: minIdx, to: i, text: `Place min ${arr[i]} at [${i}]` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });
        }

        steps.push({
          type: 'sorted',
          indices: [i],
          values: [arr[i]],
          lineKey: 'swap',
          narration: `Index ${i} (${arr[i]}) is now sorted`,
          details: {
            what: `Index [${i}] (${arr[i]}) is sorted`,
            why: `It holds the smallest element among all elements from index ${i} onward.`,
            next: `Move to next index.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });
      }

      steps.push({
        type: 'sorted',
        indices: [arr.length - 1],
        values: [arr[arr.length - 1]],
        lineKey: 'complete',
        narration: 'Array is fully sorted!',
        details: {
          what: `All elements sorted`,
          why: `Only one element remained, which is automatically in place.`,
          next: `Done.`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });
    }

    // 3. INSERTION SORT (Highlighted in User Request)
    else if (algoId === 'insertion-sort') {
      const n = arr.length;
      steps.push({
        type: 'sorted',
        indices: [0],
        values: [arr[0]],
        lineKey: 'start',
        narration: `First element (${arr[0]}) is trivially sorted`,
        details: {
          what: `Index [0] (${arr[0]}) is trivially sorted by itself`,
          why: `A single-element subarray is always sorted.`,
          next: `Begin inserting subsequent elements (from index 1).`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });

      for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        steps.push({
          type: 'pivot',
          indices: [i],
          values: [key],
          lineKey: 'pickKey',
          narration: `Selecting key ${key} at index ${i} to insert into sorted left portion`,
          details: {
            what: `We picked ${key} as the key at index [${i}]`,
            why: `We compare ${key} with elements before it to find its correct position.`,
            next: `Compare key (${key}) with sorted element arr[${j}] (${arr[j]}).`
          },
          arrow: { from: i, to: i, text: `Key: ${key}` },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });

        while (j >= 0) {
          comparisons++;
          const willShift = arr[j] > key;
          steps.push({
            type: 'compare',
            indices: [j, j + 1],
            values: [arr[j], key],
            lineKey: 'compare',
            narration: `Comparing key (${key}) with element at index ${j} (${arr[j]})`,
            details: {
              what: `Compare key (${key}) with arr[${j}] (${arr[j]})`,
              why: `Checking if ${arr[j]} is larger than key ${key}.`,
              next: willShift ? `${arr[j]} > ${key}, so we shift ${arr[j]} one position right.` : `${arr[j]} <= ${key}, correct insertion position found!`
            },
            arrow: { from: j, to: j + 1, text: `Compare key (${key}) with ${arr[j]}` },
            metrics: { comparisons, swaps },
            currentArray: [...arr]
          });

          if (willShift) {
            swaps++;
            const prevState = captureState([j + 1]);
            arr[j + 1] = arr[j];
            steps.push({
              type: 'overwrite',
              indices: [j + 1],
              values: [arr[j]],
              lineKey: 'shift',
              narration: `Shifting ${arr[j]} from index ${j} to ${j + 1}`,
              details: {
                what: `${arr[j]} moved right to make space for ${key}`,
                why: `Larger elements must shift right so key can be placed before them.`,
                next: `Check previous element in sorted left portion.`
              },
              arrow: { from: j, to: j + 1, text: `Shifting ${arr[j]} to the right...` },
              metrics: { comparisons, swaps },
              previousState: prevState,
              currentArray: [...arr]
            });
            j--;
          } else {
            break;
          }
        }

        const prevState = captureState([j + 1]);
        arr[j + 1] = key;
        steps.push({
          type: 'overwrite',
          indices: [j + 1],
          values: [key],
          lineKey: 'insert',
          narration: `Inserted key ${key} into index ${j + 1}`,
          details: {
            what: `Inserted key ${key} at index [${j + 1}]`,
            why: `All elements to the left are smaller, and all shifted elements are greater.`,
            next: `Left partition (indices 0..${i}) is now fully sorted.`
          },
          arrow: { from: i, to: j + 1, text: `Inserted ${key} at [${j + 1}]` },
          metrics: { comparisons, swaps },
          previousState: prevState,
          currentArray: [...arr]
        });

        const sortedRange = [];
        for (let k = 0; k <= i; k++) sortedRange.push(k);
        steps.push({
          type: 'sorted',
          indices: sortedRange,
          values: sortedRange.map(k => arr[k]),
          lineKey: 'insert',
          narration: `Sorted portion now covers indices 0 to ${i}`,
          details: {
            what: `Subarray [0..${i}] is sorted`,
            why: `Key ${key} has been properly integrated.`,
            next: i + 1 < n ? `Pick next key at index [${i + 1}].` : `All elements processed.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });
      }

      steps.push({
        type: 'sorted',
        indices: arr.map((_, idx) => idx),
        values: [...arr],
        lineKey: 'complete',
        narration: 'Insertion Sort completed!',
        details: {
          what: `Insertion Sort completed`,
          why: `Entire array is sorted in-place.`,
          next: `Algorithm complete.`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });
    }

    // 4. MERGE SORT
    else if (algoId === 'merge-sort') {
      const merge = (start, mid, end) => {
        const left = arr.slice(start, mid + 1);
        const right = arr.slice(mid + 1, end + 1);
        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
          comparisons++;
          const isLeftSmaller = left[i] <= right[j];
          steps.push({
            type: 'compare',
            indices: [start + i, mid + 1 + j],
            values: [left[i], right[j]],
            lineKey: 'compare',
            narration: `Comparing left sub-element (${left[i]}) with right sub-element (${right[j]})`,
            details: {
              what: `Compare ${left[i]} (left) and ${right[j]} (right)`,
              why: `Merge step picks the smaller element to maintain sorted order.`,
              next: isLeftSmaller ? `Write ${left[i]} into main array at index [${k}].` : `Write ${right[j]} into main array at index [${k}].`
            },
            arrow: { from: start + i, to: mid + 1 + j, text: `Compare ${left[i]} & ${right[j]}` },
            metrics: { comparisons, swaps },
            currentArray: [...arr]
          });

          swaps++;
          const prevState = captureState([k]);
          if (isLeftSmaller) {
            arr[k] = left[i];
            i++;
          } else {
            arr[k] = right[j];
            j++;
          }
          steps.push({
            type: 'overwrite',
            indices: [k],
            values: [arr[k]],
            lineKey: 'merge',
            narration: `Merged value ${arr[k]} into position ${k}`,
            details: {
              what: `Placed smaller value ${arr[k]} into index [${k}]`,
              why: `Building the sorted merged subarray.`,
              next: `Advance target index k.`
            },
            arrow: { from: k, to: k, text: `Write ${arr[k]}` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });
          k++;
        }

        while (i < left.length) {
          swaps++;
          const prevState = captureState([k]);
          arr[k] = left[i];
          steps.push({
            type: 'overwrite',
            indices: [k],
            values: [arr[k]],
            lineKey: 'merge',
            narration: `Flushing remaining left element (${left[i]}) to position ${k}`,
            details: {
              what: `Flush remaining left element ${left[i]} to index [${k}]`,
              why: `Right subarray exhausted; remaining left elements are already sorted.`,
              next: `Continue flushing.`
            },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });
          i++; k++;
        }

        while (j < right.length) {
          swaps++;
          const prevState = captureState([k]);
          arr[k] = right[j];
          steps.push({
            type: 'overwrite',
            indices: [k],
            values: [arr[k]],
            lineKey: 'merge',
            narration: `Flushing remaining right element (${right[j]}) to position ${k}`,
            details: {
              what: `Flush remaining right element ${right[j]} to index [${k}]`,
              why: `Left subarray exhausted; remaining right elements are already sorted.`,
              next: `Continue flushing.`
            },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });
          j++; k++;
        }

        const mergedIndices = [];
        for (let idx = start; idx <= end; idx++) mergedIndices.push(idx);
        steps.push({
          type: 'sorted',
          indices: mergedIndices,
          values: mergedIndices.map(idx => arr[idx]),
          lineKey: 'mergeDone',
          narration: `Merged segment [${start}..${end}] is now sorted`,
          details: {
            what: `Segment [${start}..${end}] successfully merged`,
            why: `Both halves combined in sorted order.`,
            next: `Return up recursion tree.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });
      };

      const mergeSortHelper = (start, end) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        steps.push({
          type: 'pivot',
          indices: [mid],
          values: [arr[mid]],
          lineKey: 'divide',
          narration: `Dividing array segment [${start}..${end}] at mid index ${mid}`,
          details: {
            what: `Divide segment [${start}..${end}] at mid = ${mid}`,
            why: `Divide and conquer splits the problem into two equal halves.`,
            next: `Recursively sort left half [${start}..${mid}].`
          },
          arrow: { from: start, to: end, text: `Divide at ${mid}` },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });

        mergeSortHelper(start, mid);
        mergeSortHelper(mid + 1, end);
        merge(start, mid, end);
      };

      mergeSortHelper(0, arr.length - 1);
    }

    // 5. QUICK SORT
    else if (algoId === 'quick-sort') {
      const partition = (low, high) => {
        const pivot = arr[high];
        steps.push({
          type: 'pivot',
          indices: [high],
          values: [pivot],
          lineKey: 'pickPivot',
          narration: `Chose pivot ${pivot} at index ${high}`,
          details: {
            what: `Chose pivot = ${pivot} at index [${high}]`,
            why: `Quick Sort partitions array around the pivot so smaller elements go left and larger go right.`,
            next: `Scan from index ${low} to ${high - 1}.`
          },
          arrow: { from: high, to: high, text: `Pivot: ${pivot}` },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });

        let i = low - 1;
        for (let j = low; j < high; j++) {
          comparisons++;
          const prevState = captureState([j, high]);
          const isSmaller = arr[j] < pivot;
          steps.push({
            type: 'compare',
            indices: [j, high],
            values: [arr[j], pivot],
            lineKey: 'compare',
            narration: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot})`,
            details: {
              what: `Compare ${arr[j]} at [${j}] with pivot ${pivot}`,
              why: `Elements smaller than pivot must move to the left partition.`,
              next: isSmaller ? `${arr[j]} < ${pivot}, swap into left partition.` : `Keep in right partition.`
            },
            arrow: { from: j, to: high, text: `Compare with pivot` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });

          if (isSmaller) {
            i++;
            swaps++;
            const swapPrev = captureState([i, j]);
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({
              type: 'swap',
              indices: [i, j],
              values: [arr[i], arr[j]],
              lineKey: 'swap',
              narration: `Swapped arr[${i}] and arr[${j}] into smaller partition`,
              details: {
                what: `Swapped ${arr[i]} and ${arr[j]}`,
                why: `Expanding the partition of elements smaller than pivot.`,
                next: `Continue scan.`
              },
              arrow: { from: j, to: i, text: `Swap to left partition` },
              metrics: { comparisons, swaps },
              previousState: swapPrev,
              currentArray: [...arr]
            });
          }
        }

        swaps++;
        const finalPrev = captureState([i + 1, high]);
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        steps.push({
          type: 'swap',
          indices: [i + 1, high],
          values: [arr[i + 1], arr[high]],
          lineKey: 'placePivot',
          narration: `Placed pivot ${pivot} into final position ${i + 1}`,
          details: {
            what: `Placed pivot ${pivot} at index [${i + 1}]`,
            why: `All items to the left are < pivot, all to the right are >= pivot.`,
            next: `Lock index [${i + 1}] as sorted.`
          },
          arrow: { from: high, to: i + 1, text: `Pivot to [${i + 1}]` },
          metrics: { comparisons, swaps },
          previousState: finalPrev,
          currentArray: [...arr]
        });

        steps.push({
          type: 'sorted',
          indices: [i + 1],
          values: [arr[i + 1]],
          lineKey: 'placePivot',
          narration: `Pivot at index ${i + 1} locked in sorted position`,
          details: {
            what: `Pivot ${arr[i + 1]} locked`,
            why: `Pivot is now in its exact, permanent sorted location.`,
            next: `Recursively sort left and right subarrays.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });

        return i + 1;
      };

      const quickSortHelper = (low, high) => {
        if (low < high) {
          const pi = partition(low, high);
          quickSortHelper(low, pi - 1);
          quickSortHelper(pi + 1, high);
        } else if (low >= 0 && low < arr.length) {
          steps.push({
            type: 'sorted',
            indices: [low],
            values: [arr[low]],
            lineKey: 'placePivot',
            narration: `Base case: index ${low} is sorted`,
            metrics: { comparisons, swaps },
            currentArray: [...arr]
          });
        }
      };

      quickSortHelper(0, arr.length - 1);
    }

    // 6. HEAP SORT
    else if (algoId === 'heap-sort') {
      const n = arr.length;

      const heapify = (size, rootIdx) => {
        let largest = rootIdx;
        const left = 2 * rootIdx + 1;
        const right = 2 * rootIdx + 2;

        if (left < size) {
          comparisons++;
          steps.push({
            type: 'compare',
            indices: [left, largest],
            values: [arr[left], arr[largest]],
            lineKey: 'compare',
            narration: `Comparing left child at ${left} (${arr[left]}) with root (${arr[largest]})`,
            details: {
              what: `Compare left child ${arr[left]} with root ${arr[largest]}`,
              why: `In a Max Heap, the root of every subtree must be larger than its children.`,
              next: arr[left] > arr[largest] ? `Left child is larger; update largest candidate.` : `Root remains largest.`
            },
            arrow: { from: left, to: largest, text: `Compare child & root` },
            metrics: { comparisons, swaps },
            currentArray: [...arr]
          });
          if (arr[left] > arr[largest]) largest = left;
        }

        if (right < size) {
          comparisons++;
          steps.push({
            type: 'compare',
            indices: [right, largest],
            values: [arr[right], arr[largest]],
            lineKey: 'compare',
            narration: `Comparing right child at ${right} (${arr[right]}) with current largest (${arr[largest]})`,
            details: {
              what: `Compare right child ${arr[right]} with largest ${arr[largest]}`,
              why: `Ensuring the maximum of root, left, and right is identified.`,
              next: arr[right] > arr[largest] ? `Right child is largest.` : `Current largest holds.`
            },
            arrow: { from: right, to: largest, text: `Compare child & largest` },
            metrics: { comparisons, swaps },
            currentArray: [...arr]
          });
          if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== rootIdx) {
          swaps++;
          const prevState = captureState([rootIdx, largest]);
          [arr[rootIdx], arr[largest]] = [arr[largest], arr[rootIdx]];
          steps.push({
            type: 'swap',
            indices: [rootIdx, largest],
            values: [arr[rootIdx], arr[largest]],
            lineKey: 'swap',
            narration: `Swapping root ${rootIdx} with largest child ${largest}`,
            details: {
              what: `Swapped ${arr[largest]} and ${arr[rootIdx]} to satisfy Max Heap property`,
              why: `Larger value promoted to parent.`,
              next: `Recursively heapify affected subtree.`
            },
            arrow: { from: largest, to: rootIdx, text: `Promote ${arr[rootIdx]}` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });
          heapify(size, largest);
        }
      };

      // Build heap
      steps.push({
        type: 'pivot',
        indices: [0],
        values: [arr[0]],
        lineKey: 'buildHeap',
        narration: 'Building Max Heap structure from bottom up',
        details: {
          what: `Building initial Max Heap`,
          why: `Organizes the array so the maximum element is at index [0].`,
          next: `Heapify non-leaf nodes starting from ${Math.floor(n / 2) - 1}.`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });

      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(n, i);
      }

      // Extract elements
      for (let i = n - 1; i > 0; i--) {
        swaps++;
        const prevState = captureState([0, i]);
        [arr[0], arr[i]] = [arr[i], arr[0]];
        steps.push({
          type: 'swap',
          indices: [0, i],
          values: [arr[0], arr[i]],
          lineKey: 'extractMax',
          narration: `Extracting max element from root to sorted position ${i}`,
          details: {
            what: `Extracted maximum element ${arr[i]} to index [${i}]`,
            why: `Max element from root [0] swapped to the end of the unsorted section.`,
            next: `Lock index [${i}] as sorted and restore heap on remaining elements.`
          },
          arrow: { from: 0, to: i, text: `Max to [${i}]` },
          metrics: { comparisons, swaps },
          previousState: prevState,
          currentArray: [...arr]
        });
        steps.push({
          type: 'sorted',
          indices: [i],
          values: [arr[i]],
          lineKey: 'extractMax',
          narration: `Element at index ${i} is now sorted`,
          details: {
            what: `Element ${arr[i]} at index [${i}] locked`,
            why: `It is the maximum of the remaining elements.`,
            next: `Heapify root with reduced size ${i}.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });
        heapify(i, 0);
      }

      steps.push({
        type: 'sorted',
        indices: [0],
        values: [arr[0]],
        lineKey: 'extractMax',
        narration: 'Heap Sort completed!',
        details: {
          what: `Heap Sort completed`,
          why: `All elements extracted into sorted order.`,
          next: `Done.`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });
    }

    // 7. COUNTING SORT
    else if (algoId === 'counting-sort') {
      const maxVal = Math.max(...arr);
      const minVal = Math.min(...arr);
      const range = maxVal - minVal + 1;
      const count = new Array(range).fill(0);

      steps.push({
        type: 'pivot',
        indices: [0],
        values: [arr[0]],
        lineKey: 'initCount',
        narration: `Counting Sort: range is ${minVal} to ${maxVal}`,
        details: {
          what: `Initialize frequency counts for range [${minVal}..${maxVal}]`,
          why: `Counting sort works by tabulating the frequency of each unique value.`,
          next: `Count occurrences of each number in the array.`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });

      for (let i = 0; i < arr.length; i++) {
        count[arr[i] - minVal]++;
        steps.push({
          type: 'compare',
          indices: [i],
          values: [arr[i]],
          lineKey: 'count',
          narration: `Counting occurrence of ${arr[i]} at index ${i}`,
          details: {
            what: `Count element ${arr[i]} (count = ${count[arr[i] - minVal]})`,
            why: `Records how many times value ${arr[i]} appears.`,
            next: `Move to next element.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });
      }

      let writeIdx = 0;
      for (let v = 0; v < range; v++) {
        while (count[v] > 0) {
          const num = v + minVal;
          const prevState = captureState([writeIdx]);
          arr[writeIdx] = num;
          swaps++;
          steps.push({
            type: 'overwrite',
            indices: [writeIdx],
            values: [num],
            lineKey: 'write',
            narration: `Writing sorted value ${num} into index ${writeIdx}`,
            details: {
              what: `Wrote ${num} into index [${writeIdx}] from count array`,
              why: `Placing elements back in sorted order based on their counts.`,
              next: `Increment target index.`
            },
            arrow: { from: writeIdx, to: writeIdx, text: `Write ${num}` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });
          steps.push({
            type: 'sorted',
            indices: [writeIdx],
            values: [num],
            lineKey: 'write',
            narration: `Index ${writeIdx} (${num}) locked as sorted`,
            details: {
              what: `Index [${writeIdx}] (${num}) is sorted`,
              why: `Populated in ascending order.`,
              next: `Continue writing remaining values.`
            },
            metrics: { comparisons, swaps },
            currentArray: [...arr]
          });
          count[v]--;
          writeIdx++;
        }
      }
    }

    // 8. RADIX SORT
    else if (algoId === 'radix-sort') {
      const maxVal = Math.max(...arr);
      for (let exp = 1; Math.floor(maxVal / exp) > 0; exp *= 10) {
        steps.push({
          type: 'pivot',
          indices: [0],
          values: [arr[0]],
          lineKey: 'digitPass',
          narration: `Radix Sort: Sorting by digit place ${exp}`,
          details: {
            what: `Sorting elements by digit position ${exp} (units, tens, etc.)`,
            why: `Radix sort sorts from least significant digit to most significant digit stably.`,
            next: `Distribute numbers into buckets 0-9 based on digit.`
          },
          metrics: { comparisons, swaps },
          currentArray: [...arr]
        });

        // Simple bucket sort by current digit
        const output = new Array(arr.length).fill(0);
        const count = new Array(10).fill(0);

        for (let i = 0; i < arr.length; i++) {
          const digit = Math.floor(arr[i] / exp) % 10;
          count[digit]++;
          steps.push({
            type: 'compare',
            indices: [i],
            values: [arr[i]],
            lineKey: 'countDigit',
            narration: `Examining element ${arr[i]}: digit at place ${exp} is ${digit}`,
            details: {
              what: `Digit for ${arr[i]} at place ${exp} is ${digit}`,
              why: `Counting bucket frequencies for each digit 0..9.`,
              next: `Continue counting digits.`
            },
            metrics: { comparisons, swaps },
            currentArray: [...arr]
          });
        }

        for (let i = 1; i < 10; i++) count[i] += count[i - 1];

        for (let i = arr.length - 1; i >= 0; i--) {
          const digit = Math.floor(arr[i] / exp) % 10;
          output[count[digit] - 1] = arr[i];
          count[digit]--;
        }

        for (let i = 0; i < arr.length; i++) {
          swaps++;
          const prevState = captureState([i]);
          arr[i] = output[i];
          steps.push({
            type: 'overwrite',
            indices: [i],
            values: [arr[i]],
            lineKey: 'rewrite',
            narration: `Placing ${arr[i]} at index ${i} after digit pass`,
            details: {
              what: `Copied ${arr[i]} to index [${i}] after digit pass`,
              why: `Maintaining stable order for the current digit place ${exp}.`,
              next: `Update next index.`
            },
            arrow: { from: i, to: i, text: `Digit ${exp}: ${arr[i]}` },
            metrics: { comparisons, swaps },
            previousState: prevState,
            currentArray: [...arr]
          });
        }
      }

      steps.push({
        type: 'sorted',
        indices: arr.map((_, i) => i),
        values: [...arr],
        lineKey: 'complete',
        narration: 'Radix Sort completed!',
        details: {
          what: `Radix Sort complete`,
          why: `All digit places processed. Array is fully sorted.`,
          next: `Done.`
        },
        metrics: { comparisons, swaps },
        currentArray: [...arr]
      });
    }

    return steps;
  }
}

window.SortingVisualizer = SortingVisualizer;
