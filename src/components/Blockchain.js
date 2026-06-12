import { HashSimulator } from '../services/HashSimulator.js';
import { setupScrollReveal } from '../utils/animations.js';
import { CRYPTO_CONSTANTS } from '../utils/constants.js';

export class Blockchain {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  async init() {
    this.attachEvents();
    // Pre-calculate initial hash for the demo
    const initialHash = await HashSimulator.sha256('Blockchain123');
    document.getElementById('edu-hash-output').innerHTML = HashSimulator.formatHashHTML(initialHash);
    
    setTimeout(() => {
      setupScrollReveal();
    }, 100);
  }

  render() {
    this.container.innerHTML = `
      <div class="section__header reveal">
        <span class="section__tag">Fase 5</span>
        <h2 class="section__title">Fundamentos Criptográficos y Blockchain</h2>
        <p class="section__subtitle">Descubre cómo la complejidad computacional que protege tus contraseñas es la misma que asegura redes como Bitcoin y sistemas de confianza digital.</p>
      </div>

      <!-- Education Concepts -->
      <div class="education-grid reveal delay-1" style="margin-bottom: var(--space-8);">
        <div class="card education-card card--bordered-cyan">
          <div class="education-card__icon education-card__icon--cyan">📈</div>
          <div class="education-card__title">Complejidad Temporal</div>
          <div class="education-card__text">
            Mide cómo aumenta el tiempo de ejecución de un algoritmo al incrementar el tamaño de la entrada. 
            En seguridad, buscamos problemas que sean "fáciles" de verificar (como comprobar una contraseña) 
            pero computacionalmente "inviables" de resolver mediante fuerza bruta (O(2ⁿ)).
          </div>
          <div class="bigo-diagram">
            <div class="bigo-row">
              <span class="bigo-row__notation text-cyan">O(1)</span>
              <div class="bigo-row__bar"><div class="bigo-row__bar-fill progress__fill--cyan" style="width: 5%"></div></div>
              <span class="bigo-row__label">Constante</span>
            </div>
            <div class="bigo-row">
              <span class="bigo-row__notation" style="color: var(--accent-green)">O(n)</span>
              <div class="bigo-row__bar"><div class="bigo-row__bar-fill progress__fill--green" style="width: 25%"></div></div>
              <span class="bigo-row__label">Lineal</span>
            </div>
            <div class="bigo-row">
              <span class="bigo-row__notation" style="color: var(--accent-red)">O(2ⁿ)</span>
              <div class="bigo-row__bar"><div class="bigo-row__bar-fill progress__fill--red" style="width: 95%"></div></div>
              <span class="bigo-row__label">Exponencial</span>
            </div>
          </div>
        </div>

        <div class="card education-card card--bordered-purple">
          <div class="education-card__icon education-card__icon--purple">🔍</div>
          <div class="education-card__title">Espacio de Búsqueda</div>
          <div class="education-card__text">
            Es el conjunto de todas las posibles combinaciones que un atacante debe evaluar. 
            La seguridad moderna no se basa en ocultar cómo funciona el algoritmo, sino en hacer 
            que este espacio sea tan inmensamente grande que ni todas las computadoras del mundo 
            juntas podrían explorarlo en millones de años.
          </div>
          <div class="search-space-grid" id="edu-search-grid">
            <!-- Rellenado por JS -->
          </div>
        </div>
      </div>

      <!-- Blockchain & Hash Demo -->
      <div class="blockchain-grid reveal delay-2">
        <div class="card blockchain-card card--bordered-green">
          <div class="blockchain-card__icon" style="background: var(--accent-green-dim); color: var(--accent-green)">#️⃣</div>
          <h3 class="blockchain-card__title">Funciones Hash (SHA-256)</h3>
          <p class="blockchain-card__text">
            Una función hash convierte cualquier entrada en una cadena de longitud fija. Un pequeño cambio en la entrada (incluso un espacio) 
            cambia completamente la salida (Efecto Avalancha). Son la base de las contraseñas y de Bitcoin.
          </p>
          
          <div class="hash-demo">
            <div class="hash-demo__input-row">
              <input type="text" class="input-field" id="edu-hash-input" value="Blockchain123">
            </div>
            <div class="hash-demo__arrow">⬇️</div>
            <div class="hash-demo__output" id="edu-hash-output"></div>
            <div style="font-size: 0.7rem; color: var(--text-muted); text-align: center; margin-top: 0.5rem">
              Prueba cambiar una letra o añadir un espacio
            </div>
          </div>
        </div>

        <div class="card blockchain-card card--bordered-amber">
          <div class="blockchain-card__icon" style="background: var(--accent-amber-dim); color: var(--accent-amber)">✍️</div>
          <h3 class="blockchain-card__title">Firmas Digitales</h3>
          <p class="blockchain-card__text">
            Utilizan criptografía asimétrica (claves públicas y privadas). La clave privada firma una transacción, 
            y la red entera puede verificar matemáticamente su validez usando la clave pública, sin conocer el secreto.
          </p>
          <div class="flow-diagram">
            <div class="flow-step">Mensaje + <br>Clave Privada</div>
            <div class="flow-arrow">➡️</div>
            <div class="flow-step" style="border-color: var(--accent-amber); color: var(--accent-amber)">Firma Digital</div>
            <div class="flow-arrow">➡️</div>
            <div class="flow-step">Verificación con <br>Clave Pública</div>
          </div>
        </div>
      </div>

      <!-- Bitcoin Key Space Comparison -->
      <div class="card bitcoin-comparison reveal delay-3">
        <div class="bitcoin-comparison__header">
          <h3 class="bitcoin-comparison__title">El Espacio Criptográfico de Bitcoin</h3>
          <p class="bitcoin-comparison__subtitle">Por qué Bitcoin no ha sido hackeado</p>
        </div>
        
        <div class="keyspace-visual">
          <div class="keyspace-visual__number">2²⁵⁶</div>
          <div class="keyspace-visual__label">Posibles claves privadas de Bitcoin (Casi igual al número de átomos en el universo observable)</div>
          
          <div class="keyspace-visual__bar">
            <div class="keyspace-visual__bar-password progress__fill--amber" style="width: 5%"></div>
          </div>
          <div class="keyspace-visual__bar-label">
            <span>Contraseña fuerte (12 chars)</span>
            <span>Clave Bitcoin (256 bits)</span>
          </div>
        </div>

        <div class="table-wrapper" style="margin-top: 2rem;">
          <table class="table comparison-table">
            <thead>
              <tr>
                <th>Sistema</th>
                <th>Algoritmo / Curva</th>
                <th>Espacio de Búsqueda</th>
                <th>Tiempo Estimado (Supercomputadora)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Contraseña (8 chars)</td>
                <td>Hash Básico</td>
                <td>~2 × 10¹²</td>
                <td style="color: var(--accent-red)">Minutos</td>
              </tr>
              <tr>
                <td>Contraseña Fuerte (16 chars)</td>
                <td>Bcrypt / Argon2</td>
                <td>~3 × 10²⁹</td>
                <td style="color: var(--accent-green)">Milenios</td>
              </tr>
              <tr>
                <td class="highlight-cell">Bitcoin (Clave Privada)</td>
                <td class="highlight-cell">${CRYPTO_CONSTANTS.ECDSA_CURVE}</td>
                <td class="highlight-cell">${CRYPTO_CONSTANTS.SHA256_SPACE}</td>
                <td class="highlight-cell" style="color: var(--accent-amber)">Eternidad (Imposible termodinámicamente)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="insight-box reveal delay-4">
        <div class="insight-box__icon">💡</div>
        <div class="insight-box__title">La Confianza Digital</div>
        <div class="insight-box__text">
          La seguridad de nuestros sistemas modernos (bancos, internet, criptomonedas) no reside en mantener 
          el funcionamiento de los algoritmos en secreto, sino en la <strong>asimetría computacional</strong>: 
          es muy barato y rápido encriptar o generar claves, pero físicamente imposible revertir el proceso 
          sin la información secreta.
        </div>
      </div>
    `;

    this.renderSearchGrid();
  }

