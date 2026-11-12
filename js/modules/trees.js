/**
 * Binary Search Tree (BST) & Tree Traversals Visualizer
 * High-definition vector SVG rendering with animated node traversal queues.
 */

class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

class TreeVisualizer {
  constructor(containerId, queueContainerId) {
    this.container = document.getElementById(containerId);
    this.queueContainer = document.getElementById(queueContainerId);
    this.root = null;
    this.nodeMap = new Map(); // val -> { circle, text, lineToParent }
    this.traversalQueue = [];
    this.activeVal = null;
  }

  init() {
    this.loadSampleTree();
  }

  loadSampleTree() {
    this.root = null;
    const sampleVals = [50, 25, 75, 15, 35, 60, 85, 10, 20, 30, 40];
    sampleVals.forEach(v => this.insertSync(v));
    this.render();
  }

  clear() {
    this.root = null;
    this.clearQueue();
    this.render();
  }

  clearQueue() {
    if (this.queueContainer) this.queueContainer.innerHTML = '';
    this.traversalQueue = [];
  }

  insertSync(val) {
    const insertNode = (node, v) => {
      if (!node) return new TreeNode(v);
      if (v < node.val) node.left = insertNode(node.left, v);
      else if (v > node.val) node.right = insertNode(node.right, v);
      return node;
    };
    this.root = insertNode(this.root, val);
  }

  deleteSync(val) {
    const minValNode = (node) => {
      let curr = node;
      while (curr.left) curr = curr.left;
      return curr;
    };

    const deleteNode = (node, v) => {
      if (!node) return null;
      if (v < node.val) node.left = deleteNode(node.left, v);
      else if (v > node.val) node.right = deleteNode(node.right, v);
      else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        const temp = minValNode(node.right);
        node.val = temp.val;
        node.right = deleteNode(node.right, temp.val);
      }
      return node;
    };

