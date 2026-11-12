/**
 * Synchronized Code Snippets, Complexity Big-O Data & Line Highlights
 * Covers JavaScript, Python, C++, and Java for all supported DSA algorithms.
 */

const ALGORITHM_DATA = {
  // ----------------------------------------------------------
  // SORTING ALGORITHMS
  // ----------------------------------------------------------
  'bubble-sort': {
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    complexity: {
      timeBest: 'O(n)',
      timeAvg: 'O(n²)',
      timeWorst: 'O(n²)',
      space: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes'
    },
    lineMap: {
      start: { js: 2, py: 2, cpp: 2, java: 2 },
      compare: { js: 4, py: 4, cpp: 4, java: 4 },
      swap: { js: 5, py: 5, cpp: 5, java: 5 },
      passDone: { js: 8, py: 7, cpp: 8, java: 8 },
      complete: { js: 9, py: 8, cpp: 9, java: 9 }
    },
    code: {
      javascript: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
      cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
      java: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
    }
  },

  'selection-sort': {
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Divides the array into sorted and unsorted subarrays, continuously finding the minimum element from the unsorted part.',
    complexity: {
      timeBest: 'O(n²)',
      timeAvg: 'O(n²)',
      timeWorst: 'O(n²)',
      space: 'O(1)',
      stable: 'No',
      inPlace: 'Yes'
    },
    lineMap: {
      start: { js: 2, py: 2, cpp: 2, java: 2 },
      findMin: { js: 3, py: 3, cpp: 3, java: 3 },
      compare: { js: 5, py: 5, cpp: 5, java: 5 },
      updateMin: { js: 6, py: 6, cpp: 6, java: 6 },
      swap: { js: 9, py: 8, cpp: 9, java: 9 },
      complete: { js: 11, py: 9, cpp: 11, java: 11 }
    },
    code: {
      javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
  }
  return arr;
}`,
      python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
      cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx])
                minIdx = j;
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
      java: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}`
    }
  },

  'insertion-sort': {
    name: 'Insertion Sort',
    category: 'sorting',
    description: 'Builds the final sorted array one item at a time, repeatedly consuming one element and inserting it into its correct position.',
    complexity: {
      timeBest: 'O(n)',
      timeAvg: 'O(n²)',
      timeWorst: 'O(n²)',
      space: 'O(1)',
      stable: 'Yes',
      inPlace: 'Yes'
    },
    lineMap: {
      start: { js: 2, py: 2, cpp: 2, java: 2 },
      pickKey: { js: 3, py: 3, cpp: 3, java: 3 },
      compare: { js: 5, py: 5, cpp: 5, java: 5 },
      shift: { js: 6, py: 6, cpp: 6, java: 6 },
      insert: { js: 9, py: 8, cpp: 9, java: 9 },
      complete: { js: 11, py: 9, cpp: 11, java: 11 }
    },
    code: {
      javascript: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
      python: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
      cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
      java: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`
    }
  },

  'merge-sort': {
    name: 'Merge Sort',
    category: 'sorting',
    description: 'A divide-and-conquer algorithm that recursively splits the array into two halves, sorts them, and merges the sorted halves.',
    complexity: {
      timeBest: 'O(n log n)',
      timeAvg: 'O(n log n)',
      timeWorst: 'O(n log n)',
      space: 'O(n)',
      stable: 'Yes',
      inPlace: 'No'
    },
    lineMap: {
      divide: { js: 3, py: 3, cpp: 3, java: 3 },
      merge: { js: 7, py: 6, cpp: 7, java: 7 },
      compare: { js: 9, py: 8, cpp: 9, java: 9 },
      write: { js: 10, py: 9, cpp: 10, java: 10 },
      complete: { js: 14, py: 13, cpp: 14, java: 14 }
    },
    code: {
      javascript: `function mergeSort(arr, l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  mergeSort(arr, l, m);
  mergeSort(arr, m + 1, r);
  merge(arr, l, m, r);
}
function merge(arr, l, m, r) {
  // Merge sorted sub-arrays
  while (i <= m && j <= r) {
    if (left[i] <= right[j]) arr[k++] = left[i++];
    else arr[k++] = right[j++];
  }
}`,
      python: `def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr) // 2
        L, R = arr[:mid], arr[mid:]
        merge_sort(L); merge_sort(R)
        i = j = k = 0
        while i < len(L) and j < len(R):
            if L[i] <= R[j]: arr[k] = L[i]; i += 1
            else: arr[k] = R[j]; j += 1
            k += 1`,
      cpp: `void mergeSort(vector<int>& arr, int l, int r) {
    if (l >= r) return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}
// Merge elements back into arr
`,
      java: `void mergeSort(int[] arr, int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2;
    mergeSort(arr, l, m);
    mergeSort(arr, m + 1, r);
    merge(arr, l, m, r);
}`
    }
  },

  'quick-sort': {
    name: 'Quick Sort',
    category: 'sorting',
    description: 'Selects a pivot element, partitions the array such that elements smaller than the pivot are left, and larger are right, then recurses.',
    complexity: {
      timeBest: 'O(n log n)',
      timeAvg: 'O(n log n)',
      timeWorst: 'O(n²)',
      space: 'O(log n)',
      stable: 'No',
      inPlace: 'Yes'
    },
    lineMap: {
      pivot: { js: 5, py: 4, cpp: 4, java: 4 },
      compare: { js: 7, py: 6, cpp: 6, java: 6 },
      swap: { js: 9, py: 7, cpp: 8, java: 8 },
      partitionDone: { js: 11, py: 8, cpp: 10, java: 10 },
      recurse: { js: 3, py: 2, cpp: 2, java: 2 }
    },
    code: {
      javascript: `function quickSort(arr, low, high) {
  if (low < high) {
    const p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
  }
}
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      python: `def quick_sort(arr, low, high):
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)

def partition(arr, low, high):
    pivot = arr[high]; i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1; arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}`,
      java: `int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`
    }
  },

  'heap-sort': {
    name: 'Heap Sort',
    category: 'sorting',
    description: 'Converts the array into a max heap, then repeatedly extracts the maximum root element and places it at the end of the array.',
    complexity: {
      timeBest: 'O(n log n)',
      timeAvg: 'O(n log n)',
      timeWorst: 'O(n log n)',
      space: 'O(1)',
      stable: 'No',
      inPlace: 'Yes'
    },
    lineMap: {
      buildHeap: { js: 3, py: 3, cpp: 3, java: 3 },
      extractMax: { js: 7, py: 6, cpp: 6, java: 6 },
      heapify: { js: 12, py: 11, cpp: 11, java: 11 },
      compare: { js: 14, py: 13, cpp: 13, java: 13 },
      swap: { js: 17, py: 15, cpp: 16, java: 16 }
    },
    code: {
      javascript: `function heapSort(arr) {
  const n = arr.length;
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    heapify(arr, n, i);
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}
function heapify(arr, n, i) {
  let largest = i, l = 2 * i + 1, r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
      python: `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i; l, r = 2 * i + 1, 2 * i + 2
    if l < n and arr[l] > arr[largest]: largest = l
    if r < n and arr[r] > arr[largest]: largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`,
      cpp: `void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}`,
      java: `public void heapSort(int[] arr) {
    int n = arr.length;
    for (int i = n / 2 - 1; i >= 0; i--) heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {
        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;
        heapify(arr, i, 0);
    }
}`
    }
  },

  // ----------------------------------------------------------
  // PATHFINDING & GRAPH ALGORITHMS
  // ----------------------------------------------------------
  'dijkstra': {
    name: "Dijkstra's Algorithm",
    category: 'pathfinding',
    description: 'Guarantees the shortest path in a weighted graph by greedily exploring the node with the smallest accumulated distance.',
    complexity: {
      timeBest: 'O((V + E) log V)',
      timeAvg: 'O((V + E) log V)',
      timeWorst: 'O(V²)',
      space: 'O(V)',
      stable: 'N/A',
      inPlace: 'No'
    },
    lineMap: {
      init: { js: 2, py: 2, cpp: 2, java: 2 },
      extractMin: { js: 4, py: 4, cpp: 4, java: 4 },
      visitNeighbors: { js: 7, py: 7, cpp: 7, java: 7 },
      relaxEdge: { js: 9, py: 9, cpp: 9, java: 9 },
      pathFound: { js: 12, py: 11, cpp: 12, java: 12 }
    },
    code: {
      javascript: `function dijkstra(grid, start, target) {
  const dist = new Map();
  const pq = new MinPriorityQueue();
  pq.enqueue(start, 0);
  while (!pq.isEmpty()) {
    const curr = pq.dequeue();
    if (curr === target) return reconstructPath(curr);
    for (const neighbor of getNeighbors(curr)) {
      const alt = dist[curr] + neighbor.weight;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        pq.enqueue(neighbor, alt);
      }
    }
  }
}`,
      python: `def dijkstra(graph, start, target):
    dist = {start: 0}
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == target:
            return reconstruct_path(u)
        for v, weight in graph[u]:
            if d + weight < dist.get(v, float('inf')):
                dist[v] = d + weight
                heapq.heappush(pq, (dist[v], v))`,
      cpp: `void dijkstra(Graph& g, int start, int target) {
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    dist[start] = 0;
    pq.push({0, start});
    while (!pq.empty()) {
        int u = pq.top().second; pq.pop();
        if (u == target) break;
        for (auto& edge : g[u]) {
            if (dist[u] + edge.w < dist[edge.v]) {
                dist[edge.v] = dist[u] + edge.w;
                pq.push({dist[edge.v], edge.v});
            }
        }
    }
}`,
      java: `public void dijkstra(int start, int target) {
    PriorityQueue<Node> pq = new PriorityQueue<>();
    dist[start] = 0;
    pq.add(new Node(start, 0));
    while (!pq.isEmpty()) {
        Node curr = pq.poll();
        if (curr.id == target) break;
        for (Edge edge : adj.get(curr.id)) {
            if (dist[curr.id] + edge.weight < dist[edge.to]) {
                dist[edge.to] = dist[curr.id] + edge.weight;
                pq.add(new Node(edge.to, dist[edge.to]));
            }
        }
    }
}`
    }
  },

  'astar': {
    name: 'A* Search',
    category: 'pathfinding',
    description: 'An informed search algorithm combining Dijkstra’s actual cost g(n) with an admissible heuristic estimate h(n) towards the goal.',
    complexity: {
      timeBest: 'O(b^d)',
      timeAvg: 'O(E)',
      timeWorst: 'O(b^d)',
      space: 'O(b^d)',
      stable: 'N/A',
      inPlace: 'No'
    },
    lineMap: {
      init: { js: 2, py: 2, cpp: 2, java: 2 },
      extractMin: { js: 4, py: 4, cpp: 4, java: 4 },
      heuristic: { js: 7, py: 6, cpp: 7, java: 7 },
      relax: { js: 9, py: 8, cpp: 9, java: 9 },
      pathFound: { js: 12, py: 11, cpp: 12, java: 12 }
    },
    code: {
      javascript: `function aStar(start, target) {
  const openSet = new PriorityQueue();
  openSet.enqueue(start, fScore(start));
  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    if (current === target) return reconstructPath(current);
    for (const neighbor of neighbors(current)) {
      const tentativeG = gScore[current] + cost(current, neighbor);
      if (tentativeG < gScore[neighbor]) {
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, target);
        openSet.enqueue(neighbor, fScore[neighbor]);
      }
    }
  }
}`,
      python: `def a_star(start, target):
    open_set = [(0 + h(start, target), start)]
    g_score = {start: 0}
    while open_set:
        _, curr = heapq.heappop(open_set)
        if curr == target:
            return reconstruct_path(curr)
        for neighbor in get_neighbors(curr):
            tentative_g = g_score[curr] + weight(curr, neighbor)
            if tentative_g < g_score.get(neighbor, float('inf')):
                g_score[neighbor] = tentative_g
                f = tentative_g + h(neighbor, target)
                heapq.heappush(open_set, (f, neighbor))`,
      cpp: `void aStar(Node* start, Node* target) {
    priority_queue<Element> openSet;
    openSet.push({start, heuristic(start, target)});
    while (!openSet.empty()) {
        Node* curr = openSet.top().node; openSet.pop();
        if (curr == target) return reconstructPath(curr);
        for (Node* next : curr->neighbors) {
            int tentG = curr->g + next->cost;
            if (tentG < next->g) {
                next->g = tentG;
                next->f = tentG + heuristic(next, target);
                openSet.push({next, next->f});
            }
        }
    }
}`,
      java: `public List<Node> aStar(Node start, Node target) {
    PriorityQueue<Node> openSet = new PriorityQueue<>();
    start.g = 0;
    start.f = heuristic(start, target);
    openSet.add(start);
    while (!openSet.isEmpty()) {
        Node curr = openSet.poll();
        if (curr.equals(target)) return buildPath(curr);
        for (Node n : curr.neighbors) {
            double tentG = curr.g + n.weight;
            if (tentG < n.g) {
                n.g = tentG;
                n.f = tentG + heuristic(n, target);
                openSet.add(n);
            }
        }
    }
    return Collections.emptyList();
}`
    }
  },

  'bfs': {
    name: 'Breadth-First Search (BFS)',
    category: 'pathfinding',
    description: 'Explores all neighbors at the present depth prior to moving on to nodes at the next depth level. Guarantees shortest path in unweighted graphs.',
    complexity: {
      timeBest: 'O(V + E)',
      timeAvg: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V)',
      stable: 'N/A',
      inPlace: 'No'
    },
    lineMap: {
      init: { js: 2, py: 2, cpp: 2, java: 2 },
      dequeue: { js: 4, py: 4, cpp: 4, java: 4 },
      checkTarget: { js: 5, py: 5, cpp: 5, java: 5 },
      visitNeighbors: { js: 6, py: 6, cpp: 6, java: 6 },
      enqueue: { js: 9, py: 8, cpp: 9, java: 9 }
    },
    code: {
      javascript: `function bfs(startNode, targetNode) {
  const queue = [startNode];
  const visited = new Set([startNode]);
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === targetNode) return reconstructPath(node);
    for (const neighbor of getNeighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
      python: `def bfs(start, target):
    queue = deque([start])
    visited = {start}
    while queue:
        node = queue.popleft()
        if node == target:
            return reconstruct_path(node)
        for neighbor in get_neighbors(node):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
      cpp: `void bfs(int start, int target) {
    queue<int> q;
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        if (u == target) return;
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
}`,
      java: `public void bfs(int start, int target) {
    Queue<Integer> q = new LinkedList<>();
    q.add(start);
    visited[start] = true;
    while (!q.isEmpty()) {
        int curr = q.poll();
        if (curr == target) return;
        for (int n : adj.get(curr)) {
            if (!visited[n]) {
                visited[n] = true;
                q.add(n);
            }
        }
    }
}`
    }
  },

  'dfs': {
    name: 'Depth-First Search (DFS)',
    category: 'pathfinding',
    description: 'Explores as far as possible along each branch before backtracking.',
    complexity: {
      timeBest: 'O(V + E)',
      timeAvg: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V)',
      stable: 'N/A',
      inPlace: 'No'
    },
    lineMap: {
      init: { js: 2, py: 2, cpp: 2, java: 2 },
      pop: { js: 4, py: 4, cpp: 4, java: 4 },
      checkTarget: { js: 5, py: 5, cpp: 5, java: 5 },
      pushNeighbors: { js: 7, py: 7, cpp: 7, java: 7 }
    },
    code: {
      javascript: `function dfs(startNode, targetNode) {
  const stack = [startNode];
  const visited = new Set();
  while (stack.length > 0) {
    const node = stack.pop();
    if (node === targetNode) return reconstructPath(node);
    if (!visited.has(node)) {
      visited.add(node);
      for (const neighbor of getNeighbors(node)) {
        stack.push(neighbor);
      }
    }
  }
}`,
      python: `def dfs(start, target):
    stack = [start]
    visited = set()
    while stack:
        node = stack.pop()
        if node == target:
            return reconstruct_path(node)
        if node not in visited:
            visited.add(node)
            for neighbor in get_neighbors(node):
                stack.append(neighbor)`,
      cpp: `void dfs(int u, int target) {
    visited[u] = true;
    if (u == target) return;
    for (int v : adj[u]) {
        if (!visited[v]) dfs(v, target);
    }
}`,
      java: `public boolean dfs(int u, int target) {
    visited[u] = true;
    if (u == target) return true;
    for (int v : adj.get(u)) {
        if (!visited[v] && dfs(v, target)) return true;
    }
    return false;
}`
    }
  },

  // ----------------------------------------------------------
  // BINARY TREE ALGORITHMS
  // ----------------------------------------------------------
  'bst-insert': {
    name: 'BST Insertion & Search',
    category: 'trees',
    description: 'Maintains the binary search property where left child < parent and right child > parent.',
    complexity: {
      timeBest: 'O(log n)',
      timeAvg: 'O(log n)',
      timeWorst: 'O(n)',
      space: 'O(log n)',
      stable: 'N/A',
      inPlace: 'Yes'
    },
    lineMap: {
      compare: { js: 4, py: 4, cpp: 4, java: 4 },
      goLeft: { js: 5, py: 5, cpp: 5, java: 5 },
      goRight: { js: 7, py: 7, cpp: 7, java: 7 },
      insert: { js: 9, py: 9, cpp: 9, java: 9 }
    },
    code: {
      javascript: `function insert(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) {
    root.left = insert(root.left, val);
  } else if (val > root.val) {
    root.right = insert(root.right, val);
  }
  return root;
}`,
      python: `def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    elif val > root.val:
        root.right = insert(root.right, val)
    return root`,
      cpp: `TreeNode* insert(TreeNode* root, int val) {
    if (!root) return new TreeNode(val);
    if (val < root->val)
        root->left = insert(root->left, val);
    else if (val > root->val)
        root->right = insert(root->right, val);
    return root;
}`,
      java: `TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;
}`
    }
  },

  // ----------------------------------------------------------
  // SEARCHING ALGORITHMS
  // ----------------------------------------------------------
  'binary-search': {
    name: 'Binary Search',
    category: 'searching',
    description: 'Finds the position of a target value within a sorted array by dividing the search interval in half repeatedly.',
    complexity: {
      timeBest: 'O(1)',
      timeAvg: 'O(log n)',
      timeWorst: 'O(log n)',
      space: 'O(1)',
      stable: 'N/A',
      inPlace: 'Yes'
    },
    lineMap: {
      init: { js: 2, py: 2, cpp: 2, java: 2 },
      calcMid: { js: 4, py: 4, cpp: 4, java: 4 },
      compare: { js: 5, py: 5, cpp: 5, java: 5 },
      found: { js: 6, py: 6, cpp: 6, java: 6 },
      shiftLeft: { js: 8, py: 8, cpp: 8, java: 8 },
      shiftRight: { js: 10, py: 10, cpp: 10, java: 10 }
    },
    code: {
      javascript: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) {
      return mid; // Target found
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1; // Not found
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
      cpp: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
      java: `public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    }
  },

  'linear-search': {
    name: 'Linear Search',
    category: 'searching',
    description: 'Sequentially checks each element of the list until a match is found or the whole list has been searched.',
    complexity: {
      timeBest: 'O(1)',
      timeAvg: 'O(n)',
      timeWorst: 'O(n)',
      space: 'O(1)',
      stable: 'N/A',
      inPlace: 'Yes'
    },
    lineMap: {
      compare: { js: 3, py: 3, cpp: 3, java: 3 },
      found: { js: 4, py: 4, cpp: 4, java: 4 },
      notFound: { js: 7, py: 5, cpp: 6, java: 6 }
    },
    code: {
      javascript: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
      python: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
      cpp: `int linearSearch(const vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`,
      java: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}`
    }
  },

  // ----------------------------------------------------------
  // DYNAMIC PROGRAMMING
  // ----------------------------------------------------------
  'knapsack-dp': {
    name: '0/1 Knapsack Problem',
    category: 'dp',
    description: 'Given weights and values of n items, determine the maximum value that fits in a knapsack of capacity W.',
    complexity: {
      timeBest: 'O(n × W)',
      timeAvg: 'O(n × W)',
      timeWorst: 'O(n × W)',
      space: 'O(n × W)',
      stable: 'N/A',
      inPlace: 'No'
    },
    lineMap: {
      init: { js: 2, py: 2, cpp: 2, java: 2 },
      checkWeight: { js: 6, py: 5, cpp: 6, java: 6 },
      include: { js: 7, py: 6, cpp: 7, java: 7 },
      exclude: { js: 9, py: 8, cpp: 9, java: 9 },
      result: { js: 12, py: 10, cpp: 12, java: 12 }
    },
    code: {
      javascript: `function knapsack(W, wt, val, n) {
  const dp = Array.from({length: n + 1}, () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= W; w++) {
      if (wt[i - 1] <= w) {
        dp[i][w] = Math.max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w]);
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  return dp[n][W];
}`,
      python: `def knapsack(W, wt, val, n):
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(1, W + 1):
            if wt[i - 1] <= w:
                dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])
            else:
                dp[i][w] = dp[i - 1][w]
    return dp[n][W]`,
      cpp: `int knapsack(int W, int wt[], int val[], int n) {
    vector<vector<int>> dp(n + 1, vector<int>(W + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i-1] <= w)
                dp[i][w] = max(val[i-1] + dp[i-1][w - wt[i-1]], dp[i-1][w]);
            else
                dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][W];
}`,
      java: `public static int knapsack(int W, int[] wt, int[] val, int n) {
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i - 1] <= w)
                dp[i][w] = Math.max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w]);
            else
                dp[i][w] = dp[i - 1][w];
        }
    }
    return dp[n][W];
}`
    }
  },

  // ----------------------------------------------------------
  // COUNTING & RADIX SORT
  // ----------------------------------------------------------
  'counting-sort': {
    name: 'Counting Sort',
    category: 'sorting',
    description: 'An integer sorting algorithm that operates by counting the number of objects having distinct key values.',
    complexity: {
      timeBest: 'O(n + k)',
      timeAvg: 'O(n + k)',
      timeWorst: 'O(n + k)',
      space: 'O(k)',
      stable: 'Yes',
      inPlace: 'No'
    },
    lineMap: {
      initCount: { js: 2, py: 2, cpp: 2, java: 2 },
      count: { js: 4, py: 4, cpp: 4, java: 4 },
      write: { js: 7, py: 7, cpp: 7, java: 7 }
    },
    code: {
      javascript: `function countingSort(arr) {
  const max = Math.max(...arr), min = Math.min(...arr);
  const count = new Array(max - min + 1).fill(0);
  arr.forEach(x => count[x - min]++);
  let idx = 0;
  for (let i = 0; i < count.length; i++) {
    while (count[i]-- > 0) arr[idx++] = i + min;
  }
  return arr;
}`,
      python: `def counting_sort(arr):
    max_val, min_val = max(arr), min(arr)
    count = [0] * (max_val - min_val + 1)
    for x in arr:
        count[x - min_val] += 1
    idx = 0
    for i, c in enumerate(count):
        for _ in range(c):
            arr[idx] = i + min_val
            idx += 1
    return arr`,
      cpp: `void countingSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());
    int minVal = *min_element(arr.begin(), arr.end());
    vector<int> count(maxVal - minVal + 1, 0);
    for (int x : arr) count[x - minVal]++;
    int idx = 0;
    for (int i = 0; i < count.size(); i++) {
        while (count[i]-- > 0) arr[idx++] = i + minVal;
    }
}`,
      java: `public static void countingSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    int min = Arrays.stream(arr).min().getAsInt();
    int[] count = new int[max - min + 1];
    for (int x : arr) count[x - min]++;
    int idx = 0;
    for (int i = 0; i < count.length; i++) {
        while (count[i]-- > 0) arr[idx++] = i + min;
    }
}`
    }
  },

  'radix-sort': {
    name: 'Radix Sort',
    category: 'sorting',
    description: 'Non-comparative sorting algorithm that sorts data with integer keys by grouping keys by the individual digits.',
    complexity: {
      timeBest: 'O(nk)',
      timeAvg: 'O(nk)',
      timeWorst: 'O(nk)',
      space: 'O(n + k)',
      stable: 'Yes',
      inPlace: 'No'
    },
    lineMap: {
      digitPass: { js: 2, py: 2, cpp: 2, java: 2 },
      countDigit: { js: 5, py: 5, cpp: 5, java: 5 },
      rewrite: { js: 10, py: 10, cpp: 10, java: 10 },
      complete: { js: 14, py: 14, cpp: 14, java: 14 }
    },
    code: {
      javascript: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(arr.length).fill(0);
    const count = new Array(10).fill(0);
    for (let i = 0; i < arr.length; i++) count[Math.floor(arr[i] / exp) % 10]++;
    for (let i = 1; i < 10; i++) count[i] += count[i - 1];
    for (let i = arr.length - 1; i >= 0; i--) {
      output[--count[Math.floor(arr[i] / exp) % 10]] = arr[i];
    }
    for (let i = 0; i < arr.length; i++) arr[i] = output[i];
  }
  return arr;
}`,
      python: `def radix_sort(arr):
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        count = [0] * 10
        output = [0] * len(arr)
        for x in arr:
            count[(x // exp) % 10] += 1
        for i in range(1, 10):
            count[i] += count[i - 1]
        for i in reversed(range(len(arr))):
            d = (arr[i] // exp) % 10
            count[d] -= 1
            output[count[d]] = arr[i]
        for i in range(len(arr)):
            arr[i] = output[i]
        exp *= 10
    return arr`,
      cpp: `void radixSort(vector<int>& arr) {
    int maxVal = *max_element(arr.begin(), arr.end());
    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        vector<int> output(arr.size()), count(10, 0);
        for (int x : arr) count[(x / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = arr.size() - 1; i >= 0; i--) {
            int d = (arr[i] / exp) % 10;
            output[--count[d]] = arr[i];
        }
        for (int i = 0; i < arr.size(); i++) arr[i] = output[i];
    }
}`,
      java: `public static void radixSort(int[] arr) {
    int max = Arrays.stream(arr).max().getAsInt();
    for (int exp = 1; max / exp > 0; exp *= 10) {
        int[] output = new int[arr.length], count = new int[10];
        for (int x : arr) count[(x / exp) % 10]++;
        for (int i = 1; i < 10; i++) count[i] += count[i - 1];
        for (int i = arr.length - 1; i >= 0; i--) {
            int d = (arr[i] / exp) % 10;
            output[--count[d]] = arr[i];
        }
        System.arraycopy(output, 0, arr, 0, arr.length);
    }
}`
    }
  },

  // ----------------------------------------------------------
  // TREE TRAVERSAL ALGORITHMS
  // ----------------------------------------------------------
  'bst-inorder': {
    name: 'In-Order Traversal',
    category: 'trees',
    description: 'Traverses binary tree recursively: Left Subtree → Root → Right Subtree. Produces sorted order for BST.',
    complexity: { timeBest: 'O(n)', timeAvg: 'O(n)', timeWorst: 'O(n)', space: 'O(h)', stable: 'N/A', inPlace: 'Yes' },
    lineMap: { traverseLeft: { js: 3, py: 3, cpp: 3, java: 3 }, visitNode: { js: 4, py: 4, cpp: 4, java: 4 }, traverseRight: { js: 5, py: 5, cpp: 5, java: 5 } },
    code: {
      javascript: `function inOrder(node, result = []) {
  if (!node) return result;
  inOrder(node.left, result);
  result.push(node.val);
  inOrder(node.right, result);
  return result;
}`,
      python: `def in_order(node, result=None):
    if result is None: result = []
    if not node: return result
    in_order(node.left, result)
    result.append(node.val)
    in_order(node.right, result)
    return result`,
      cpp: `void inOrder(TreeNode* node, vector<int>& result) {
    if (!node) return;
    inOrder(node->left, result);
    result.push_back(node->val);
    inOrder(node->right, result);
}`,
      java: `public static void inOrder(TreeNode node, List<Integer> result) {
    if (node == null) return;
    inOrder(node.left, result);
    result.add(node.val);
    inOrder(node.right, result);
}`
    }
  },

  'bst-preorder': {
    name: 'Pre-Order Traversal',
    category: 'trees',
    description: 'Traverses binary tree recursively: Root → Left Subtree → Right Subtree. Useful for creating a copy or prefix expression.',
    complexity: { timeBest: 'O(n)', timeAvg: 'O(n)', timeWorst: 'O(n)', space: 'O(h)', stable: 'N/A', inPlace: 'Yes' },
    lineMap: { visitNode: { js: 3, py: 3, cpp: 3, java: 3 }, traverseLeft: { js: 4, py: 4, cpp: 4, java: 4 }, traverseRight: { js: 5, py: 5, cpp: 5, java: 5 } },
    code: {
      javascript: `function preOrder(node, result = []) {
  if (!node) return result;
  result.push(node.val);
  preOrder(node.left, result);
  preOrder(node.right, result);
  return result;
}`,
      python: `def pre_order(node, result=None):
    if result is None: result = []
    if not node: return result
    result.append(node.val)
    pre_order(node.left, result)
    pre_order(node.right, result)
    return result`,
      cpp: `void preOrder(TreeNode* node, vector<int>& result) {
    if (!node) return;
    result.push_back(node->val);
    preOrder(node->left, result);
    preOrder(node->right, result);
}`,
      java: `public static void preOrder(TreeNode node, List<Integer> result) {
    if (node == null) return;
    result.add(node.val);
    preOrder(node.left, result);
    preOrder(node.right, result);
}`
    }
  },

  'bst-postorder': {
    name: 'Post-Order Traversal',
    category: 'trees',
    description: 'Traverses binary tree recursively: Left Subtree → Right Subtree → Root. Useful for node deletion and bottom-up evaluation.',
    complexity: { timeBest: 'O(n)', timeAvg: 'O(n)', timeWorst: 'O(n)', space: 'O(h)', stable: 'N/A', inPlace: 'Yes' },
    lineMap: { traverseLeft: { js: 3, py: 3, cpp: 3, java: 3 }, traverseRight: { js: 4, py: 4, cpp: 4, java: 4 }, visitNode: { js: 5, py: 5, cpp: 5, java: 5 } },
    code: {
      javascript: `function postOrder(node, result = []) {
  if (!node) return result;
  postOrder(node.left, result);
  postOrder(node.right, result);
  result.push(node.val);
  return result;
}`,
      python: `def post_order(node, result=None):
    if result is None: result = []
    if not node: return result
    post_order(node.left, result)
    post_order(node.right, result)
    result.append(node.val)
    return result`,
      cpp: `void postOrder(TreeNode* node, vector<int>& result) {
    if (!node) return;
    postOrder(node->left, result);
    postOrder(node->right, result);
    result.push_back(node->val);
}`,
      java: `public static void postOrder(TreeNode node, List<Integer> result) {
    if (node == null) return;
    postOrder(node.left, result);
    postOrder(node.right, result);
    result.add(node.val);
}`
    }
  },

  'bst-levelorder': {
    name: 'Level-Order Traversal (BFS)',
    category: 'trees',
    description: 'Visits nodes level-by-level from top to bottom and left to right using a First-In-First-Out (FIFO) queue.',
    complexity: { timeBest: 'O(n)', timeAvg: 'O(n)', timeWorst: 'O(n)', space: 'O(w)', stable: 'N/A', inPlace: 'No' },
    lineMap: { visitNode: { js: 5, py: 5, cpp: 5, java: 5 }, traverseLeft: { js: 6, py: 6, cpp: 6, java: 6 }, traverseRight: { js: 7, py: 7, cpp: 7, java: 7 } },
    code: {
      javascript: `function levelOrder(root) {
  if (!root) return [];
  const queue = [root], result = [];
  while (queue.length) {
    const curr = queue.shift();
    result.push(curr.val);
    if (curr.left) queue.push(curr.left);
    if (curr.right) queue.push(curr.right);
  }
  return result;
}`,
      python: `def level_order(root):
    if not root: return []
    queue, result = [root], []
    while queue:
        curr = queue.pop(0)
        result.append(curr.val)
        if curr.left: queue.append(curr.left)
        if curr.right: queue.append(curr.right)
    return result`,
      cpp: `vector<int> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<int> result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* curr = q.front(); q.pop();
        result.push_back(curr->val);
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
    return result;
}`,
      java: `public static List<Integer> levelOrder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        TreeNode curr = q.poll();
        result.add(curr.val);
        if (curr.left != null) q.add(curr.left);
        if (curr.right != null) q.add(curr.right);
    }
    return result;
}`
    }
  },

  'bst-search': {
    name: 'BST Search',
    category: 'trees',
    description: 'Searches for target value in a Binary Search Tree by exploiting the ordering property: left < root < right.',
    complexity: { timeBest: 'O(1)', timeAvg: 'O(log n)', timeWorst: 'O(n)', space: 'O(h)', stable: 'N/A', inPlace: 'Yes' },
    lineMap: { compare: { js: 3, py: 3, cpp: 3, java: 3 }, goLeft: { js: 5, py: 5, cpp: 5, java: 5 }, goRight: { js: 7, py: 7, cpp: 7, java: 7 } },
    code: {
      javascript: `function searchBST(root, target) {
  if (!root || root.val === target) return root;
  if (target < root.val) return searchBST(root.left, target);
  return searchBST(root.right, target);
}`,
      python: `def search_bst(root, target):
    if not root or root.val == target:
        return root
    if target < root.val:
        return search_bst(root.left, target)
    return search_bst(root.right, target)`,
      cpp: `TreeNode* searchBST(TreeNode* root, int target) {
    if (!root || root->val == target) return root;
    if (target < root->val) return searchBST(root->left, target);
    return searchBST(root->right, target);
}`,
      java: `public static TreeNode searchBST(TreeNode root, int target) {
    if (root == null || root.val == target) return root;
    if (target < root.val) return searchBST(root.left, target);
    return searchBST(root.right, target);
}`
    }
  }
};

