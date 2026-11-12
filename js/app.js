/**
 * Application Orchestrator for AlgoPulse / AlgoVerse
 * Connects 3-Column Educational UI, Visualizer Modules, Execution Engine,
 * Audio Synthesis, Synchronized Syntax-Highlighted Code Viewer, and Learning Step Card.
 * Core Principle: CODE LINE → VISUAL ACTION → SIMPLE EXPLANATION
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------------
  // 1. ENGINE & MODULE INSTANCES
  // ----------------------------------------------------------
  const engine = new ExecutionEngine();

  const visualizers = {
    sorting: new SortingVisualizer('sorting-container'),
    pathfinding: new PathfindingVisualizer('pathfinding-container'),
    trees: new TreeVisualizer('tree-canvas-container', 'tree-traversal-queue'),
    searching: new SearchingVisualizer('searching-container'),
    dp: new DPVisualizer('dp-container')
  };

  const state = {
    currentModule: 'sorting',
    currentAlgo: 'insertion-sort',
    currentLanguage: 'python',
    currentTab: 'code',
    soundMuted: false,
    soundVolume: 0.15,
    theme: localStorage.getItem('algopulse_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  };

  // Set initial theme
  document.documentElement.setAttribute('data-theme', state.theme);

  // ----------------------------------------------------------
  // 2. DOM REFERENCES
  // ----------------------------------------------------------
  const dom = {
    // Navigation & Viewports
    viewports: document.querySelectorAll('.visualizer-viewport'),
    algoSelector: document.getElementById('algo-select'),
    sidebarLinks: document.querySelectorAll('.nav-item-link'),
    categoryGroups: document.querySelectorAll('.nav-category-group'),
    globalSearchInput: document.getElementById('global-search-input'),

    // Mode Tabs
    modeVisualize: document.getElementById('mode-visualize'),
    modeLearn: document.getElementById('mode-learn'),
    modePractice: document.getElementById('mode-practice'),

    // Module Sub-bars
    sortingControls: document.getElementById('sorting-controls'),
    pathfindingControls: document.getElementById('pathfinding-controls'),
    treeControls: document.getElementById('tree-controls'),
    searchingControls: document.getElementById('searching-controls'),
    dpControls: document.getElementById('dp-controls'),

    // Playback Buttons
    playBtn: document.getElementById('btn-play'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    playBtnLabel: document.getElementById('play-btn-label'),
    stepForwardBtn: document.getElementById('btn-step-forward'),
    stepBackBtn: document.getElementById('btn-step-backward'),
    resetBtn: document.getElementById('btn-reset'),
    jumpEndBtn: document.getElementById('btn-jump-end'),

    // Sliders & Controls
    speedSlider: document.getElementById('speed-slider'),
    speedLabel: document.getElementById('speed-label'),
    arraySizeSlider: document.getElementById('array-size-slider'),
    arraySizeLabel: document.getElementById('array-size-label'),
    targetInput: document.getElementById('search-target-input'),

    // Audio
    btnMute: document.getElementById('btn-mute'),
    soundIcon: document.getElementById('sound-icon'),
    muteIcon: document.getElementById('mute-icon'),
    volumeSlider: document.getElementById('volume-slider'),

    // Header & Intel
    intelName: document.getElementById('intel-algo-name'),
    intelDesc: document.getElementById('intel-algo-desc'),
    timeBest: document.getElementById('comp-time-best'),
    timeAvg: document.getElementById('comp-time-avg'),
    timeWorst: document.getElementById('comp-time-worst'),
    spaceComp: document.getElementById('comp-space'),
    tagStable: document.getElementById('tag-stable'),
    tagInPlace: document.getElementById('tag-inplace'),

    // Code Panel & Tabs
    codePre: document.getElementById('code-display'),
    codePreContainer: document.getElementById('code-pre-container'),
    codeTabBtns: document.querySelectorAll('.code-tab-btn'),
    langSelector: document.getElementById('lang-selector'),
    tabPanelExplanation: document.getElementById('tab-panel-explanation'),
    tabPanelPseudocode: document.getElementById('tab-panel-pseudocode'),
    tabPanelComplexity: document.getElementById('tab-panel-complexity'),
    pseudocodePre: document.getElementById('pseudocode-pre'),

    // Learning Step Card
    learningStepPill: document.getElementById('learning-step-pill'),
    learningProgressFill: document.getElementById('learning-progress-fill'),
    learningOpHeadline: document.getElementById('learning-op-headline'),
    learningExplanationText: document.getElementById('learning-explanation-text'),
    learningWhyText: document.getElementById('learning-why-text'),
    learningNextText: document.getElementById('learning-next-text'),
    miniArrayStrip: document.getElementById('mini-array-strip'),
    btnLearningPrev: document.getElementById('btn-learning-prev'),
    btnLearningNext: document.getElementById('btn-learning-next'),

    // Metrics
    metricSteps: document.getElementById('metric-steps'),

    // Modals
    helpModal: document.getElementById('help-modal'),
    btnHelp: document.getElementById('btn-help'),
    btnCloseHelp: document.getElementById('btn-close-help'),
    btnGotIt: document.getElementById('btn-got-it'),
    btnThemeToggle: document.getElementById('btn-theme-toggle'),

    // Custom Input Modal
    customInputModal: document.getElementById('custom-input-modal'),
    btnCustomArray: document.getElementById('btn-custom-array'),
    customArrayInput: document.getElementById('custom-array-input'),
    btnApplyCustom: document.getElementById('btn-apply-custom'),
    btnCancelCustom: document.getElementById('btn-cancel-custom'),
    btnCloseCustomModal: document.getElementById('btn-close-custom-modal')
  };

  // ----------------------------------------------------------
  // 3. SYNTAX HIGHLIGHTING ENGINE
  // ----------------------------------------------------------
  function highlightSyntax(codeText, lang = 'python') {
    const lines = codeText.split('\n');
    return lines.map((rawLine, idx) => {
      let escaped = rawLine
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Comments
      const commentMatch = escaped.match(/(\/\/.*$|#.*$)/);
      let commentPart = '';
      if (commentMatch) {
        commentPart = `<span class="tok-comment">${commentMatch[0]}</span>`;
        escaped = escaped.slice(0, commentMatch.index);
      }

      // Strings
      escaped = escaped.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="tok-str">$&</span>');

      // Keywords
      const kwRegex = /\b(def|return|if|else|elif|for|while|in|range|function|let|const|var|void|int|public|static|vector|class|new|import|from|break|continue|and|or|not)\b/g;
      escaped = escaped.replace(kwRegex, '<span class="tok-kw">$&</span>');

      // Builtins & Functions
      const fnRegex = /\b([a-zA-Z_]\w*)(?=\s*\()/g;
      escaped = escaped.replace(fnRegex, '<span class="tok-fn">$&</span>');

      // Numbers
      escaped = escaped.replace(/\b(\d+)\b/g, '<span class="tok-num">$&</span>');

      const fullContent = escaped + commentPart;

      return `
        <div class="code-line" data-line="${idx + 1}">
          <span class="code-line-marker">▶</span>
          <span class="code-line-num">${idx + 1}</span>
          <span class="code-line-content">${fullContent}</span>
        </div>
      `;
    }).join('');
  }

  // ----------------------------------------------------------
  // 4. MINI ARRAY STRIP RENDERER
  // ----------------------------------------------------------
  function renderMiniArray(array, activeIndices = [], stateType = null) {
    if (!dom.miniArrayStrip) return;
    if (!array || !Array.isArray(array) || array.length === 0) {
      dom.miniArrayStrip.innerHTML = '<span style="font-size:12px; color:var(--text-muted);">No array for this algorithm</span>';
      return;
    }

    // Limit display to max 24 elements for clean layout
    const displayArr = array.slice(0, 24);
    dom.miniArrayStrip.innerHTML = displayArr.map((val, idx) => {
      let stateClass = '';
      if (activeIndices.includes(idx)) {
        if (stateType === 'pivot' || stateType === 'pickKey') stateClass = 'state-key';
        else if (stateType === 'compare') stateClass = 'state-comparing';
        else if (stateType === 'sorted') stateClass = 'state-sorted';
        else stateClass = 'state-key';
      }
      return `
        <div class="mini-array-box">
          <div class="mini-array-cell ${stateClass}">${val}</div>
          <span class="mini-array-index">${idx}</span>
        </div>
      `;
    }).join('');
  }

  // ----------------------------------------------------------
  // 5. STEP DETAILS GENERATOR FALLBACK
  // ----------------------------------------------------------
  function resolveStepDetails(step, currentAlgo) {
    if (step.details && step.details.what) {
      return step.details;
    }

    const algoName = ALGORITHM_DATA[currentAlgo]?.name || currentAlgo;
    const type = step.type || 'step';
    const narration = step.narration || 'Executing operation';

    if (type === 'compare') {
      return {
        what: narration,
        why: `Evaluating condition to determine next branch in ${algoName}.`,
        next: `Proceed to swap, branch, or continue traversal.`
      };
    } else if (type === 'swap' || type === 'overwrite') {
      return {
        what: narration,
        why: `Moving data into updated position to maintain algorithm invariant.`,
        next: `Advance to next scheduled comparison or element.`
      };
    } else if (type === 'sorted') {
      return {
        what: narration,
        why: `Confirmed final order for this position.`,
        next: `Continue processing remaining elements.`
      };
    } else if (type === 'pivot') {
      return {
        what: narration,
        why: `Selected reference element / anchor for partitioning or search.`,
        next: `Compare other elements against this reference.`
      };
    }

    return {
      what: narration,
      why: `Standard execution step for ${algoName}.`,
      next: `Watch the next state transition.`
    };
  }

  // ----------------------------------------------------------
  // 6. ENGINE CALLBACKS (SYNCHRONIZATION)
  // ----------------------------------------------------------
  engine.onApplyStep = (step, index, total) => {
    // 1. Forward to current visualizer
    const vis = visualizers[state.currentModule];
    if (vis && vis.applyStep) {
      vis.applyStep(step);
    }

    // 2. Synchronize Learning Step Card
    const details = resolveStepDetails(step, state.currentAlgo);
    if (dom.learningStepPill) dom.learningStepPill.textContent = `Step ${index + 1} of ${total}`;
    if (dom.learningProgressFill) dom.learningProgressFill.style.width = `${((index + 1) / total) * 100}%`;
    if (dom.learningOpHeadline) dom.learningOpHeadline.textContent = details.what;
    if (dom.learningExplanationText) dom.learningExplanationText.textContent = step.narration || details.what;
    if (dom.learningWhyText) dom.learningWhyText.textContent = details.why;
    if (dom.learningNextText) dom.learningNextText.textContent = details.next;

    // 3. Render Mini Array
    const arr = step.currentArray || vis?.array;
    if (arr) {
      renderMiniArray(arr, step.indices || [], step.type);
    }

    // 4. Update controls step counter
    if (dom.metricSteps) dom.metricSteps.textContent = `${index + 1} / ${total}`;

    // 5. Synchronize Code Line
    highlightCodeLine(step.lineKey);
  };

  engine.onUndoStep = (step, index, total) => {
    const vis = visualizers[state.currentModule];
    if (vis && vis.undoStep) {
      vis.undoStep(step);
    }

    const prevIndex = Math.max(0, index - 1);
    const prevStep = engine.steps[prevIndex];
    if (prevStep) {
      const details = resolveStepDetails(prevStep, state.currentAlgo);
      if (dom.learningStepPill) dom.learningStepPill.textContent = `Step ${prevIndex + 1} of ${total}`;
      if (dom.learningProgressFill) dom.learningProgressFill.style.width = `${((prevIndex + 1) / total) * 100}%`;
      if (dom.learningOpHeadline) dom.learningOpHeadline.textContent = details.what;
      if (dom.learningExplanationText) dom.learningExplanationText.textContent = prevStep.narration || details.what;
      if (dom.learningWhyText) dom.learningWhyText.textContent = details.why;
      if (dom.learningNextText) dom.learningNextText.textContent = details.next;

      const arr = prevStep.currentArray || vis?.array;
      if (arr) renderMiniArray(arr, prevStep.indices || [], prevStep.type);
      highlightCodeLine(prevStep.lineKey);
    } else {
      if (dom.learningStepPill) dom.learningStepPill.textContent = `Step 0 of ${total}`;
      if (dom.learningProgressFill) dom.learningProgressFill.style.width = '0%';
      clearCodeHighlight();
    }

    if (dom.metricSteps) dom.metricSteps.textContent = `${index} / ${total}`;
  };

  engine.onStateChange = (engineState) => {
    if (dom.playIcon && dom.pauseIcon && dom.playBtnLabel) {
      if (engineState.isPlaying) {
        dom.playIcon.style.display = 'none';
        dom.pauseIcon.style.display = 'inline-block';
        dom.playBtnLabel.textContent = 'Pause';
      } else {
        dom.playIcon.style.display = 'inline-block';
        dom.pauseIcon.style.display = 'none';
        dom.playBtnLabel.textContent = 'Play';
      }
    }

    if (dom.stepBackBtn) dom.stepBackBtn.disabled = engineState.isAtStart;
    if (dom.stepForwardBtn) dom.stepForwardBtn.disabled = engineState.isAtEnd;
    if (dom.btnLearningPrev) dom.btnLearningPrev.disabled = engineState.isAtStart;
    if (dom.btnLearningNext) dom.btnLearningNext.disabled = engineState.isAtEnd;
  };

  // ----------------------------------------------------------
  // 7. CODE VIEWER & INTEL POPULATION
  // ----------------------------------------------------------
  function updateIntelAndCode() {
    const data = ALGORITHM_DATA[state.currentAlgo] || ALGORITHM_DATA['insertion-sort'] || ALGORITHM_DATA['bubble-sort'];

    // Header & Complexity Pills
    if (dom.intelName) dom.intelName.textContent = data.name;
    if (dom.intelDesc) dom.intelDesc.textContent = data.description;
    if (dom.timeAvg) dom.timeAvg.textContent = `Time: ${data.complexity.timeAvg}`;
    if (dom.spaceComp) dom.spaceComp.textContent = `Space: ${data.complexity.space}`;
    if (dom.tagStable) dom.tagStable.textContent = `Stable: ${data.complexity.stable}`;
    if (dom.tagInPlace) dom.tagInPlace.textContent = `In-place: ${data.complexity.inPlace}`;

    // Render Code Tab
    renderCode(data);

    // Render Secondary Tabs
    if (dom.tabPanelExplanation) dom.tabPanelExplanation.innerHTML = data.explanation || `<p>${data.description}</p>`;
    if (dom.pseudocodePre) dom.pseudocodePre.textContent = data.pseudocode || '// Pseudocode not available';
    if (dom.tabPanelComplexity) dom.tabPanelComplexity.innerHTML = data.complexityExplanation || '';
  }

  function renderCode(data) {
    if (!dom.codePre) return;
    const rawCode = data.code[state.currentLanguage] || data.code['python'] || data.code['javascript'] || '';
    dom.codePre.innerHTML = highlightSyntax(rawCode, state.currentLanguage);
  }

  function highlightCodeLine(lineKey) {
    if (!lineKey || !dom.codePre) return;
    const data = ALGORITHM_DATA[state.currentAlgo];
    if (!data || !data.lineMap || !data.lineMap[lineKey]) return;

    const langKey = state.currentLanguage === 'python' ? 'py' : (state.currentLanguage === 'javascript' ? 'js' : state.currentLanguage);
    const lineNum = data.lineMap[lineKey][langKey] || data.lineMap[lineKey][state.currentLanguage] || data.lineMap[lineKey]['py'] || data.lineMap[lineKey]['js'];
    if (!lineNum) return;

    // Clear previous
    dom.codePre.querySelectorAll('.code-line.active').forEach(el => el.classList.remove('active'));

    const targetLine = dom.codePre.querySelector(`.code-line[data-line="${lineNum}"]`);
    if (targetLine) {
      targetLine.classList.add('active');
      targetLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function clearCodeHighlight() {
    if (dom.codePre) {
      dom.codePre.querySelectorAll('.code-line.active').forEach(el => el.classList.remove('active'));
    }
  }

  // ----------------------------------------------------------
  // 8. ALGORITHM & MODULE SWITCHING
  // ----------------------------------------------------------
  function selectAlgorithm(algoId, modName) {
    engine.reset();
    state.currentAlgo = algoId;
    state.currentModule = modName;

    // Update Sidebar Navigation Active States
    dom.sidebarLinks.forEach(link => {
      const match = link.dataset.algo === algoId;
      link.classList.toggle('active', match);
      if (match) {
        // Expand parent category
        const parentGroup = link.closest('.nav-category-group');
        if (parentGroup) parentGroup.classList.add('expanded');
      }
    });

    // Switch active viewport
    dom.viewports.forEach(vp => vp.classList.toggle('active', vp.id === `${modName}-viewport`));

    // Show appropriate sub-bar
    if (dom.sortingControls) dom.sortingControls.style.display = modName === 'sorting' ? 'flex' : 'none';
    if (dom.pathfindingControls) dom.pathfindingControls.style.display = modName === 'pathfinding' ? 'flex' : 'none';
    if (dom.treeControls) dom.treeControls.style.display = modName === 'trees' ? 'flex' : 'none';
    if (dom.searchingControls) dom.searchingControls.style.display = modName === 'searching' ? 'flex' : 'none';
    if (dom.dpControls) dom.dpControls.style.display = modName === 'dp' ? 'flex' : 'none';

    // Initialize visualizer if needed
    const vis = visualizers[modName];
    if (vis && !vis._initialized) {
      vis.init();
      vis._initialized = true;
    }

    prepareCurrentAlgorithm();
  }

  function prepareCurrentAlgorithm() {
    engine.reset();
    updateIntelAndCode();

    const vis = visualizers[state.currentModule];
    if (!vis) return;

    let steps = [];
    if (state.currentModule === 'sorting') {
      steps = vis.recordAlgorithm(state.currentAlgo);
    } else if (state.currentModule === 'pathfinding') {
      steps = vis.recordAlgorithm(state.currentAlgo);
    } else if (state.currentModule === 'trees') {
      const targetVal = parseInt(document.getElementById('tree-target-input')?.value || 35);
      steps = vis.recordAlgorithm(state.currentAlgo, targetVal);
    } else if (state.currentModule === 'searching') {
      const targetVal = parseInt(dom.targetInput?.value || vis.target);
      steps = vis.recordAlgorithm(state.currentAlgo, targetVal);
    } else if (state.currentModule === 'dp') {
      steps = vis.recordAlgorithm(state.currentAlgo);
    }

    engine.loadSteps(steps);

    // Initial Learning Card State
    const data = ALGORITHM_DATA[state.currentAlgo];
    if (dom.learningStepPill) dom.learningStepPill.textContent = `Step 0 of ${steps.length}`;
    if (dom.learningProgressFill) dom.learningProgressFill.style.width = '0%';
    if (dom.learningOpHeadline) dom.learningOpHeadline.textContent = `Ready: ${data?.name || state.currentAlgo}`;
    if (dom.learningExplanationText) dom.learningExplanationText.textContent = data?.description || 'Click Play to begin or Step to see line-by-line execution.';
    if (dom.learningWhyText) dom.learningWhyText.textContent = 'Follow the highlighted code line and matching visual action to understand the logic.';
    if (dom.learningNextText) dom.learningNextText.textContent = 'The algorithm will initialize the pointers and check the primary loop condition.';

    // Render Initial Mini Array
    if (state.currentModule === 'sorting' || state.currentModule === 'searching') {
      renderMiniArray(vis.array);
    } else {
      renderMiniArray([]);
    }

    if (dom.metricSteps) dom.metricSteps.textContent = `0 / ${steps.length}`;
  }

  // ----------------------------------------------------------
  // 9. EVENT BINDINGS
  // ----------------------------------------------------------

  // Sidebar Category Expand/Collapse
  dom.categoryGroups.forEach(group => {
    const header = group.querySelector('.nav-category-header');
    if (header) {
      header.addEventListener('click', () => {
        group.classList.toggle('expanded');
      });
    }
  });

  // Sidebar Algorithm Links
  dom.sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      const algo = link.dataset.algo;
      const mod = link.dataset.module;
      if (algo && mod) {
        selectAlgorithm(algo, mod);
      }
    });
  });

  // Global Search Filter
  if (dom.globalSearchInput) {
    dom.globalSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      dom.sidebarLinks.forEach(link => {
        const text = link.textContent.toLowerCase();
        const match = text.includes(query);
        link.style.display = match ? 'flex' : 'none';
      });

      // Auto-expand categories with matching items
      dom.categoryGroups.forEach(group => {
        const hasVisible = Array.from(group.querySelectorAll('.nav-item-link')).some(l => l.style.display !== 'none');
        group.style.display = hasVisible ? 'flex' : 'none';
        if (query.length > 0 && hasVisible) {
          group.classList.add('expanded');
        }
      });
    });
  }

  // Code Panel Tabs
  dom.codeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dom.codeTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentTab = btn.dataset.tab;

      // Hide all panels
      dom.codePreContainer.style.display = 'none';
      dom.tabPanelExplanation.classList.remove('active');
      dom.tabPanelPseudocode.classList.remove('active');
      dom.tabPanelComplexity.classList.remove('active');

      if (state.currentTab === 'code') {
        dom.codePreContainer.style.display = 'block';
      } else if (state.currentTab === 'explanation') {
        dom.tabPanelExplanation.classList.add('active');
      } else if (state.currentTab === 'pseudocode') {
        dom.tabPanelPseudocode.classList.add('active');
      } else if (state.currentTab === 'complexity') {
        dom.tabPanelComplexity.classList.add('active');
      }
    });
  });

  // Language Selector
  if (dom.langSelector) {
    dom.langSelector.value = state.currentLanguage;
    dom.langSelector.addEventListener('change', (e) => {
      state.currentLanguage = e.target.value;
      const data = ALGORITHM_DATA[state.currentAlgo];
      if (data) renderCode(data);
      if (engine.steps[engine.currentIndex]) {
        highlightCodeLine(engine.steps[engine.currentIndex].lineKey);
      }
    });
  }

  // Mode Tabs (Visualize, Learn, Practice)
  [dom.modeVisualize, dom.modeLearn, dom.modePractice].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      [dom.modeVisualize, dom.modeLearn, dom.modePractice].forEach(b => b?.classList.remove('active'));
      btn.classList.add('active');
      if (btn === dom.modeLearn) {
        // Activate explanation tab
        const expBtn = document.querySelector('.code-tab-btn[data-tab="explanation"]');
        if (expBtn) expBtn.click();
      } else if (btn === dom.modePractice) {
        // Open practice / custom input
        if (dom.customInputModal) dom.customInputModal.classList.add('active');
      } else {
        const codeBtn = document.querySelector('.code-tab-btn[data-tab="code"]');
        if (codeBtn) codeBtn.click();
      }
    });
  });

  // Playback Controls
  dom.playBtn.addEventListener('click', () => {
    window.soundEngine?.ensureContext();
    engine.togglePlay();
  });

  dom.stepForwardBtn.addEventListener('click', () => {
    window.soundEngine?.ensureContext();
    engine.stepForward();
  });

  dom.stepBackBtn.addEventListener('click', () => {
    engine.stepBackward();
  });

  if (dom.btnLearningPrev) {
    dom.btnLearningPrev.addEventListener('click', () => engine.stepBackward());
  }
  if (dom.btnLearningNext) {
    dom.btnLearningNext.addEventListener('click', () => {
      window.soundEngine?.ensureContext();
      engine.stepForward();
    });
  }

  dom.resetBtn.addEventListener('click', () => {
    engine.reset();
    prepareCurrentAlgorithm();
  });

  dom.jumpEndBtn.addEventListener('click', () => {
    engine.jumpToEnd();
  });

  // Speed Slider
  if (dom.speedSlider) {
    dom.speedSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      engine.setSpeed(val);
      if (dom.speedLabel) dom.speedLabel.textContent = `${val}x`;
    });
  }

  // Audio Controls
  if (dom.btnMute) {
    dom.btnMute.addEventListener('click', () => {
      state.soundMuted = !state.soundMuted;
      window.soundEngine?.setMuted(state.soundMuted);
      dom.soundIcon.style.display = state.soundMuted ? 'none' : 'block';
      dom.muteIcon.style.display = state.soundMuted ? 'block' : 'none';
      dom.btnMute.classList.toggle('btn-danger', state.soundMuted);
    });
  }

  if (dom.volumeSlider) {
    dom.volumeSlider.addEventListener('input', (e) => {
      state.soundVolume = parseFloat(e.target.value);
      window.soundEngine?.setVolume(state.soundVolume);
    });
  }

  // Theme Toggle with LocalStorage persistence
  if (dom.btnThemeToggle) {
    dom.btnThemeToggle.addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      state.theme = newTheme;
      localStorage.setItem('algopulse_theme', newTheme);
    });
  }

  // Modals (Help)
  if (dom.btnHelp) dom.btnHelp.addEventListener('click', () => dom.helpModal.classList.add('active'));
  if (dom.btnCloseHelp) dom.btnCloseHelp.addEventListener('click', () => dom.helpModal.classList.remove('active'));
  if (dom.btnGotIt) dom.btnGotIt.addEventListener('click', () => dom.helpModal.classList.remove('active'));
  if (dom.helpModal) {
    dom.helpModal.addEventListener('click', (e) => {
      if (e.target === dom.helpModal) dom.helpModal.classList.remove('active');
    });
  }

  // Modals (Custom Input)
  if (dom.btnCustomArray) {
    dom.btnCustomArray.addEventListener('click', () => dom.customInputModal.classList.add('active'));
  }
  if (dom.btnCloseCustomModal) {
    dom.btnCloseCustomModal.addEventListener('click', () => dom.customInputModal.classList.remove('active'));
  }
  if (dom.btnCancelCustom) {
    dom.btnCancelCustom.addEventListener('click', () => dom.customInputModal.classList.remove('active'));
  }
  if (dom.btnApplyCustom) {
    dom.btnApplyCustom.addEventListener('click', () => {
      const val = dom.customArrayInput?.value || '';
      const parsed = val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (parsed.length >= 3) {
        visualizers.sorting.generateArray('custom', parsed);
        prepareCurrentAlgorithm();
        dom.customInputModal.classList.remove('active');
      } else {
        alert('Please enter at least 3 valid numbers.');
      }
    });
  }

  // Sorting UI Controls
  document.getElementById('btn-shuffle-array')?.addEventListener('click', () => {
    visualizers.sorting.generateArray('random');
    prepareCurrentAlgorithm();
  });

  document.getElementById('sort-distribution-select')?.addEventListener('change', (e) => {
    visualizers.sorting.generateArray(e.target.value);
    prepareCurrentAlgorithm();
  });

  if (dom.arraySizeSlider) {
    dom.arraySizeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (dom.arraySizeLabel) dom.arraySizeLabel.textContent = val;
      visualizers.sorting.setSize(val);
      prepareCurrentAlgorithm();
    });
  }

  // Pathfinding Controls
  document.getElementById('btn-clear-path')?.addEventListener('click', () => {
    visualizers.pathfinding.clearPathOnly();
    prepareCurrentAlgorithm();
  });

  document.getElementById('btn-clear-board')?.addEventListener('click', () => {
    visualizers.pathfinding.clearBoard();
    prepareCurrentAlgorithm();
  });

  document.getElementById('btn-random-maze')?.addEventListener('click', () => {
    visualizers.pathfinding.generateRandomMaze();
    prepareCurrentAlgorithm();
  });

  document.getElementById('btn-recursive-maze')?.addEventListener('click', () => {
    visualizers.pathfinding.generateRecursiveMaze();
    prepareCurrentAlgorithm();
  });

  document.getElementById('select-draw-mode')?.addEventListener('change', (e) => {
    visualizers.pathfinding.drawMode = e.target.value;
  });

  // Tree Controls
  document.getElementById('btn-insert-tree')?.addEventListener('click', () => {
    const valInput = document.getElementById('tree-val-input');
    const val = parseInt(valInput?.value);
    if (!isNaN(val)) {
      visualizers.trees.insertSync(val);
      visualizers.trees.render();
      prepareCurrentAlgorithm();
      valInput.value = '';
    }
  });

  document.getElementById('btn-delete-tree')?.addEventListener('click', () => {
    const valInput = document.getElementById('tree-val-input');
    const val = parseInt(valInput?.value);
    if (!isNaN(val)) {
      visualizers.trees.deleteSync(val);
      prepareCurrentAlgorithm();
      valInput.value = '';
    }
  });

  document.getElementById('btn-sample-tree')?.addEventListener('click', () => {
    visualizers.trees.loadSampleTree();
    prepareCurrentAlgorithm();
  });

  document.getElementById('btn-clear-tree')?.addEventListener('click', () => {
    visualizers.trees.clear();
    prepareCurrentAlgorithm();
  });

  // Searching Controls
  document.getElementById('btn-new-search-array')?.addEventListener('click', () => {
    visualizers.searching.generateSortedArray();
    if (dom.targetInput) dom.targetInput.value = visualizers.searching.target;
    prepareCurrentAlgorithm();
  });

  if (dom.targetInput) {
    dom.targetInput.addEventListener('change', (e) => {
      const val = parseInt(e.target.value);
      if (!isNaN(val)) {
        visualizers.searching.setTarget(val);
        prepareCurrentAlgorithm();
      }
    });
  }

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;

    if (e.code === 'Space') {
      e.preventDefault();
      dom.playBtn.click();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      dom.stepForwardBtn.click();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      dom.stepBackBtn.click();
    } else if (e.key === 'r' || e.key === 'R') {
      dom.resetBtn.click();
    } else if (e.key === 'm' || e.key === 'M') {
      dom.btnMute?.click();
    } else if (e.key === '/') {
      e.preventDefault();
      dom.globalSearchInput?.focus();
    } else if (e.key === '?') {
      dom.btnHelp?.click();
    }
  });

  // ----------------------------------------------------------
  // 10. INITIALIZE DEFAULT ALGORITHM (INSERTION SORT)
  // ----------------------------------------------------------
  selectAlgorithm('insertion-sort', 'sorting');
});
