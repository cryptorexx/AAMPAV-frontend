const BASE = 'https://aampav-backend.onrender.com';

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

  fetch(`${API_BASE}/candles`)
    .then(res => res.json())
    .then(candles => {
      candleSeries.setData(candles);
    })
    .catch(err => {
      console.error('Chart fetch failed:', err);
    });
}

function updateStatus() {
  fetch(`${BASE}/status`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('bot-status').textContent = `Status: ${data.status || 'Unknown'}`;
    })
    .catch(() => {
      document.getElementById('bot-status').textContent = 'Status: Error';
    });
}

function updateLogs() {
  fetch(`${BASE}/logs`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('logs').textContent = (data.logs || []).join('\n');
    })
    .catch(() => {
      document.getElementById('logs').textContent = 'Error loading logs';
    });
}

function updateBrokers() {
  fetch(`${BASE}/brokers`)
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
  // Static for now, wire to real backend later
  document.getElementById('daily-profit').textContent = '$172.34';
}

// Button actions
function startBot() {
  fetch(`${BASE}/start-bot`, { method: 'POST' }).then(updateStatus);
}

function stopBot() {
  fetch(`${BASE}/stop-bot`, { method: 'POST' }).then(updateStatus);
}

function deposit() {
  alert('Deposit functionality not implemented.');
}

function collect() {
  alert('Collect payments functionality not implemented.');
}

function getCandleEmoji(candle) {
    if (candle.close > candle.open) return '📈';  // green candle
    if (candle.close < candle.open) return '📉';  // red candle
    return '➖'; // neutral
}

function getCandleEmoji(candle) {
    if (candle.close > candle.open) return '📈';
    if (candle.close < candle.open) return '📉';
    return '➖';
}

function renderCandlestickBar(candles) {
    const bar = document.getElementById('candlestick-bar');
    let symbols = candles.map(c => `${getCandleEmoji(c)} ${c.symbol}`).join(' ');
    bar.textContent = symbols;
}

setInterval(fetchCandlesticks, 5000); // update every 5 seconds
fetchCandlesticks(); // initial load

// Init
updateStatus();
updateLogs();
updateBrokers();
updateSignals();
updateMarket();
updateProfit();

setInterval(() => {
  updateStatus();
  updateLogs();
  updateBrokers();
  updateSignals();
  updateMarket();
  updateProfit();
}, 15000);

initChart();
