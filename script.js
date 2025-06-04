const BASE = 'https://aampav-backend.onrender.com';
const API_KEY = 'your_default_key'; // Must match your backend env value

function authorizedFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...(options.headers || {})
    }
  });
}

function initChart() {
  const chartEl = document.getElementById('chart');
  const chart = LightweightCharts.createChart(chartEl, {
    width: chartEl.clientWidth,
    height: 200,
    layout: {
      background: { color: '#222' },
      textColor: '#DDD',
    },
    grid: {
      vertLines: { color: '#333' },
      horzLines: { color: '#333' },
    },
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
    },
  });

  const candleSeries = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
  });

  fetch(`${BASE}/candles`, { credentials: 'include' })
    .then(res => res.json())
    .then(candles => {
      candleSeries.setData(candles);
    })
    .catch(err => {
      console.error('Chart fetch failed:', err);
    });
}

function updateStatus() {
  authorizedFetch(`${BASE}/status`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('bot-status').textContent = `Status: ${data.status || 'Unknown'}`;
    })
    .catch(() => {
      document.getElementById('bot-status').textContent = 'Status: Error';
    });
}

function updateLogs() {
  authorizedFetch(`${BASE}/logs`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('logs').textContent = (data.logs || []).join('\n');
    })
    .catch(() => {
      document.getElementById('logs').textContent = 'Error loading logs';
    });
}

function updateBrokers() {
  fetch(`${BASE}/brokers`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      const ul = document.getElementById('brokers');
      ul.innerHTML = '';
      (data.brokers || []).forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
    })
    .catch(() => {
      document.getElementById('brokers').innerHTML = '<li>Error loading brokers</li>';
    });
}

function updateSignals() {
  const signals = [
    'BTC/USD +2.1%',
    'ETH/USD +1.4%',
    'XRP/USD +0.7%',
  ];
  const list = document.getElementById('signals');
  list.innerHTML = '';
  signals.forEach(sig => {
    const li = document.createElement('li');
    li.textContent = sig;
    list.appendChild(li);
  });
}

function updateMarket() {
  const market = [
    ['BTC/USD', '$62,000', '+2.1%', '$20B'],
    ['ETH/USD', '$3,100', '+1.4%', '$12B'],
    ['SOL/USD', '$145', '+0.9%', '$3B'],
  ];
  const tbody = document.querySelector('#market-table tbody');
  tbody.innerHTML = '';
  market.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function updateProfit() {
  authorizedFetch(`${BASE}/profit`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('daily-profit').textContent = `$${data.amount}`;
    })
    .catch(() => {
      document.getElementById('daily-profit').textContent = '$0.00';
    });
}

// Button actions
function startBot() {
  authorizedFetch(`${BASE}/start-bot`, { method: 'POST' })
    .then(updateStatus);
}

function stopBot() {
  authorizedFetch(`${BASE}/stop-bot`, { method: 'POST' })
    .then(updateStatus);
}

function deposit() {
  window.location.href = 'deposit.html';
}

function collect() {
  window.location.href = 'collect.html';
}

function updateWallet() {
  authorizedFetch(`${BASE}/wallet`, { method: 'GET' })
    .then(res => res.json())
    .then(data => {
      document.getElementById('wallet-address').textContent = data.address || 'Unavailable';
    })
    .catch(() => {
      document.getElementById('wallet-address').textContent = 'Error';
    });
}

// 📊 Real candlestick symbol rendering
function getCandleEmoji(candle) {
  if (candle.close > candle.open) return '📈';
  if (candle.close < candle.open) return '📉';
  return '➖';
}

function renderCandlestickBar(candles) {
  const bar = document.getElementById('candlestick-bar');
  if (!bar || !candles || candles.length === 0) return;
  const symbols = candles.map(c => `${getCandleEmoji(c)} ${c.symbol}`).join(' ');
  bar.textContent = symbols;
}

async function fetchCandlesticks() {
  try {
    const res = await fetch(`${BASE}/api/candlesticks`, { credentials: 'include' });
    const data = await res.json();
    renderCandlestickBar(data);
  } catch (err) {
    console.error("Failed to fetch candlesticks", err);
  }
}

function updateModeDisplay() {
  fetch(`${BASE}/mode`, { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      const btn = document.getElementById('mode-switch');
      const label = document.getElementById('mode-label');
      if (data.mode === 'DEMO') {
        label.textContent = 'DEMO';
        btn.style.background = 'grey';
      } else {
        label.textContent = 'REAL';
        btn.style.background = 'dodgerblue';
      }
    });
}

function toggleMode() {
  const current = document.getElementById('mode-label').textContent;
  const newMode = current === 'DEMO' ? 'live' : 'demo';
  fetch(`${BASE}/mode?mode=${newMode}`, {
    method: 'POST',
    credentials: 'include'
  }).then(updateModeDisplay);
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  initChart();
  updateModeDisplay();
  updateStatus();
  updateLogs();
  updateBrokers();
  updateSignals();
  updateMarket();
  updateProfit();
  fetchCandlesticks();
  updateWallet();

  setInterval(() => {
    updateStatus();
    updateLogs();
    updateBrokers();
    updateSignals();
    updateMarket();
    updateProfit();
  }, 15000);

  setInterval(fetchCandlesticks, 5000);
});
