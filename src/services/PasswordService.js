/**
 * ============================================================
 * COMPLEXITY SECURITY LAB — Password Service
 * Combinatorics, strength scoring, dynamic credential
 * generation, and simulated user database with real hashes.
 * ============================================================
 */

import { HashSimulator } from './HashSimulator.js';
import { CHARSETS, SIMULATED_USERS, RISK_LEVELS, COMPUTE_PRESETS, COMMON_PASSWORDS } from '../utils/constants.js';

export class PasswordService {

  /**
   * Initialize the simulated user database with real SHA-256 hashes.
   * Called once on app start.
   * @returns {Promise<Array>} Array of user objects with hashed passwords
   */
  static async initUserDatabase() {
    const users = await Promise.all(
      SIMULATED_USERS.map(async (user) => {
        const hash = await HashSimulator.sha256(user.password);
        const strength = this.scoreStrength(user.password);
        return {
          ...user,
          hash,
          strength,
          passwordVisible: false,
          lastLogin: this.generateRandomDate(),
          failedAttempts: Math.floor(Math.random() * 5),
          accountAge: Math.floor(Math.random() * 365) + 30
        };
      })
    );
    return users;
  }

  /**
   * Generate a random password based on the given options.
   * @param {Object} options
   * @param {number} options.length - Password length
   * @param {boolean} options.lowercase
   * @param {boolean} options.uppercase
   * @param {boolean} options.numbers
   * @param {boolean} options.symbols
   * @returns {string}
   */
  static generatePassword(options) {
    let charset = '';
    if (options.lowercase !== false) charset += CHARSETS.lowercase.chars;
    if (options.uppercase) charset += CHARSETS.uppercase.chars;
    if (options.numbers) charset += CHARSETS.numbers.chars;
    if (options.symbols) charset += CHARSETS.symbols.chars;
    
    if (charset.length === 0) charset = CHARSETS.lowercase.chars;
    
    let password = '';
    const array = new Uint32Array(options.length || 8);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < (options.length || 8); i++) {
      password += charset[array[i] % charset.length];
    }
    