    this.root = deleteNode(this.root, val);
    this.render();
  }

  calculatePositions(width, height) {
    if (!this.root) return;

    const computeLayout = (node, depth, leftBound, rightBound) => {
      if (!node) return;
      node.y = 50 + depth * 65;
      node.x = (leftBound + rightBound) / 2;

      computeLayout(node.left, depth + 1, leftBound, node.x);
      computeLayout(node.right, depth + 1, node.x, rightBound);
    };

    computeLayout(this.root, 0, 40, width - 40);
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.nodeMap.clear();

    if (!this.root) {
      this.container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:13px;">Tree is empty. Insert nodes or load preset.</div>`;
      return;
    }

    const rect = this.container.getBoundingClientRect();
    const width = Math.max(600, rect.width || 800);
    const height = Math.max(400, rect.height || 500);

    this.calculatePositions(width, height);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Draw edges first so they are under nodes
    const drawEdges = (node) => {
      if (!node) return;
      if (node.left) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.left.x);
        line.setAttribute('y2', node.left.y);
        line.setAttribute('class', 'tree-edge');
        svg.appendChild(line);
        drawEdges(node.left);
      }
      if (node.right) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', node.right.x);
        line.setAttribute('y2', node.right.y);
        line.setAttribute('class', 'tree-edge');
        svg.appendChild(line);
        drawEdges(node.right);
      }
    };
    drawEdges(this.root);

    // Draw nodes
    const drawNodes = (node) => {
      if (!node) return;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.dataset.val = node.val;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', 18);
      circle.setAttribute('fill', '#121626');
      circle.setAttribute('stroke', '#00f0ff');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('class', 'tree-node-circle');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', node.x);
      text.setAttribute('y', node.y + 4);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#ffffff');
      text.setAttribute('font-family', 'JetBrains Mono, monospace');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', '600');
      text.textContent = node.val;

      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);

      this.nodeMap.set(node.val, { g, circle, text });

      drawNodes(node.left);
      drawNodes(node.right);
    };
    drawNodes(this.root);

    this.container.appendChild(svg);
  }

  highlightNode(val, state = 'active') {
    const item = this.nodeMap.get(val);
    if (!item) return;

    if (state === 'active') {
      item.circle.setAttribute('fill', 'rgba(0, 240, 255, 0.4)');
      item.circle.setAttribute('stroke', '#ffffff');
      item.circle.setAttribute('stroke-width', '3');
    } else if (state === 'match') {
      item.circle.setAttribute('fill', '#10b981');
      item.circle.setAttribute('stroke', '#34d399');
    } else if (state === 'visiting') {
      item.circle.setAttribute('fill', 'rgba(168, 85, 247, 0.4)');
      item.circle.setAttribute('stroke', '#c084fc');
    } else {
      item.circle.setAttribute('fill', '#121626');
      item.circle.setAttribute('stroke', '#00f0ff');
      item.circle.setAttribute('stroke-width', '2');
    }
  }

  resetHighlights() {
    this.nodeMap.forEach(item => {
      item.circle.setAttribute('fill', '#121626');
      item.circle.setAttribute('stroke', '#00f0ff');
      item.circle.setAttribute('stroke-width', '2');
    });
  }

  addQueuePill(val) {
    if (!this.queueContainer) return;
    const pill = document.createElement('div');
    pill.className = 'traversal-pill';
    pill.textContent = val;
    this.queueContainer.appendChild(pill);
    this.queueContainer.scrollLeft = this.queueContainer.scrollWidth;
  }

  // ----------------------------------------------------------
  // STEP EXECUTION & UNDO
  // ----------------------------------------------------------
  applyStep(step, isFastForward = false) {
    this.resetHighlights();

    if (step.type === 'visit') {
      this.highlightNode(step.val, 'visiting');
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playValueTone(step.val, 10, 100);
      }
    } else if (step.type === 'emit') {
      this.highlightNode(step.val, 'active');
      this.addQueuePill(step.val);
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playValueTone(step.val, 10, 100);
      }
    } else if (step.type === 'found') {
      this.highlightNode(step.val, 'match');
      if (!isFastForward && window.soundEngine) {
        window.soundEngine.playSuccess();
      }
    } else if (step.type === 'insert-complete') {
      this.insertSync(step.val);
      this.render();
      this.highlightNode(step.val, 'match');
    }
  }

  undoStep(step) {
    this.resetHighlights();
    if (step.type === 'emit' && this.queueContainer && this.queueContainer.lastChild) {
      this.queueContainer.removeChild(this.queueContainer.lastChild);
    }
  }

  // ----------------------------------------------------------
  // ALGORITHM RECORDING
  // ----------------------------------------------------------
  recordAlgorithm(algoId, targetVal = 35) {
    this.clearQueue();
    this.resetHighlights();
    const steps = [];
    let ops = 0;

    if (algoId === 'bst-search') {
      let curr = this.root;
      while (curr) {
        ops++;
        steps.push({
          type: 'visit',
          val: curr.val,
          lineKey: 'compare',
          narration: `Comparing target (${targetVal}) with current node (${curr.val})`,
          metrics: { comparisons: ops, swaps: 0 }
        });

        if (curr.val === targetVal) {
          steps.push({
            type: 'found',
            val: curr.val,
            lineKey: 'found',
            narration: `Target element ${targetVal} found in BST!`,
            metrics: { comparisons: ops, swaps: 0 }
          });
          break;
        } else if (targetVal < curr.val) {
          steps.push({
            type: 'visit',
            val: curr.val,
            lineKey: 'goLeft',
            narration: `${targetVal} < ${curr.val} → branching left`,
            metrics: { comparisons: ops, swaps: 0 }
          });
          curr = curr.left;
        } else {
          steps.push({
            type: 'visit',
            val: curr.val,
            lineKey: 'goRight',
            narration: `${targetVal} > ${curr.val} → branching right`,
            metrics: { comparisons: ops, swaps: 0 }
          });
          curr = curr.right;
        }
      }

      if (!curr) {
        steps.push({
          type: 'visit',
          val: null,
          lineKey: 'notFound',
          narration: `Value ${targetVal} not found in the BST.`,
          metrics: { comparisons: ops, swaps: 0 }
        });
      }
    }

    else if (algoId === 'bst-inorder') {
      const traverse = (node) => {
        if (!node) return;
        traverse(node.left);
        ops++;
        steps.push({
          type: 'emit',
          val: node.val,
          lineKey: 'visit',
          narration: `In-Order: Visited node (${node.val})`,
          metrics: { comparisons: ops, swaps: 0 }
        });
        traverse(node.right);
      };
      traverse(this.root);
    }

    else if (algoId === 'bst-preorder') {
      const traverse = (node) => {
        if (!node) return;
        ops++;
        steps.push({
          type: 'emit',
          val: node.val,
          lineKey: 'visit',
          narration: `Pre-Order: Visited node (${node.val})`,
          metrics: { comparisons: ops, swaps: 0 }
        });
        traverse(node.left);
        traverse(node.right);
      };
      traverse(this.root);
    }

    else if (algoId === 'bst-postorder') {
      const traverse = (node) => {
        if (!node) return;
        traverse(node.left);
        traverse(node.right);
        ops++;
        steps.push({
          type: 'emit',
          val: node.val,
          lineKey: 'visit',
          narration: `Post-Order: Visited node (${node.val})`,
          metrics: { comparisons: ops, swaps: 0 }
        });
      };
      traverse(this.root);
    }

    else if (algoId === 'bst-levelorder') {
      if (this.root) {
        const queue = [this.root];
        while (queue.length > 0) {
          const node = queue.shift();
          ops++;
          steps.push({
            type: 'emit',
            val: node.val,
            lineKey: 'visit',
            narration: `Level-Order BFS: Visited node (${node.val})`,
            metrics: { comparisons: ops, swaps: 0 }
          });
          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
      }
    }

    return steps;
  }
}

window.TreeVisualizer = TreeVisualizer;