  renderSearchGrid() {
    const grid = document.getElementById('edu-search-grid');
    if (!grid) return;
    
    // Create 64 small boxes
    for(let i=0; i<64; i++) {
      const cell = document.createElement('div');
      cell.className = 'search-space-cell';
      grid.appendChild(cell);
    }

    // Animate a simulated search periodically
    setInterval(() => {
      const cells = grid.querySelectorAll('.search-space-cell');
      cells.forEach(c => c.className = 'search-space-cell'); // reset
      
      const target = Math.floor(Math.random() * 64);
      let current = 0;
      
      const interval = setInterval(() => {
        if(current === target) {
          cells[current].classList.add('found');
          clearInterval(interval);
        } else {
          cells[current].classList.add('searched');
          current++;
        }
      }, 50);
      
    }, 5000);
  }

  attachEvents() {
    const input = document.getElementById('edu-hash-input');
    const output = document.getElementById('edu-hash-output');
    
    if (input && output) {
      input.addEventListener('input', async (e) => {
        const val = e.target.value;
        if (!val) {
          output.innerHTML = '';
          return;
        }
        // Real SHA256 calc
        const hash = await HashSimulator.sha256(val);
        output.innerHTML = HashSimulator.formatHashHTML(hash);
      });
    }
  }
}
