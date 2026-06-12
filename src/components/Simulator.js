import { PasswordService } from '../services/PasswordService.js';
import { COMPUTE_PRESETS } from '../utils/constants.js';
import { formatNumber, humanizeTime } from '../utils/formatters.js';

export class Simulator {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    
    // Default state
    this.state = {
      length: 8,
      lowercase: true,
      uppercase: false,
      numbers: false,
      symbols: false,
      computePower: 'personal'
    };

    this.render();
    this.attachEvents();
    this.updateCalculations();
  }

  render() {
    this.container.innerHTML = `
      <div class="section__header">
        <span class="section__tag">Fase 3</span>
        <h2 class="section__title">Simulador de Complejidad</h2>
        <p class="section__subtitle">Ajusta los parámetros de la contraseña y la capacidad computacional para observar cómo afectan al espacio de búsqueda y los tiempos de quiebre.</p>
      </div>

      <div class="simulator-layout">
        <!-- Controls -->
        <div class="card simulator-controls card--bordered-cyan">
          <div class="simulator-controls__title">
            <span>⚙️</span> Parámetros
          </div>

          <div class="simulator-control-group">
            <div class="simulator-control-group__label">
              <span class="simulator-control-group__name">Longitud</span>
              <span class="simulator-control-group__value" id="sim-val-length">8</span>
            </div>
            <input type="range" id="sim-range-length" class="range-slider" min="4" max="32" value="8">
          </div>

          <div class="simulator-control-group">
            <div class="simulator-control-group__label">
              <span class="simulator-control-group__name">Juego de Caracteres</span>
            </div>
            <div class="simulator-toggles">
              <label class="toggle">
                <input type="checkbox" id="sim-chk-lower" checked disabled>
                <div class="toggle__track"><div class="toggle__thumb"></div></div>
                <span class="toggle__label">Minúsculas (a-z)</span>
              </label>
              <label class="toggle">
                <input type="checkbox" id="sim-chk-upper">
                <div class="toggle__track"><div class="toggle__thumb"></div></div>
                <span class="toggle__label">Mayúsculas (A-Z)</span>
              </label>
              <label class="toggle">
                <input type="checkbox" id="sim-chk-numbers">
                <div class="toggle__track"><div class="toggle__thumb"></div></div>
                <span class="toggle__label">Números (0-9)</span>
              </label>
              <label class="toggle">
                <input type="checkbox" id="sim-chk-symbols">
                <div class="toggle__track"><div class="toggle__thumb"></div></div>
                <span class="toggle__label">Símbolos (!@#...)</span>
              </label>
            </div>
          </div>

          <div class="simulator-control-group">
            <div class="simulator-control-group__label">
              <span class="simulator-control-group__name">Capacidad Computacional</span>
            </div>
            <div class="simulator-compute-select" id="sim-compute-options">
              <!-- Rendered via JS -->
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="simulator-results">
          
          <div class="card card--flat combinations-display">
            <div class="combinations-display__formula">
              <span class="highlight" id="sim-base">26</span><sup id="sim-exp">8</sup> = 
            </div>
            <div class="combinations-display__result" id="sim-combinations">208,827,064,576</div>
            <div class="combinations-display__label">Posibles combinaciones (Espacio de búsqueda)</div>
            
            <div style="margin-top: 1rem">
               <span class="complexity-badge" id="sim-complexity-badge">O(2ⁿ) Exponencial</span>
            </div>
          </div>

          <div class="card simulator-result-card">
            <div class="simulator-result-card__header">
              <div class="simulator-result-card__title"><span>⏱️</span> Tiempo Estimado (Ataque Exhaustivo)</div>
            </div>
            <div class="time-estimates-grid" id="sim-times-grid">
              <!-- Rendered via JS -->
            </div>
          </div>

          <div class="card simulator-result-card card--bordered-amber" id="sim-risk-card">
            <div class="risk-gauge">
              <div class="risk-gauge__label" id="sim-risk-label">Riesgo Alto</div>
              <div class="risk-gauge__meter">
                <div class="risk-gauge__meter-bg"></div>
                <div class="risk-gauge__meter-fill progress__fill--amber" id="sim-risk-fill" style="width: 20%"></div>
              </div>
              <div class="risk-gauge__description" id="sim-risk-desc">Vulnerable a ataques de diccionario y fuerza bruta en hardware estándar.</div>
            </div>
          </div>

        </div>
      </div>
    `;

    this.renderComputeOptions();
  }

  renderComputeOptions() {
    const container = document.getElementById('sim-compute-options');
    container.innerHTML = Object.entries(COMPUTE_PRESETS).map(([key, preset]) => `
      <label class="compute-option ${this.state.computePower === key ? 'active' : ''}">
        <input type="radio" name="compute" value="${key}" ${this.state.computePower === key ? 'checked' : ''}>
        <div class="compute-option__radio"></div>
        <div class="compute-option__icon">${preset.icon}</div>
        <div class="compute-option__info">
          <div class="compute-option__name">${preset.label}</div>
          <div class="compute-option__speed">${formatNumber(preset.speed)} hashes/s</div>
        </div>
      </label>
    `).join('');
  }

  attachEvents() {
    const rLength = document.getElementById('sim-range-length');
    const lLength = document.getElementById('sim-val-length');
    
    rLength.addEventListener('input', (e) => {
      lLength.textContent = e.target.value;
      this.state.length = parseInt(e.target.value);
      this.updateCalculations();
    });

    ['upper', 'numbers', 'symbols'].forEach(type => {
      document.getElementById(`sim-chk-${type}`).addEventListener('change', (e) => {
        this.state[type] = e.target.checked;
        this.updateCalculations();
      });
    });

    // Delegated event for compute options
    document.getElementById('sim-compute-options').addEventListener('change', (e) => {
      if (e.target.name === 'compute') {
        this.state.computePower = e.target.value;
        // Update active class
        document.querySelectorAll('.compute-option').forEach(el => el.classList.remove('active'));
        e.target.closest('.compute-option').classList.add('active');
        this.updateCalculations();
      }
    });
  }

  updateCalculations() {
    const charsetSize = PasswordService.getCharsetSize(this.state);
    const combinations = PasswordService.calculateCombinations(this.state.length, charsetSize);
    
    document.getElementById('sim-base').textContent = charsetSize;
    document.getElementById('sim-exp').textContent = this.state.length;
    
    // Si el numero es absurdamente grande, mostrar en notacion cientifica, pero mejor siempre intentamos con localeString
    let combosStr;
    try {
      combosStr = combinations > (10n ** 21n) ? combinations.toString() : formatNumber(combinations);
      if(combosStr.length > 25) {
        // Pseudo scientific
        const str = combinations.toString();
        combosStr = `${str[0]}.${str.slice(1,4)} × 10^${str.length - 1}`;
      }
    } catch(e) {
      combosStr = "Infinito";
    }
    
    document.getElementById('sim-combinations').textContent = combosStr;

    // Complexity class
    const compClass = PasswordService.getComplexityClass(charsetSize, this.state.length);
    const badge = document.getElementById('sim-complexity-badge');
    badge.textContent = `${compClass.notation} ${compClass.class === 'linear' ? 'Lineal' : compClass.class === 'quadratic' ? 'Polinomial' : 'Exponencial'}`;

    // Times
    const times = PasswordService.estimateAllTimes(combinations);
    const grid = document.getElementById('sim-times-grid');
    grid.innerHTML = times.map(t => `
      <div class="time-estimate-card ${t.preset === this.state.computePower ? 'active-preset' : ''}" style="${t.preset === this.state.computePower ? 'border-color: var(--accent-cyan); background: var(--accent-cyan-dim)' : ''}">
        <div class="time-estimate-card__icon">${t.icon}</div>
        <div class="time-estimate-card__label">${t.label}</div>
        <div class="time-estimate-card__time">${humanizeTime(t.time)}</div>
      </div>
    `).join('');

    this.updateRisk(times);
  }

  updateRisk(times) {
    const activeTime = times.find(t => t.preset === this.state.computePower).time;
    
    let riskLevel = 0; // 0 to 100
    let label = '';
    let colorClass = '';
    let desc = '';

    if (activeTime < 60) {
      riskLevel = 10; label = 'Crítico'; colorClass = 'progress__fill--red'; desc = 'Se vulnera casi instantáneamente.';
    } else if (activeTime < 3600*24) {
      riskLevel = 30; label = 'Alto'; colorClass = 'progress__fill--red'; desc = 'Vulnerable en cuestión de horas.';
    } else if (activeTime < 3600*24*365) {
      riskLevel = 50; label = 'Moderado'; colorClass = 'progress__fill--amber'; desc = 'Resiste ataques básicos, pero no hardware dedicado.';
    } else if (activeTime < 3600*24*365*100) {
      riskLevel = 70; label = 'Fuerte'; colorClass = 'progress__fill--green'; desc = 'Seguro a corto/mediano plazo.';
    } else {
      riskLevel = 95; label = 'Muy Seguro'; colorClass = 'progress__fill--cyan'; desc = 'Imposible de vulnerar con tecnología actual.';
    }

    const fill = document.getElementById('sim-risk-fill');
    fill.style.width = `${riskLevel}%`;
    fill.className = `risk-gauge__meter-fill ${colorClass}`;
    
    document.getElementById('sim-risk-label').textContent = label;
    document.getElementById('sim-risk-desc').textContent = desc;
  }
}
