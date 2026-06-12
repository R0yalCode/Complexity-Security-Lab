/**
 * ============================================================
 * COMPLEXITY SECURITY LAB — Simulation Engine
 * Drives the animated brute-force simulation using
 * requestAnimationFrame. Supports pause/resume, speed
 * control, and real-time callbacks.
 * ============================================================
 */

import { COMMON_PASSWORDS, CHARSETS } from '../utils/constants.js';

export class SimulationEngine {
  
  /**
   * @param {Object} config
   * @param {string} config.targetPassword - Password to search for
   * @param {string} config.targetHash - SHA-256 hash of the target
   * @param {number} config.charsetSize - Effective charset size
   * @param {number} config.speed - Simulated passwords/second
   * @param {boolean} config.useDictionary - Try dictionary first
   * @param {Object} config.charsetOptions - Which charsets are active
   */
  constructor(config) {
    this.config = config;
    this.running = false;
    this.paused = false;
    this.attempts = 0;
    this.found = false;
    this.startTime = 0;
    this.elapsed = 0;
    this.currentWord = '';
    this.rafId = null;
    this.lastFrameTime = 0;
    this.accumulator = 0;
    
    // Callbacks
    this._onTick = null;
    this._onComplete = null;
    this._onAttempt = null;
    
    // Build the charset string
    this.charset = this._buildCharset(config.charsetOptions);
    
    // Simulation phases
    this.phase = 'dictionary'; // 'dictionary' → 'bruteforce'
    this.dictionaryIndex = 0;
    this.bruteforceLength = 1;
    this.bruteforceIndices = [];
    
    // History of recent attempts for display
    this.recentAttempts = [];
    this.maxRecentAttempts = 30;
    
    // Event log for SOC display
    this.eventLog = [];
  }

  /**
   * Build charset string from options.
   * @param {Object} options
   * @returns {string}
   */
  _buildCharset(options) {
    let charset = '';
    if (options?.lowercase !== false) charset += CHARSETS.lowercase.chars;
    if (options?.uppercase) charset += CHARSETS.uppercase.chars;
    if (options?.numbers) charset += CHARSETS.numbers.chars;
    if (options?.symbols) charset += CHARSETS.symbols.chars;
    return charset || CHARSETS.lowercase.chars;
  }

  /**
   * Register a callback for each simulation tick.
   * Called at ~60fps with current state.
   * @param {Function} callback - ({ attempts, word, found, elapsed, speed, recentAttempts, phase }) => void
   */
  onTick(callback) {
    this._onTick = callback;
  }

  /**
   * Register callback for simulation completion (password found or stopped).
   * @param {Function} callback - ({ found, attempts, elapsed, word }) => void
   */
  onComplete(callback) {
    this._onComplete = callback;
  }

  /**
   * Register callback for each individual attempt.
   * @param {Function} callback - ({ word, match }) => void
   */
  onAttempt(callback) {
    this._onAttempt = callback;
  }

  /**
   * Add an event to the SOC log.
   * @param {string} type - 'info' | 'warning' | 'danger' | 'success'
   * @param {string} message
   */
  _logEvent(type, message) {
    this.eventLog.push({
      time: new Date().toISOString(),
      elapsed: this.elapsed,
      type,
      message,
      attempts: this.attempts
    });
    // Keep last 100 events
    if (this.eventLog.length > 100) {
      this.eventLog.shift();
    }
  }

  /**
   * Start the simulation.
   */
  start() {
    if (this.running) return;
    
    this.running = true;
    this.paused = false;
    this.found = false;
    this.attempts = 0;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.accumulator = 0;
    this.phase = this.config.useDictionary ? 'dictionary' : 'bruteforce';
    this.dictionaryIndex = 0;
    this.bruteforceLength = 1;
    this.bruteforceIndices = [0];
    this.recentAttempts = [];
    this.eventLog = [];
    
    this._logEvent('info', '🚀 Simulación iniciada');
    this._logEvent('info', `📊 Espacio de búsqueda: ${this.config.charsetSize}^${this.config.targetPassword.length} combinaciones`);
    
    if (this.phase === 'dictionary') {
      this._logEvent('info', `📖 Fase 1: Ataque por diccionario (${COMMON_PASSWORDS.length} palabras)`);
    }
    
    this.rafId = requestAnimationFrame(this._loop.bind(this));
  }

  /**
   * Pause the simulation.
   */
  pause() {
    this.paused = true;
    this._logEvent('warning', '⏸️ Simulación pausada');
  }

  /**
   * Resume after pause.
   */
  resume() {
    if (!this.running) return;
    this.paused = false;
    this.lastFrameTime = performance.now();
    this._logEvent('info', '▶️ Simulación reanudada');
    this.rafId = requestAnimationFrame(this._loop.bind(this));
  }

  /**
   * Stop the simulation completely.
   */
  stop() {
    this.running = false;
    this.paused = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this._logEvent('info', '⏹️ Simulación detenida');
    
    if (this._onComplete) {
      this._onComplete({
        found: this.found,
        attempts: this.attempts,
        elapsed: this.elapsed,
        word: this.currentWord
      });
    }
  }

