/**
 * Web Audio API Sound Synthesizer for Algorithm Visualizer
 * Generates dynamic pitch-shifted tones based on values, comparisons, and completions.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.volume = 0.15;
    this.isMuted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, parseFloat(val)));
  }

  /**
   * Play a tone corresponding to a value within a range [minVal, maxVal]
   */
  playValueTone(value, minVal = 5, maxVal = 100, duration = 0.08) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const norm = Math.max(0, Math.min(1, (value - minVal) / (maxVal - minVal || 1)));
    // Frequency range: 200 Hz to 850 Hz (musical pentatonic scale mapping)
    const baseFreq = 200 + norm * 650;

    this.playTone(baseFreq, 'sine', duration, this.volume);
  }

  /**
   * Play simple tone with smooth exponential decay envelope
   */
  playTone(freq, type = 'sine', duration = 0.08, vol = this.volume) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Play comparison sound
   */
  playCompare(val1, val2, minVal = 5, maxVal = 100) {
    this.playValueTone(val1, minVal, maxVal, 0.05);
  }

  /**
   * Play swap/write sound (slightly punchier triangle wave)
   */
  playSwap(val1, val2, minVal = 5, maxVal = 100) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const norm = (val1 - minVal) / (maxVal - minVal || 1);
    const freq = 300 + norm * 500;
    this.playTone(freq, 'triangle', 0.07, this.volume * 1.2);
  }

  /**
   * Play step/visit node sound
   */
  playStep(cost = 1) {
    const freq = 350 + (cost % 10) * 45;
    this.playTone(freq, 'sine', 0.04, this.volume * 0.8);
  }

  /**
   * Play match/found chime (two harmonious intervals)
   */
  playSuccess() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.18, this.volume);
      }, idx * 70);
    });
  }

  /**
   * Victory / Complete sweep
   */
  playCompleteSweep() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const arpeggio = [440, 554.37, 659.25, 880];
    arpeggio.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.15, this.volume * 0.9);
      }, idx * 80);
    });
  }
}

// Export singleton instance
window.soundEngine = new SoundEngine();
