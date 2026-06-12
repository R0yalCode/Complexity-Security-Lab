export class BankingPortal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
    this.attachEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="section__header">
        <span class="section__tag">Fase 1</span>
        <h2 class="section__title">Portal Bancario</h2>
        <p class="section__subtitle">Entorno simulado para demostrar los riesgos de una autenticación débil.</p>
      </div>
      
      <div class="banking-login" id="login-view">
        <div class="banking-login__branding">
          <div class="banking-login__logo">
            <div class="banking-login__logo-icon">🏦</div>
            <div class="banking-login__logo-text">Secure<span>Bank</span></div>
          </div>
          <h1 class="banking-login__tagline">Tu dinero, <br>ahora más <span class="highlight">seguro</span>.</h1>
          <p class="banking-login__description">Accede a tu banca digital con la confianza de que tus datos están protegidos por encriptación de grado militar.</p>
          <div class="banking-login__features">
            <div class="banking-login__feature">
              <span class="banking-login__feature-icon">✓</span> Protección contra fraudes 24/7
            </div>
            <div class="banking-login__feature">
              <span class="banking-login__feature-icon">✓</span> Cifrado extremo a extremo
            </div>
            <div class="banking-login__feature">
              <span class="banking-login__feature-icon">✓</span> Autenticación biométrica disponible
            </div>
          </div>
        </div>
        
        <div class="banking-login__form-wrapper">
          <div class="card banking-login__form">
            <h3>Iniciar Sesión</h3>
            <div class="input-group">
              <label class="input-group__label">Usuario</label>
              <div class="input-icon-wrapper">
                <span class="input-icon">👤</span>
                <input type="text" id="login-username" class="input-field" placeholder="ej. admin" autocomplete="off">
              </div>
            </div>
            <div class="input-group">
              <label class="input-group__label">Contraseña</label>
              <div class="input-icon-wrapper">
                <span class="input-icon">🔒</span>
                <input type="password" id="login-password" class="input-field" placeholder="••••••••">
              </div>
            </div>
            <div id="login-error" class="banking-login__error">
              <span>⚠️</span> Credenciales incorrectas
            </div>
            <button id="login-btn" class="btn btn--primary btn--full btn--lg btn--shimmer mt-4">
              Ingresar a mi cuenta
            </button>
            <div class="banking-login__hint">
              <strong>Simulación:</strong> Prueba con usuario <code>admin</code> y contraseña <code>admin123</code>
            </div>
          </div>
        </div>
      </div>

      <div class="banking-dashboard" id="dashboard-view">
        <div class="banking-dashboard__header">
          <div class="banking-dashboard__welcome">Hola, <span id="dash-name">Administrador</span> 👋</div>
          <div class="banking-dashboard__date" id="dash-date"></div>
        </div>
        
        <div class="banking-balance-grid">
          <div class="card banking-balance-card card--bordered-cyan">
            <div class="banking-balance-card__icon banking-balance-card__icon--primary">💰</div>
            <div class="banking-balance-card__label">Saldo Disponible</div>
            <div class="banking-balance-card__value">$142,500.00 MXN</div>
          </div>
          <div class="card banking-balance-card">
            <div class="banking-balance-card__icon banking-balance-card__icon--purple">📈</div>
            <div class="banking-balance-card__label">Inversiones</div>
            <div class="banking-balance-card__value">$85,000.00 MXN</div>
          </div>
          <div class="card banking-balance-card">
            <div class="banking-balance-card__icon banking-balance-card__icon--warning">💳</div>
            <div class="banking-balance-card__label">Deuda Tarjeta</div>
            <div class="banking-balance-card__value">$12,450.00 MXN</div>
          </div>
        </div>

        <div class="banking-dashboard__content">
          <div class="card">
            <h3 style="margin-bottom: 1rem; font-size: 1rem;">Movimientos Recientes</h3>
            <div class="table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th style="text-align:right;">Monto</th>
                  </tr>
                </thead>
                <tbody id="dash-transactions">
                  <!-- Llenado por JS -->
                </tbody>
              </table>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div class="banking-credit-card">
              <div class="banking-credit-card__top">
                <div class="banking-credit-card__chip"></div>
                <div class="banking-credit-card__brand">SECURE</div>
              </div>
              <div class="banking-credit-card__number">**** **** **** 4092</div>
              <div class="banking-credit-card__bottom">
                <div class="banking-credit-card__holder">
                  Titular
                  <strong id="dash-card-name">ADMINISTRADOR</strong>
                </div>
                <div class="banking-credit-card__expiry">
                  Vence
                  <strong>12/28</strong>
                </div>
              </div>
            </div>
            
            <button id="logout-btn" class="btn btn--ghost btn--full">Cerrar Sesión</button>
            
            <div class="banking-dashboard__disclaimer">
              <span>ℹ️</span>
              <div>En un escenario real, si alguien adivina tu contraseña (como en el laboratorio a continuación), tendría acceso total a estos fondos.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    const loginBtn = document.getElementById('login-btn');
    const userInp = document.getElementById('login-username');
    const passInp = document.getElementById('login-password');
    const errBox = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const handleLogin = async () => {
      const u = userInp.value.trim();
      const p = passInp.value;
      if (!u || !p) return;
      
      // Simular login (hardcoded admin / admin123 para la demo rapida)
      if (u === 'admin' && p === 'admin123') {
        errBox.classList.remove('visible');
        loginBtn.innerHTML = 'Autenticando...';
        loginBtn.disabled = true;
        
        setTimeout(() => {
          this.showDashboard('Administrador del Sistema');
          loginBtn.innerHTML = 'Ingresar a mi cuenta';
          loginBtn.disabled = false;
        }, 800);
      } else {
        errBox.classList.add('visible');
        // Shake animation
        const form = document.querySelector('.banking-login__form');
        form.style.animation = 'none';
        form.offsetHeight; 
        form.style.animation = 'shake 0.4s ease-in-out';
      }
    };

    loginBtn.addEventListener('click', handleLogin);
    passInp.addEventListener('keypress', (e) => { if(e.key === 'Enter') handleLogin() });

    logoutBtn.addEventListener('click', () => {
      document.getElementById('dashboard-view').classList.remove('active');
      document.getElementById('login-view').style.display = 'flex';
      userInp.value = '';
      passInp.value = '';
    });
  }

  showDashboard(name) {
    document.getElementById('login-view').style.display = 'none';
    const dash = document.getElementById('dashboard-view');
    dash.classList.add('active');
    
    document.getElementById('dash-name').textContent = name.split(' ')[0];
    document.getElementById('dash-card-name').textContent = name.toUpperCase();
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('dash-date').textContent = new Date().toLocaleDateString('es-MX', options);
    
    // Fill transactions
    const tbody = document.getElementById('dash-transactions');
    tbody.innerHTML = `
      <tr><td>Hoy</td><td>Depósito Nómina</td><td style="text-align:right; color:var(--accent-green)">+$42,000.00</td></tr>
      <tr><td>Ayer</td><td>Transferencia SPEI</td><td style="text-align:right; color:var(--text-primary)">-$15,000.00</td></tr>
      <tr><td>Hace 2 días</td><td>Compra Amazon MX</td><td style="text-align:right; color:var(--text-primary)">-$3,499.99</td></tr>
      <tr><td>Hace 3 días</td><td>Pago Tarjeta de Crédito</td><td style="text-align:right; color:var(--text-primary)">-$7,800.00</td></tr>
      <tr><td>Hace 5 días</td><td>Netflix Mensualidad</td><td style="text-align:right; color:var(--text-primary)">-$299.00</td></tr>
    `;
  }
}
