import { PasswordService } from '../services/PasswordService.js';
import { COMPUTE_PRESETS } from '../utils/constants.js';
import { formatNumber, humanizeTime } from '../utils/formatters.js';

export class SecurityAnalysis {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    // Render happens directly via HTML inside Visualizations or on its own.
    // Actually, I'll build it here and insert it before the Education/Blockchain section.
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="analysis-container">
        <div class="card analysis-input-section card--bordered-purple">
          <h3 style="font-size: 1.5rem; margin-bottom: 1rem">Analizador de Seguridad en Tiempo Real</h3>
          <p style="color: var(--text-secondary); margin-bottom: 2rem">Ingresa cualquier texto para observar cómo nuestro motor estima el esfuerzo computacional necesario para vulnerarlo.</p>
          
          <div class="analysis-input-wrapper">
            <input type="text" id="sa-input" class="input-field" placeholder="Ingresa una contraseña..." value="admin123">
          </div>
          
          <button id="sa-btn-analyze" class="btn btn--primary btn--lg analysis-btn btn--shimmer">
            Analizar Seguridad
          </button>
        </div>

        <div id="sa-results" class="analysis-results">
          <!-- Progreso -->
          <div class="card analysis-progress">
            <div class="analysis-progress__header">
              <div class="analysis-progress__status" id="sa-status-text">
                <span class="badge badge--cyan"><div class="badge__dot"></div> Calculando Entropía</span>
              </div>
              <div class="analysis-progress__percent" id="sa-percent">0%</div>
            </div>
            <div class="progress progress--lg">
              <div class="progress__fill progress__fill--cyan progress__fill--animated" id="sa-progress-bar" style="width: 0%"></div>
            </div>
            
            <div class="analysis-stats-row" id="sa-stats">
              <div class="analysis-stat">
                <div class="stat__label">Longitud</div>
                <div class="stat__value stat__value--mono" id="sa-stat-len">0</div>
              </div>
              <div class="analysis-stat">
                <div class="stat__label">Alfabeto</div>
                <div class="stat__value stat__value--mono" id="sa-stat-char">0</div>
              </div>
              <div class="analysis-stat">
                <div class="stat__label">Combinaciones</div>
                <div class="stat__value stat__value--mono" id="sa-stat-combos" style="font-size: 1.2rem">0</div>
              </div>
              <div class="analysis-stat">
                <div class="stat__label">Entropía</div>
                <div class="stat__value stat__value--mono" id="sa-stat-entropy">0 bits</div>
              </div>
            </div>
          </div>