  /**
   * Main animation loop.
   * @param {number} timestamp
   */
  _loop(timestamp) {
    if (!this.running || this.paused) return;

    const deltaTime = (timestamp - this.lastFrameTime) / 1000; // seconds
    this.lastFrameTime = timestamp;
    this.elapsed = (timestamp - this.startTime) / 1000;
    
    // Calculate how many attempts to process this frame
    // Scale speed for visual effect (much slower than real, for educational value)
    const visualSpeed = Math.min(this.config.speed, 5000); // Cap at 5000/s for visibility
    this.accumulator += deltaTime * visualSpeed;
    
    const attemptsThisFrame = Math.floor(this.accumulator);
    this.accumulator -= attemptsThisFrame;
    
    for (let i = 0; i < attemptsThisFrame && !this.found; i++) {
      this._processAttempt();
    }
    
    // Emit tick
    if (this._onTick) {
      this._onTick({
        attempts: this.attempts,
        word: this.currentWord,
        found: this.found,
        elapsed: this.elapsed,
        speed: this.attempts / Math.max(this.elapsed, 0.001),
        recentAttempts: this.recentAttempts,
        phase: this.phase,
        eventLog: this.eventLog
      });
    }
    
    if (this.found) {
      this._logEvent('success', `✅ ¡Contraseña encontrada! "${this.currentWord}" en ${this.attempts} intentos`);
      this.stop();
      return;
    }
    
    this.rafId = requestAnimationFrame(this._loop.bind(this));
  }

  /**
   * Process a single attempt.
   */
  _processAttempt() {
    this.attempts++;
    
    if (this.phase === 'dictionary') {
      this._processDictionaryAttempt();
    } else {
      this._processBruteforceAttempt();
    }
    
    // Check match
    const match = this.currentWord === this.config.targetPassword;
    
    // Record recent attempt
    this.recentAttempts.push({
      word: this.currentWord,
      match,
      attempt: this.attempts
    });
    
    if (this.recentAttempts.length > this.maxRecentAttempts) {
      this.recentAttempts.shift();
    }
    
    if (this._onAttempt) {
      this._onAttempt({ word: this.currentWord, match });
    }
    
    if (match) {
      this.found = true;
    }
    
    // Log milestones
    if (this.attempts === 10) this._logEvent('info', '📍 10 intentos evaluados');
    if (this.attempts === 100) this._logEvent('info', '📍 100 intentos evaluados');
    if (this.attempts === 1000) this._logEvent('warning', '📍 1,000 intentos — sin coincidencia');
    if (this.attempts === 10000) this._logEvent('warning', '📍 10,000 intentos — búsqueda prolongada');
  }

  /**
   * Try the next word from the common passwords dictionary.
   */
  _processDictionaryAttempt() {
    if (this.dictionaryIndex < COMMON_PASSWORDS.length) {
      this.currentWord = COMMON_PASSWORDS[this.dictionaryIndex];
      this.dictionaryIndex++;
    } else {
      // Switch to brute force
      this.phase = 'bruteforce';
      this._logEvent('info', `🔄 Diccionario agotado. Fase 2: Fuerza bruta (longitud ${this.bruteforceLength})`);
      this._processBruteforceAttempt();
    }
  }

  /**
   * Generate the next brute-force combination.
   * Iterates through all possible strings of increasing length.
   */
  _processBruteforceAttempt() {
    // Build current word from indices
    this.currentWord = this.bruteforceIndices.map(i => this.charset[i]).join('');
    
    // Increment (like a counter in base `charset.length`)
    this._incrementIndices();
  }

  /**
   * Increment the brute-force index array (odometer-style).
   */
  _incrementIndices() {
    const base = this.charset.length;
    let carry = true;
    
    for (let i = this.bruteforceIndices.length - 1; i >= 0 && carry; i--) {
      this.bruteforceIndices[i]++;
      if (this.bruteforceIndices[i] >= base) {
        this.bruteforceIndices[i] = 0;
      } else {
        carry = false;
      }
    }
    
    if (carry) {
      // All combinations of this length exhausted — increase length
      this.bruteforceLength++;
      this.bruteforceIndices = new Array(this.bruteforceLength).fill(0);
      this._logEvent('info', `📐 Incrementando longitud de búsqueda a ${this.bruteforceLength}`);
    }
  }

  /**
   * Get current simulation state snapshot.
   * @returns {Object}
   */
  getState() {
    return {
      running: this.running,
      paused: this.paused,
      found: this.found,
      attempts: this.attempts,
      elapsed: this.elapsed,
      currentWord: this.currentWord,
      phase: this.phase,
      recentAttempts: [...this.recentAttempts],
      eventLog: [...this.eventLog],
      speed: this.elapsed > 0 ? this.attempts / this.elapsed : 0
    };
  }
}
