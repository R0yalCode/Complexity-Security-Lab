import { setupScrollReveal } from '../utils/animations.js';

export class Visualizations {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.charts = [];
    this.render();
  }

  async init() {
    // Wait a tick for DOM to be ready
    setTimeout(() => {
      this.initCharts();
      setupScrollReveal();
    }, 100);
  }

  render() {
    this.container.innerHTML = `
      <div class="section__header reveal">
        <span class="section__tag">Fase 4</span>
        <h2 class="section__title">Curvas de Crecimiento</h2>
        <p class="section__subtitle">Compara visualmente cómo crece el espacio de búsqueda según la complejidad del algoritmo.</p>
      </div>

      <div class="charts-grid reveal delay-1">
        <div class="card chart-card">
          <div class="chart-card__header">
            <div class="chart-card__title">Crecimiento Lineal</div>
            <div class="chart-card__notation chart-card__notation--linear">O(n)</div>
          </div>
          <div class="chart-card__canvas-wrapper">
            <canvas id="chart-linear"></canvas>
          </div>
          <div class="chart-card__description">
            El tiempo de búsqueda crece proporcionalmente a la longitud. Típico de búsquedas simples no criptográficas.
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-card__header">
            <div class="chart-card__title">Crecimiento Cuadrático</div>
            <div class="chart-card__notation chart-card__notation--quadratic">O(n²)</div>
          </div>
          <div class="chart-card__canvas-wrapper">
            <canvas id="chart-quadratic"></canvas>
          </div>
          <div class="chart-card__description">
            El tiempo crece al cuadrado. Aunque es más seguro, sigue siendo vulnerable a ataques masivos modernos.
          </div>
        </div>

        <div class="card chart-card">
          <div class="chart-card__header">
            <div class="chart-card__title">Crecimiento Exponencial</div>
            <div class="chart-card__notation chart-card__notation--exponential">O(2ⁿ)</div>
          </div>
          <div class="chart-card__canvas-wrapper">
            <canvas id="chart-exponential"></canvas>
          </div>
          <div class="chart-card__description">
            La base de la criptografía moderna. Añadir un solo carácter multiplica el espacio de búsqueda por el tamaño del alfabeto.
          </div>
        </div>
      </div>

      <div class="card chart-combined reveal delay-2">
        <div class="section__header" style="margin-bottom: 2rem;">
          <h3 style="font-size: 1.5rem">Comparativa Global</h3>
          <p class="text-muted" style="font-size: 0.9rem">Observa cómo la curva exponencial (roja) domina completamente a las demás a medida que n aumenta.</p>
        </div>
        <div class="chart-combined__canvas-wrapper">
          <canvas id="chart-combined"></canvas>
        </div>
      </div>
    `;
  }

  initCharts() {
    // Shared x-axis values
    const labels = Array.from({length: 15}, (_, i) => i + 1);
    
    // Data generation
    const dataLinear = labels.map(x => x * 10);
    const dataQuad = labels.map(x => Math.pow(x, 2));
    const dataExp = labels.map(x => Math.pow(2, x));

    // Common styling options
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(10, 14, 26, 0.9)',
          titleColor: '#fff',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
          ticks: { color: '#64748b' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
          ticks: { color: '#64748b', maxTicksLimit: 5 }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
      elements: {
        point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
      }
    };

    // 1. Linear Chart
    new Chart(document.getElementById('chart-linear').getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: dataLinear,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: commonOptions
    });

    // 2. Quadratic Chart
    new Chart(document.getElementById('chart-quadratic').getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: dataQuad,
          borderColor: '#ffa502',
          backgroundColor: 'rgba(255, 165, 2, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: commonOptions
    });

    // 3. Exponential Chart
    new Chart(document.getElementById('chart-exponential').getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: dataExp,
          borderColor: '#ff4757',
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: commonOptions
    });

    // 4. Combined Chart (Logarithmic Y-axis to show comparison clearly)
    new Chart(document.getElementById('chart-combined').getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'O(n) Lineal',
            data: dataLinear,
            borderColor: '#00d4ff',
            borderWidth: 2,
            tension: 0.4
          },
          {
            label: 'O(n²) Cuadrático',
            data: dataQuad,
            borderColor: '#ffa502',
            borderWidth: 2,
            tension: 0.4
          },
          {
            label: 'O(2ⁿ) Exponencial',
            data: dataExp,
            borderColor: '#ff4757',
            borderWidth: 2,
            tension: 0.4
          }
        ]
      },
      options: {
        ...commonOptions,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#94a3b8', usePointStyle: true, padding: 20 }
          },
          tooltip: commonOptions.plugins.tooltip
        },
        scales: {
          x: commonOptions.scales.x,
          y: {
            type: 'logarithmic',
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
            ticks: {
              color: '#64748b',
              callback: function(value) {
                if (value === 1 || value === 10 || value === 100 || value === 1000 || value === 10000) {
                  return value;
                }
                return '';
              }
            }
          }
        }
      }
    });
  }
}