          <!-- Escala de Tiempo -->
          <div class="card time-scale" id="sa-time-scale" style="display:none;">
            <h4 class="time-scale__title">Tiempo Estimado por Capacidad Computacional</h4>
            <div class="time-scale__items" id="sa-time-items">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- Veredicto -->
          <div class="card analysis-verdict" id="sa-verdict" style="display:none;">
            <div class="analysis-verdict__icon" id="sa-verdict-icon">🛡️</div>
            <h3 class="analysis-verdict__title" id="sa-verdict-title">Evaluando...</h3>
            <p class="analysis-verdict__description" id="sa-verdict-desc"></p>
          </div>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  attachEvents() {
    const btn = document.getElementById('sa-btn-analyze');
    const input = document.getElementById('sa-input');
    
    btn.addEventListener('click', () => this.runAnalysis(input.value));
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.runAnalysis(input.value);
    });
  }

  async runAnalysis(password) {
    if (!password) return;

    const btn = document.getElementById('sa-btn-analyze');
    const results = document.getElementById('sa-results');
    const timeScale = document.getElementById('sa-time-scale');
    const verdict = document.getElementById('sa-verdict');
    const progBar = document.getElementById('sa-progress-bar');
    const percent = document.getElementById('sa-percent');
    
    btn.disabled = true;
    results.classList.add('active');
    timeScale.style.display = 'none';
    verdict.style.display = 'none';
    progBar.style.width = '0%';
    percent.textContent = '0%';
    
    // Animate progress bar to simulate deep analysis
    await new Promise(resolve => {
      let p = 0;
      const interval = setInterval(() => {
        p += Math.random() * 15;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          resolve();
        }
        progBar.style.width = `${p}%`;
        percent.textContent = `${Math.floor(p)}%`;
      }, 100);
    });

    const report = await PasswordService.analyzePassword(password);
    
    // Fill stats
    document.getElementById('sa-stat-len').textContent = report.length;
    document.getElementById('sa-stat-char').textContent = report.charsetSize;
    
    let comboStr;
    try {
      comboStr = report.combinations > (10n ** 12n) ? report.combinations.toString().slice(0,4) + '...' : formatNumber(report.combinations);
    } catch(e) {
      comboStr = "Infinito";
    }
    document.getElementById('sa-stat-combos').textContent = comboStr;
    document.getElementById('sa-stat-entropy').textContent = `${Math.floor(report.entropy)} bits`;

    // Fill Time Scale
    timeScale.style.display = 'block';
    
    // Sort times from slowest to fastest
    const times = [...report.times];
    
    document.getElementById('sa-time-items').innerHTML = times.map((t, idx) => {
      // Calcular ancho de barra relativo. 
      // El mas rapido (quantum) toma 100%, los demas menos
      let width = 100 - (idx * 20); 
      let colorClass = 'progress__fill--cyan';
      if (t.time < 3600) colorClass = 'progress__fill--red';
      else if (t.time < 31536000) colorClass = 'progress__fill--amber';
      else colorClass = 'progress__fill--green';

      return `
        <div class="time-scale__item ${t.preset === 'server' ? 'active' : ''}">
          <div class="time-scale__item-icon">${t.icon}</div>
          <div class="time-scale__item-label">
            <strong>${t.label}</strong><br>
            <span style="font-size:0.7rem; color:var(--text-muted)">${t.description}</span>
          </div>
          <div class="time-scale__item-bar">
            <div class="time-scale__item-fill ${colorClass}" style="width: 0%" data-target="${width}%"></div>
          </div>
          <div class="time-scale__item-time">${humanizeTime(t.time)}</div>
        </div>
      `;
    }).join('');

    // Animate bars
    setTimeout(() => {
      document.querySelectorAll('.time-scale__item-fill').forEach(el => {
        el.style.width = el.getAttribute('data-target');
      });
    }, 100);

    // Fill Verdict
    verdict.style.display = 'block';
    const vIcon = document.getElementById('sa-verdict-icon');
    const vTitle = document.getElementById('sa-verdict-title');
    const vDesc = document.getElementById('sa-verdict-desc');
    
    verdict.className = 'card analysis-verdict'; // reset
    if (report.strength.score < 4 || report.isInDictionary) {
      vIcon.textContent = '🚨';
      vTitle.textContent = 'Contraseña Vulnerable';
      vTitle.style.color = 'var(--accent-red)';
      verdict.style.borderColor = 'rgba(255,71,87,0.3)';
      
      let reason = 'Su entropía es muy baja.';
      if (report.isInDictionary) reason = 'Se encuentra en diccionarios comunes de contraseñas filtradas.';
      
      vDesc.textContent = `Esta contraseña puede ser comprometida en ${humanizeTime(report.times[0].time)} utilizando hardware doméstico. ${reason}`;
    } else if (report.strength.score < 7) {
      vIcon.textContent = '⚠️';
      vTitle.textContent = 'Seguridad Moderada';
      vTitle.style.color = 'var(--accent-amber)';
      verdict.style.borderColor = 'rgba(255,165,2,0.3)';
      vDesc.textContent = `Resiste ataques básicos, pero un atacante con recursos dedicados (como una botnet) podría vulnerarla en ${humanizeTime(report.times[1].time)}.`;
    } else {
      vIcon.textContent = '🛡️';
      vTitle.textContent = 'Criptográficamente Segura';
      vTitle.style.color = 'var(--accent-green)';
      verdict.style.borderColor = 'rgba(0,255,136,0.3)';
      vDesc.textContent = `Excelente. Harían falta ${humanizeTime(report.times[2].time)} usando una supercomputadora para evaluar todas las combinaciones posibles en su espacio de búsqueda.`;
    }

    btn.disabled = false;
  }
}
