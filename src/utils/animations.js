/**
 * ============================================================
 * COMPLEXITY SECURITY LAB — Animation Helpers
 * Reusable animation utilities for typewriter, count-up,
 * progress bar, and intersection observer reveals.
 * ============================================================
 */

/**
 * Typewriter effect — reveals text character by character.
 * @param {HTMLElement} el - Target element
 * @param {string} text - Text to type
 * @param {number} [speed=40] - Milliseconds per character
 * @returns {Promise<void>} Resolves when animation completes
 */
export function typewriterEffect(el, text, speed = 40) {
  return new Promise(resolve => {
    el.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

/**
 * Animated count-up from 0 to target value.
 * @param {HTMLElement} el - Target element
 * @param {number} target - Final value
 * @param {number} [duration=2000] - Animation duration in ms
 * @param {Function} [formatter] - Optional formatting function
 * @returns {Promise<void>}
 */
export function countUpAnimation(el, target, duration = 2000, formatter = null) {
  return new Promise(resolve => {
    const start = performance.now();
    const format = formatter || (n => Math.floor(n).toLocaleString('es-MX'));
    
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      
      el.textContent = format(current);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = format(target);
        resolve();
      }
    }
    
    requestAnimationFrame(update);
  });
}

/**
 * Animate a progress bar to a target percentage.
 * @param {HTMLElement} fillEl - The .progress__fill element
 * @param {number} percent - Target percentage (0-100)
 * @param {number} [duration=1000] - Animation duration in ms
 * @returns {Promise<void>}
 */
export function progressBarAnimation(fillEl, percent, duration = 1000) {
  return new Promise(resolve => {
    fillEl.style.transition = `width ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`;
    fillEl.style.width = `${Math.min(percent, 100)}%`;
    setTimeout(resolve, duration);
  });
}

/**
 * Reveal elements on scroll using IntersectionObserver.
 * Adds 'is-visible' class when element enters viewport.
 * @param {string} selector - CSS selector for elements to observe
 * @param {Object} [options] - IntersectionObserver options
 */
export function setupScrollReveal(selector = '.reveal', options = {}) {
  const defaults = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: unobserve after reveal
        if (entry.target.dataset.once !== 'false') {
          observer.unobserve(entry.target);
        }
      }
    });
  }, { ...defaults, ...options });
  
  document.querySelectorAll(selector).forEach(el => observer.observe(el));
  
  return observer;
}

/**
 * Stagger animation delay for child elements.
 * @param {HTMLElement} parent - Parent container
 * @param {string} childSelector - CSS selector for children
 * @param {number} [staggerMs=80] - Delay between each child
 */
export function staggerChildren(parent, childSelector, staggerMs = 80) {
  const children = parent.querySelectorAll(childSelector);
  children.forEach((child, i) => {
    child.style.animationDelay = `${i * staggerMs}ms`;
  });
}

/**
 * Smooth number interpolation (LERP).
 * @param {number} start
 * @param {number} end
 * @param {number} t - Progress (0 to 1)
 * @returns {number}
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Ease-out cubic function.
 * @param {number} t - Progress (0 to 1)
 * @returns {number}
 */
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease-in-out cubic function.
 * @param {number} t - Progress (0 to 1)
 * @returns {number}
 */
export function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Wait for a specified duration.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Animate an element shaking (for error feedback).
 * @param {HTMLElement} el
 * @returns {Promise<void>}
 */
export function shakeAnimation(el) {
  return new Promise(resolve => {
    el.style.animation = 'none';
    el.offsetHeight; // Force reflow
    el.style.animation = 'shake 0.4s ease-in-out';
    el.addEventListener('animationend', () => {
      el.style.animation = '';
      resolve();
    }, { once: true });
  });
}

/**
 * Create a pulsing glow effect on an element.
 * @param {HTMLElement} el
 * @param {string} color - CSS color
 * @param {number} [duration=1000]
 */
export function pulseGlow(el, color, duration = 1000) {
  el.style.transition = `box-shadow ${duration}ms ease`;
  el.style.boxShadow = `0 0 30px ${color}, 0 0 60px ${color}`;
  setTimeout(() => {
    el.style.boxShadow = '';
  }, duration);
}

/**
 * Scroll smoothly to an element.
 * @param {HTMLElement|string} target - Element or selector
 * @param {number} [offset=80] - Offset from top in px
 */
export function scrollToElement(target, offset = 80) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
