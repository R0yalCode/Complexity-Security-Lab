import { SIMULATED_USERS, CHARSETS } from '../utils/constants.js';
import { PasswordService } from '../services/PasswordService.js';
import { SimulationEngine } from '../services/SimulationEngine.js';
import { formatNumber, humanizeTime } from '../utils/formatters.js';

export class Laboratory {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.engine = null;
    this.currentUser = null;
    this.render();
  }

  async init() {
    // Generate real hashes for mock users
    this.users = await PasswordService.initUserDatabase();
    this.currentUser = this.users[0]; // admin
    this.populateUsers();
    this.updateServerPanel();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="section__header">
        <span class="section__tag">Fase 2</span>
        <h2 class="section__title">Centro de Operaciones (SOC)</h2>
        <p class="section__subtitle">Observa cómo un atacante intentaría vulnerar las credenciales almacenadas en el servidor utilizando fuerza bruta computacional.</p>
      </div>

      <div class="lab-panels">
        <!-- SERVER PANEL -->
        <div class="card lab-panel">
          <div class="lab-panel__header">
            <div class="lab-panel__title">
              <span class="lab-panel__title-icon">🗄️</span>
              Servidor de Base de Datos
            </div>
            <div class="badge badge--green"><div class="badge__dot"></div>En línea</div>
          </div>
          
          <div class="server-user-select">
            <label>Seleccionar Usuario a Analizar</label>
            <select id="lab-user-select"></select>
          </div>
          
          <div class="server-user-info" id="lab-server-info">
            <!-- Rellenado por JS -->
          </div>
        </div>

        <!-- ANALYZER PANEL -->
        <div class="card lab-panel">
          <div class="lab-panel__header">
            <div class="lab-panel__title">
              <span class="lab-panel__title-icon">🎯</span>
              Analizador de Búsqueda
            </div>
            <div class="badge badge--amber" id="lab-status-badge">Esperando...</div>
          </div>
          
          <div class="analyzer-stats">
            <div class="card analyzer-stat-card card--flat">
              <div class="stat">
                <span class="stat__label">Intentos</span>
                <span class="stat__value" id="lab-stat-attempts">0</span>
              </div>
            </div>
            <div class="card analyzer-stat-card card--flat">
              <div class="stat">
                <span class="stat__label">Velocidad</span>
                <span class="stat__value" id="lab-stat-speed">0 /s</span>
              </div>
            </div>
          </div>
          
          <div class="analyzer-controls">
            <button class="btn btn--primary" id="lab-btn-start">▶ Iniciar Ataque</button>
            <button class="btn btn--ghost" id="lab-btn-stop" disabled>⏹ Detener</button>
          </div>
          
          <div class="analyzer-log">
            <div class="analyzer-log__header">
              <span class="analyzer-log__header-title">Registro de Intentos</span>
              <span class="analyzer-log__header-title" id="lab-log-phase">Fase 1: Diccionario</span>
            </div>
            <div class="analyzer-log__body" id="lab-log-body">
              <!-- Logs van aqui -->
              <div style="color:var(--text-muted); text-align:center; padding-top: 2rem;">Presiona Iniciar para comenzar simulación</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card soc-events">
        <div class="soc-events__title">📡 Eventos de Seguridad</div>
        <div id="lab-events-body">
          <div class="soc-event soc-event--info">
            <span class="soc-event__time">--:--:--</span>
            <span class="soc-event__message">Sistema de monitoreo SOC inicializado. Esperando comandos.</span>
          </div>
        </div>
      </div>
    `;
  }

  populateUsers() {
    const select = document.getElementById('lab-user-select');
    select.innerHTML = '';
    this.users.forEach((u, i) => {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${u.username} (${u.role})`;
      select.appendChild(option);
    });
  }

  updateServerPanel() {
    const u = this.currentUser;
    const infoContainer = document.getElementById('lab-server-info');
    
    infoContainer.innerHTML = `
      <div class="server-info-row">
        <div class="server-info-row__label">Usuario</div>
        <div class="server-info-row__value">${u.username}</div>
      </div>
      <div class="server-info-row server-info-row--cyan">
        <div class="server-info-row__label">Hash (SHA-256)</div>
        <div class="server-info-row__value server-info-row__value--hash" style="color:var(--accent-cyan)">${u.hash}</div>
      </div>
      
      <div class="server-strength-meter">
        <div class="server-strength-meter__label">
          <span class="server-strength-meter__text">Evaluación del Sistema</span>
          <span class="badge" style="background:${u.strength.bg}; color:${u.strength.color}; border-color:${u.strength.color}">
            ${u.strength.icon} ${u.strength.label}
          </span>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const select = document.getElementById('lab-user-select');
    select.addEventListener('change', (e) => {
      this.currentUser = this.users[e.target.value];
      this.updateServerPanel();
      if(this.engine && this.engine.running) {
        this.stopAttack();
      }
      this.clearLogs();
    });

    document.getElementById('lab-btn-start').addEventListener('click', () => this.startAttack());
    document.getElementById('lab-btn-stop').addEventListener('click', () => this.stopAttack());
  }

  clearLogs() {
    document.getElementById('lab-log-body').innerHTML = '<div style="color:var(--text-muted); text-align:center; padding-top: 2rem;">Presiona Iniciar para comenzar simulación</div>';
    document.getElementById('lab-stat-attempts').textContent = '0';
    document.getElementById('lab-stat-speed').textContent = '0 /s';
    const badge = document.getElementById('lab-status-badge');
    badge.className = 'badge badge--amber';
    badge.innerHTML = 'Esperando...';
  }

  startAttack() {
    if (this.engine && this.engine.running) return;

    const u = this.currentUser;
    
    // Config simulación 
    const isWeak = u.strength.score <= 3;
    const speed = isWeak ? 50 : 1000; // si es muy debil, lento para q se vea, sino mas rapido visualmente

    this.engine = new SimulationEngine({
      targetPassword: u.password,
      targetHash: u.hash,
      charsetSize: 26, // Asumiendo minúsculas por defecto para demo rapida, la logica completa lo deduce
      speed: speed, 
      useDictionary: true,
      charsetOptions: { lowercase: true, uppercase: true, numbers: true }
    });

    this.engine.onTick((state) => this.updateUI(state));
    this.engine.onComplete((res) => this.onComplete(res));

    document.getElementById('lab-btn-start').disabled = true;
    document.getElementById('lab-btn-stop').disabled = false;
    
    const badge = document.getElementById('lab-status-badge');
    badge.className = 'badge badge--red';
    badge.innerHTML = '<div class="badge__dot"></div>Atacando';
    
    document.getElementById('lab-log-body').innerHTML = '';

    this.engine.start();
  }

  stopAttack() {
    if (this.engine) {
      this.engine.stop();
    }
  }

  updateUI(state) {
    document.getElementById('lab-stat-attempts').textContent = formatNumber(state.attempts);
    document.getElementById('lab-stat-speed').textContent = `${formatNumber(Math.floor(state.speed))} /s`;
    document.getElementById('lab-log-phase').textContent = state.phase === 'dictionary' ? 'Fase 1: Diccionario' : 'Fase 2: Fuerza Bruta';
    
    // Update attempt log
    if (state.recentAttempts.length > 0) {
      const logBody = document.getElementById('lab-log-body');
      logBody.innerHTML = state.recentAttempts.slice(-15).reverse().map(a => `
        <div class="analyzer-log__entry ${a.match ? 'analyzer-log__entry--match' : ''}">
          <span class="analyzer-log__entry-num">#${a.attempt}</span>
          <span class="analyzer-log__entry-word">${a.word}</span>
          <span class="analyzer-log__entry-result">${a.match ? '✅' : '❌'}</span>
        </div>
      `).join('');
    }

    // Update event log
    if (state.eventLog.length > 0) {
      const eventsBody = document.getElementById('lab-events-body');
      eventsBody.innerHTML = state.eventLog.slice(-5).reverse().map(e => `
        <div class="soc-event soc-event--${e.type}">
          <span class="soc-event__time">${e.time.split('T')[1].slice(0,8)}</span>
          <span class="soc-event__message">${e.message}</span>
        </div>
      `).join('');
    }
  }

  onComplete(res) {
    document.getElementById('lab-btn-start').disabled = false;
    document.getElementById('lab-btn-stop').disabled = true;
    
    const badge = document.getElementById('lab-status-badge');
    
    if (res.found) {
      badge.className = 'badge badge--cyan';
      badge.innerHTML = 'Completado';
    } else {
      badge.className = 'badge badge--amber';
      badge.innerHTML = 'Detenido';
    }
    
    // Forzar ultimo render para q se vea el match verde
    this.updateUI(this.engine.getState());
  }
}