// ----------------------------------------------------------
// RICH EDUCATIONAL DATA ENRICHMENT: PSEUDOCODE, EXPLANATION & COMPLEXITY
// ----------------------------------------------------------
const ALGO_EDUCATIONAL_DETAILS = {
  'insertion-sort': {
    pseudocode: `algorithm insertionSort(A):
    for i from 1 to length(A) - 1:
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key:
            A[j + 1] = A[j]   // shift larger element right
            j = j - 1
        A[j + 1] = key       // insert key in correct position`,
    explanation: `<h4>How Insertion Sort Works</h4>
<p>Insertion sort works much like the way you sort playing cards in your hands. The array is conceptually split into a sorted and an unsorted division.</p>
<ul>
  <li><strong>Key Selection:</strong> Values from the unsorted part are picked one by one.</li>
  <li><strong>Comparison & Shift:</strong> The key is compared with elements in the sorted partition from right to left. Larger elements shift one slot to the right.</li>
  <li><strong>Placement:</strong> Once a smaller element (or boundary) is reached, the key is inserted into the empty position.</li>
</ul>
<p><strong>Ideal Use Cases:</strong> Extremely fast for small arrays (N &le; 20) and nearly sorted data sets where it operates in linear <em>O(N)</em> time.</p>`,
    complexityExplanation: `<h4>Complexity Analysis</h4>
<ul>
  <li><strong>Best Case: O(N)</strong> &mdash; When the input is already sorted, only 1 comparison is made per element and 0 shifts occur.</li>
  <li><strong>Average Case: O(N&sup2;)</strong> &mdash; On random inputs, each element shifts about halfway through the sorted section on average.</li>
  <li><strong>Worst Case: O(N&sup2;)</strong> &mdash; When reversed, every element must be shifted past all previously processed items.</li>
  <li><strong>Space: O(1)</strong> &mdash; In-place sort requiring only a single variable for key storage.</li>
  <li><strong>Stability: Stable</strong> &mdash; Equal elements never pass each other because shifting requires strict inequality (<code>A[j] > key</code>).</li>
</ul>`
  },

  'bubble-sort': {
    pseudocode: `algorithm bubbleSort(A):
    n = length(A)
    for i from 0 to n - 2:
        for j from 0 to n - i - 2:
            if A[j] > A[j + 1]:
                swap(A[j], A[j + 1])`,
    explanation: `<h4>How Bubble Sort Works</h4>
<p>Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.</p>
<ul>
  <li>Each pass through the list bubbles the largest unsorted element to its final location at the end of the array.</li>
  <li>Passes continue until no swaps are needed, signaling a completely sorted list.</li>
</ul>`,
    complexityExplanation: `<h4>Complexity Analysis</h4>
<ul>
  <li><strong>Best Case: O(N)</strong> &mdash; With early termination when already sorted.</li>
  <li><strong>Average & Worst Case: O(N&sup2;)</strong> &mdash; Requires N(N-1)/2 comparisons.</li>
  <li><strong>Space: O(1)</strong> &mdash; In-place sort.</li>
  <li><strong>Stability: Stable</strong> &mdash; Identical elements maintain relative order.</li>
</ul>`
  },

  'selection-sort': {
    pseudocode: `algorithm selectionSort(A):
    n = length(A)
    for i from 0 to n - 2:
        minIdx = i
        for j from i + 1 to n - 1:
            if A[j] < A[minIdx]:
                minIdx = j
        if minIdx != i:
            swap(A[i], A[minIdx])`,
    explanation: `<h4>How Selection Sort Works</h4>
<p>Selection Sort divides the array into a sorted subarray on the left and an unsorted subarray on the right.</p>
<ul>
  <li>In every round, it finds the smallest element in the unsorted subarray.</li>
  <li>It swaps this smallest element with the first unsorted position, expanding the sorted section by 1.</li>
</ul>`,
    complexityExplanation: `<h4>Complexity Analysis</h4>
<ul>
  <li><strong>Time: O(N&sup2;) in all cases</strong> &mdash; Always scans the remaining elements regardless of initial ordering.</li>
  <li><strong>Space: O(1)</strong> &mdash; In-place.</li>
  <li><strong>Stability: Not Stable</strong> &mdash; Long swaps can jump over identical elements.</li>
</ul>`
  },

  'merge-sort': {
    pseudocode: `algorithm mergeSort(A, start, end):
    if start < end:
        mid = (start + end) / 2
        mergeSort(A, start, mid)
        mergeSort(A, mid + 1, end)
        merge(A, start, mid, end)`,
    explanation: `<h4>How Merge Sort Works</h4>
<p>Merge Sort is a classic divide-and-conquer algorithm that recursively cuts the array into two halves until single-element subarrays remain, then merges them in sorted order.</p>`,
    complexityExplanation: `<h4>Complexity Analysis</h4>
<ul>
  <li><strong>Time: O(N log N) in all cases</strong> &mdash; Recurrence relation T(N) = 2T(N/2) + O(N).</li>
  <li><strong>Space: O(N)</strong> &mdash; Requires temporary array buffers for merging.</li>
  <li><strong>Stability: Stable</strong> &mdash; Preserves relative order during merge.</li>
</ul>`
  },

  'quick-sort': {
    pseudocode: `algorithm quickSort(A, low, high):
    if low < high:
        pi = partition(A, low, high)
        quickSort(A, low, pi - 1)
        quickSort(A, pi + 1, high)`,
    explanation: `<h4>How Quick Sort Works</h4>
<p>Quick Sort selects a 'pivot' element and partitions the array such that all items smaller than pivot are placed to its left, and larger items to its right, then recurses on both partitions.</p>`,
    complexityExplanation: `<h4>Complexity Analysis</h4>
<ul>
  <li><strong>Best / Avg: O(N log N)</strong> &mdash; Balanced partitions.</li>
  <li><strong>Worst: O(N&sup2;)</strong> &mdash; Unbalanced partitions (e.g. already sorted with poor pivot).</li>
  <li><strong>Space: O(log N)</strong> &mdash; Call stack.</li>
</ul>`
  },

  'binary-search': {
    pseudocode: `algorithm binarySearch(A, target):
    low = 0, high = length(A) - 1
    while low <= high:
        mid = low + (high - low) / 2
        if A[mid] == target: return mid
        else if A[mid] < target: low = mid + 1
        else: high = mid - 1
    return -1`,
    explanation: `<h4>How Binary Search Works</h4>
<p>Binary Search looks for a target in a strictly sorted array by repeatedly halving the search window. It compares the target with the middle element and discards the half that cannot contain it.</p>`,
    complexityExplanation: `<h4>Complexity Analysis</h4>
<ul>
  <li><strong>Time: O(log N)</strong> &mdash; Halves problem size each step.</li>
  <li><strong>Space: O(1)</strong> &mdash; Iterative implementation.</li>
</ul>`
  }
};

// Enrich all items in ALGORITHM_DATA with defaults if missing
Object.keys(ALGORITHM_DATA).forEach(key => {
  const item = ALGORITHM_DATA[key];
  const edu = ALGO_EDUCATIONAL_DETAILS[key] || {};
  item.pseudocode = edu.pseudocode || `algorithm ${item.name.replace(/\\s+/g, '')}():
    // Step-by-step logic for ${item.name}
    executeAlgorithm()`;
  item.explanation = edu.explanation || `<h4>About ${item.name}</h4><p>${item.description}</p>`;
  item.complexityExplanation = edu.complexityExplanation || `<h4>Complexity</h4>
<ul>
  <li><strong>Time:</strong> ${item.complexity?.timeAvg || 'O(n)'}</li>
  <li><strong>Space:</strong> ${item.complexity?.space || 'O(1)'}</li>
  <li><strong>Stable:</strong> ${item.complexity?.stable || 'N/A'}</li>
  <li><strong>In-Place:</strong> ${item.complexity?.inPlace || 'Yes'}</li>
</ul>`;
});

window.ALGORITHM_DATA = ALGORITHM_DATA;

