/**
 * ============================================================
 * COMPLEXITY SECURITY LAB — Hash Simulator
 * Uses the real Web Crypto API (SubtleCrypto) to compute
 * authentic SHA-256 hashes — no fake strings.
 * ============================================================
 */

export class HashSimulator {
  
  /**
   * Compute a real SHA-256 hash of the given input.
   * @param {string} input - Text to hash
   * @returns {Promise<string>} Hex-encoded SHA-256 digest
   */
  static async sha256(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Compute SHA-256 and return both hex and binary representations.
   * @param {string} input
   * @returns {Promise<{ hex: string, binary: string, bytes: Uint8Array }>}
   */
  static async sha256Full(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hashBuffer);
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const binary = Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join('');
    
    return { hex, binary, bytes };
  }

  /**
   * Format a hash for display with color-coded segments.
   * Returns HTML with spans wrapping each 8-char segment.
   * @param {string} hash - 64-char hex string
   * @returns {string} HTML string
   */
  static formatHashHTML(hash) {
    const colors = [
      'var(--accent-cyan)',
      'var(--accent-green)',
      'var(--accent-amber)',
      'var(--accent-purple)',
      'var(--accent-red)',
      'var(--accent-cyan)',
      'var(--accent-green)',
      'var(--accent-amber)'
    ];
    
    let html = '';
    for (let i = 0; i < hash.length; i += 8) {
      const segment = hash.slice(i, i + 8);
      const color = colors[Math.floor(i / 8) % colors.length];
      html += `<span style="color:${color}">${segment}</span>`;
    }
    return html;
  }

  /**
   * Demonstrate the avalanche effect: changing one bit of input
   * drastically changes the output hash.
   * @param {string} input - Original input
   * @returns {Promise<Array<{ input: string, hash: string, diffPercent: number }>>}
   */
  static async demonstrateAvalanche(input) {
    const original = await this.sha256Full(input);
    const results = [{ input, hash: original.hex, diffPercent: 0 }];
    
    // Create slight variations
    const variations = [
      input + ' ',           // Add space
      input.slice(0, -1),    // Remove last char
      input[0].toUpperCase() === input[0] 
        ? input[0].toLowerCase() + input.slice(1)
        : input[0].toUpperCase() + input.slice(1), // Toggle case of first char
    ];
    
    for (const variant of variations) {
      if (variant === input || variant.length === 0) continue;
      const varHash = await this.sha256Full(variant);
      
      // Calculate bit difference percentage
      let diffBits = 0;
      for (let i = 0; i < original.bytes.length; i++) {
        const xor = original.bytes[i] ^ varHash.bytes[i];
        // Count set bits (Hamming distance)
        let bits = xor;
        while (bits > 0) {
          diffBits += bits & 1;
          bits >>= 1;
        }
      }
      const diffPercent = (diffBits / 256) * 100;
      
      results.push({ input: variant, hash: varHash.hex, diffPercent });
    }
    
    return results;
  }

  /**
   * Simulate the mining process (finding a hash starting with N zeros).
   * For educational demonstration of proof-of-work.
   * @param {string} data - Block data
   * @param {number} difficulty - Number of leading zeros required
   * @param {Function} onProgress - Callback with { nonce, hash, found }
   * @returns {Promise<{ nonce: number, hash: string, attempts: number }>}
   */
  static async simulateMining(data, difficulty = 2, onProgress = null) {
    const target = '0'.repeat(difficulty);
    let nonce = 0;
    const maxAttempts = 100000;
    
    while (nonce < maxAttempts) {
      const input = `${data}:${nonce}`;
      const hash = await this.sha256(input);
      
      if (onProgress && nonce % 100 === 0) {
        onProgress({ nonce, hash, found: false });
        // Yield to event loop every 100 iterations
        await new Promise(r => setTimeout(r, 0));
      }
      
      if (hash.startsWith(target)) {
        if (onProgress) onProgress({ nonce, hash, found: true });
        return { nonce, hash, attempts: nonce + 1 };
      }
      
      nonce++;
    }
    
    return { nonce: -1, hash: '', attempts: maxAttempts };
  }
}
