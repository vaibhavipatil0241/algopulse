/**
 * Execution Engine with Step-by-Step, Time Travel (Undo/Step Back),
 * Speed Control, and State Management.
 */

class ExecutionEngine {
  constructor() {
    this.steps = [];
    this.currentIndex = -1;
    this.isPlaying = false;
    this.timerId = null;
    this.speed = 1; // 0.2x to 10x
    this.baseDelay = 200; // ms
    this.startTime = null;
    this.elapsedTimerId = null;
    this.elapsedSeconds = 0;

    // Callbacks
    this.onApplyStep = null;
    this.onUndoStep = null;
    this.onStateChange = null;
    this.onMetricsUpdate = null;
  }

  loadSteps(steps) {
    this.reset();
    this.steps = steps;
    this.notifyState();
  }

  setSpeed(speedVal) {
    this.speed = Math.max(0.1, Math.min(20, parseFloat(speedVal)));
  }

  getDelay() {
    // Inverse scale: speed 1 => baseDelay (200ms), speed 5 => 40ms, speed 10 => 20ms
    return Math.max(8, Math.round(this.baseDelay / this.speed));
  }

  play() {
    if (this.isPlaying) return;
    if (this.currentIndex >= this.steps.length - 1) {
      // Reached the end, reset before playing
      this.reset();
    }
    this.isPlaying = true;
    this.startElapsedTimer();
    this.notifyState();
    this.scheduleNextStep();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopElapsedTimer();
    this.notifyState();
  }

  togglePlay() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  scheduleNextStep() {
    if (!this.isPlaying) return;

    if (this.currentIndex < this.steps.length - 1) {
      this.stepForward();
      this.timerId = setTimeout(() => {
        this.scheduleNextStep();
      }, this.getDelay());
    } else {
      this.pause();
      if (window.soundEngine) {
        window.soundEngine.playCompleteSweep();
      }
      this.notifyState();
    }
  }

  stepForward() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      const step = this.steps[this.currentIndex];
      if (this.onApplyStep) {
        this.onApplyStep(step, this.currentIndex, this.steps.length);
      }
      this.notifyState();
      return true;
    }
    return false;
  }

  stepBackward() {
    if (this.isPlaying) this.pause();
    if (this.currentIndex >= 0) {
      const step = this.steps[this.currentIndex];
      if (this.onUndoStep) {
        this.onUndoStep(step, this.currentIndex, this.steps.length);
      }
      this.currentIndex--;
      this.notifyState();
      return true;
    }
    return false;
  }

  jumpToEnd() {
    this.pause();
    while (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      const step = this.steps[this.currentIndex];
      if (this.onApplyStep) {
        this.onApplyStep(step, this.currentIndex, this.steps.length, true /* isFastForward */);
      }
    }
    this.notifyState();
  }

  reset() {
    this.pause();
    this.currentIndex = -1;
    this.elapsedSeconds = 0;
    this.stopElapsedTimer();
    this.notifyState();
  }

  startElapsedTimer() {
    if (this.elapsedTimerId) return;
    this.elapsedTimerId = setInterval(() => {
      this.elapsedSeconds += 0.1;
      if (this.onMetricsUpdate) {
        this.onMetricsUpdate({ time: this.elapsedSeconds.toFixed(1) + 's' });
      }
    }, 100);
  }

  stopElapsedTimer() {
    if (this.elapsedTimerId) {
      clearInterval(this.elapsedTimerId);
      this.elapsedTimerId = null;
    }
  }

  notifyState() {
    if (this.onStateChange) {
      this.onStateChange({
        isPlaying: this.isPlaying,
        currentIndex: this.currentIndex,
        totalSteps: this.steps.length,
        isAtStart: this.currentIndex <= -1,
        isAtEnd: this.currentIndex >= this.steps.length - 1 && this.steps.length > 0
      });
    }
  }
}

window.ExecutionEngine = ExecutionEngine;
