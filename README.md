# AlgoPulse — Interactive DSA Algorithm Visualizer Studio

A high-performance, visually rich Algorithm & Data Structures Learning Platform built with vanilla **HTML5, CSS3, and modern JavaScript**. Designed around the educational philosophy:

> *"Don't just watch the algorithm. See the code think."*  
> **CODE LINE → VISUAL ACTION → SIMPLE EXPLANATION**

---

## 🌟 Key Features & Architecture

### 1. 3-Column Educational Learning Workspace
- **Left Column**: Categorized Algorithm Navigation (Sorting, Searching, Graphs, Trees, Dynamic Programming) with instant search filtering (`/`).
- **Center Column**: 
  - Algorithm header with Big-O complexity badges (`Time: O(n²)`, `Space: O(1)`, `Stable`, `In-place`).
  - Main Visualizer Canvas with clean bar/card representations, values, zero-based index numbers, and **dynamic curved SVG movement arrows** demonstrating shifts, comparisons, and swaps.
  - Interactive playback controls: Play/Pause, Step Backward, Step Forward, Auto Play / Jump End, Speed Slider, and Custom Input.
- **Lower Split Area**:
  - **Synchronized Code Editor**: Multi-language support (Python, JavaScript, C++, Java), tabs for **Code**, **Explanation**, **Pseudocode**, and **Complexity**, syntax highlighting, line numbers, and active line highlight with execution marker (`▶`).
  - **Beginner-Friendly Learning Card**: Step indicator (`Step X of Y`) with `<` / `>` buttons, **What's Happening?**, **Why?**, **What happens next?**, and a live **Current Array** mini representation with highlighted indices.

### 2. Dual Themes (Warm Neutral Light & Refined Charcoal Dark)
- **Light Mode**: Warm off-white/cream background (`#FAF8F5`), dark charcoal text, warm golden orange accent (`#D97706`), muted green for sorted (`#2E8B57`), soft coral for comparing (`#D9534F`).
- **Dark Mode**: Deep charcoal/near-black background (`#0F1115`), warm golden orange accent (`#F59E0B`), muted green (`#34D399`), soft red (`#F87171`).
- Theme selection persists in `localStorage` and honors system `prefers-color-scheme`.

### 3. Supported DSA Modules & Algorithms
- **Sorting**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort, Counting Sort, Radix Sort.
- **Searching**: Binary Search ($O(\log n)$ with caliper brackets for Low, Mid, High), Linear Search ($O(n)$).
- **Graphs & Pathfinding**: Dijkstra's Algorithm, A* Search, Breadth-First Search (BFS), Depth-First Search (DFS), interactive wall/weight drawing, and Recursive Division maze generation.
- **Binary Trees**: BST Search, Insertion, Deletion, and Traversals (In-Order, Pre-Order, Post-Order, Level-Order BFS) with vector SVG layout.
- **Dynamic Programming**: 0/1 Knapsack problem with live 2D recurrence matrix table and source tracking.
- **Acoustic Feedback**: Pitch-mapped Web Audio API synthesizer reflecting element values and state changes.

---

## 🚀 Getting Started

### Local Development Server

```bash
cd algo-visualizer
python3 -m http.server 8080
```

Open `http://localhost:8080` in any modern web browser.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| --- | --- |
| <kbd>Space</kbd> | Play / Pause Algorithm |
| <kbd>→</kbd> (Right Arrow) | Step Forward |
| <kbd>←</kbd> (Left Arrow) | Step Backward (Time Travel) |
| <kbd>R</kbd> | Reset current algorithm |
| <kbd>M</kbd> | Toggle audio mute / unmute |
| <kbd>/</kbd> | Focus global algorithm search |
| <kbd>?</kbd> | Open Shortcuts & Help dialog |
