import { BankingPortal } from './components/BankingPortal.js';
import { Laboratory } from './components/Laboratory.js';
import { Simulator } from './components/Simulator.js';
import { Visualizations } from './components/Visualizations.js';
import { SecurityAnalysis } from './components/SecurityAnalysis.js';
import { Blockchain } from './components/Blockchain.js';
import { setupScrollReveal } from './utils/animations.js';

class App {
  constructor() {
    this.components = {};
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Complexity Security Lab...');
    
    // 1. Initialize Components
    this.components.banking = new BankingPortal('banking-container');
    
    this.components.laboratory = new Laboratory('laboratory-container');
    await this.components.laboratory.init();
    
    this.components.simulator = new Simulator('simulator-container');
    
    this.components.visualizations = new Visualizations('visualizations-container');
    await this.components.visualizations.init();

    // Dynamically insert Security Analysis before Blockchain
    const saSection = document.createElement('section');
    saSection.id = 'security-analysis';
    saSection.className = 'section';
    saSection.innerHTML = '<div class="section__inner" id="security-analysis-container"></div>';
    document.getElementById('blockchain').parentNode.insertBefore(saSection, document.getElementById('blockchain'));
    
    this.components.securityAnalysis = new SecurityAnalysis('security-analysis-container');
    
    this.components.blockchain = new Blockchain('blockchain-container');
    await this.components.blockchain.init();

    // 2. Setup Navbar Scroll Spy
    this.setupScrollSpy();
    
    // 3. Setup global scroll reveal for basic animations
    setupScrollReveal('.reveal');

    console.log('✅ Aplicación iniciada correctamente.');
  }

  setupScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.navbar__link');

    // Add security analysis to nav if needed, or map it to visualizations
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          // Update active link
          navLinks.forEach(link => {
            link.classList.remove('active');
            // If security-analysis, highlight visualizations
            const targetId = id === 'security-analysis' ? 'visualizations' : id;
            if (link.getAttribute('href') === `#${targetId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  }
}

// Start app as soon as the DOM is usable. The page already places this module at
// the end of <body>, so the immediate path is the common case; the fallback keeps
// it working if the script is ever moved to <head>.
function startApp() {
  window.complexitySecurityLabApp = new App();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp, { once: true });
} else {
  startApp();
}