    return password;
  }

  /**
   * Calculate the total number of combinations for a given charset and length.
   * Returns BigInt for precision with large numbers.
   * @param {number} length - Password length
   * @param {number} charsetSize - Size of the character set
   * @returns {bigint}
   */
  static calculateCombinations(length, charsetSize) {
    if (charsetSize === 0 || length === 0) return 0n;
    return BigInt(charsetSize) ** BigInt(length);
  }

  /**
   * Get the effective charset size based on enabled options.
   * @param {Object} options
   * @returns {number}
   */
  static getCharsetSize(options) {
    let size = 0;
    if (options.lowercase !== false) size += CHARSETS.lowercase.size;
    if (options.uppercase) size += CHARSETS.uppercase.size;
    if (options.numbers) size += CHARSETS.numbers.size;
    if (options.symbols) size += CHARSETS.symbols.size;
    return size || CHARSETS.lowercase.size;
  }

  /**
   * Estimate crack time in seconds for exhaustive search.
   * @param {bigint} combinations - Total search space
   * @param {number} speed - Passwords per second
   * @returns {number} Seconds (average case = half the space)
   */
  static estimateTime(combinations, speed) {
    if (speed === 0) return Infinity;
    const avgCombinations = combinations / 2n;
    // Convert to number (may lose precision for astronomical values)
    return Number(avgCombinations) / speed;
  }

  /**
   * Estimate times for all compute presets.
   * @param {bigint} combinations
   * @returns {Array<{ preset: string, label: string, icon: string, speed: number, time: number }>}
   */
  static estimateAllTimes(combinations) {
    return Object.entries(COMPUTE_PRESETS).map(([key, preset]) => ({
      preset: key,
      label: preset.label,
      icon: preset.icon,
      speed: preset.speed,
      description: preset.description,
      time: this.estimateTime(combinations, preset.speed)
    }));
  }

  /**
   * Score password strength on a 0-10 scale.
   * @param {string} password
   * @returns {{ score: number, label: string, color: string, bg: string, icon: string, details: string[] }}
   */
  static scoreStrength(password) {
    let score = 0;
    const details = [];

    // Length checks
    if (password.length >= 6)  { score += 1; details.push('Longitud ≥ 6'); }
    if (password.length >= 8)  { score += 1; details.push('Longitud ≥ 8'); }
    if (password.length >= 12) { score += 1; details.push('Longitud ≥ 12'); }
    if (password.length >= 16) { score += 1; details.push('Longitud ≥ 16'); }
    if (password.length >= 20) { score += 1; details.push('Longitud ≥ 20'); }

    // Character variety
    if (/[a-z]/.test(password)) { score += 0.5; details.push('Contiene minúsculas'); }
    if (/[A-Z]/.test(password)) { score += 1; details.push('Contiene mayúsculas'); }
    if (/[0-9]/.test(password)) { score += 1; details.push('Contiene números'); }
    if (/[^A-Za-z0-9]/.test(password)) { score += 1.5; details.push('Contiene símbolos'); }

    // Penalty for common passwords
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      score = Math.max(0, score - 5);
      details.push('⚠️ Contraseña en diccionario común');
    }

    // Penalty for sequential/repeated characters
    if (/(.)\1{2,}/.test(password)) {
      score = Math.max(0, score - 1);
      details.push('⚠️ Caracteres repetidos');
    }
    if (/(?:abc|bcd|cde|def|123|234|345|456|567|678|789|qwe|wer|ert)/i.test(password)) {
      score = Math.max(0, score - 1);
      details.push('⚠️ Secuencia detectable');
    }

    score = Math.min(10, Math.max(0, Math.round(score)));
    
    const level = RISK_LEVELS.find(r => score <= r.max) || RISK_LEVELS[RISK_LEVELS.length - 1];
    
    return {
      score,
      label: level.label,
      color: level.color,
      bg: level.bg,
      icon: level.icon,
      details
    };
  }

  /**
   * Determine the Big-O complexity class based on charset and password length.
   * @param {number} charsetSize
   * @param {number} length
   * @returns {{ notation: string, class: string, description: string }}
   */
  static getComplexityClass(charsetSize, length) {
    const combinations = Number(this.calculateCombinations(length, charsetSize));
    
    if (combinations <= 1000) {
      return {
        notation: 'O(n)',
        class: 'linear',
        description: 'Espacio trivial — búsqueda casi instantánea'
      };
    }
    if (combinations <= 1000000) {
      return {
        notation: 'O(n²)',
        class: 'quadratic',
        description: 'Espacio pequeño — vulnerable a ataques básicos'
      };
    }
    if (combinations <= 1e12) {
      return {
        notation: 'O(n³)',
        class: 'cubic',
        description: 'Espacio moderado — requiere recursos dedicados'
      };
    }
    return {
      notation: 'O(2ⁿ)',
      class: 'exponential',
      description: 'Espacio exponencial — computacionalmente inviable'
    };
  }

  /**
   * Generate a random date in the last 30 days.
   * @returns {string} ISO date string
   */
  static generateRandomDate() {
    const now = Date.now();
    const offset = Math.floor(Math.random() * 30 * 86400000);
    return new Date(now - offset).toISOString().split('T')[0];
  }

  /**
   * Verify a password against a stored hash using real SHA-256.
   * @param {string} password - Password attempt
   * @param {string} storedHash - Stored SHA-256 hash
   * @returns {Promise<boolean>}
   */
  static async verifyPassword(password, storedHash) {
    const hash = await HashSimulator.sha256(password);
    return hash === storedHash;
  }

  /**
   * Analyze a password and return a comprehensive security report.
   * @param {string} password
   * @returns {Promise<Object>}
   */
  static async analyzePassword(password) {
    const hash = await HashSimulator.sha256(password);
    const strength = this.scoreStrength(password);
    
    const options = {
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password)
    };
    
    const charsetSize = this.getCharsetSize(options);
    const combinations = this.calculateCombinations(password.length, charsetSize);
    const times = this.estimateAllTimes(combinations);
    const complexity = this.getComplexityClass(charsetSize, password.length);
    const isInDictionary = COMMON_PASSWORDS.includes(password.toLowerCase());
    
    return {
      password,
      hash,
      strength,
      charsetSize,
      combinations,
      times,
      complexity,
      isInDictionary,
      length: password.length,
      entropy: Math.log2(charsetSize) * password.length
    };
  }
}
