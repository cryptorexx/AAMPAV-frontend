const BASE = 'https://aampav-backend.onrender.com';
const API_KEY = 'gAAAAABmYfH2i2pm_YzTGR2x2D-nJjFYKABnp2oyd4v1-jh1aZB9wQkfzUxnzT-JVwnFS1qPEsCGBRO0xnPrpwQ_zEZ8tAdhHg==';

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

// Bot Controls
function startBot() {
    authorizedFetch(`${BASE}/start-bot`, { method: 'POST' })
        .then(updateStatus)
        .then(updateLogs);
}

function stopBot() {
    authorizedFetch(`${BASE}/stop-bot`, { method: 'POST' })
        .then(updateStatus)
        .then(updateLogs);
}

// Status & Logs
function updateStatus() {
    authorizedFetch(`${BASE}/status`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('bot-status').textContent = `Status: ${data.status || 'Unknown'}`;
        })
        .catch(() => {
            document.getElementById('bot-status').textContent = 'Status: Error';
        });
}

function updateLogs() {
    authorizedFetch(`${BASE}/logs`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('logs').textContent = (data.logs || []).join('\n');
        })
        .catch(() => {
            document.getElementById('logs').textContent = 'Error loading logs';
        });
}

// Brokers & Signals
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

// Profit + Wallet
function updateProfit() {
    authorizedFetch(`${BASE}/profit`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('daily-profit').textContent = `$${data.amount}`;
        })
        .catch(() => {
            document.getElementById('daily-profit').textContent = '$0.00';
        });
}

function updateWallet() {
    authorizedFetch(`${BASE}/wallet`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('wallet-address').textContent = data.address || 'Unavailable';
        })
        .catch(() => {
            document.getElementById('wallet-address').textContent = 'Error';
        });
}

// Candlestick Ticker Bar
function getCandleEmoji(c) {
    if (c.close > c.open) return '📈';
    if (c.close < c.open) return '📉';
    return '➖';
}

function renderCandlestickBar(candles) {
    const bar = document.getElementById('candlestick-bar');
    if (!bar || !candles || !candles.length) return;
    bar.textContent = candles.map(c => `${getCandleEmoji(c)} ${c.symbol}`).join(' ');
}

async function fetchCandlesticks() {
    try {
        const res = await fetch(`${BASE}/api/candlesticks`, { credentials: 'include' });
        const data = await res.json();
        renderCandlestickBar(data);
    } catch (err) {
        console.error("Candlestick fetch failed", err);
    }
}

// Chart Initialization
function initChart() {
    const chartEl = document.getElementById('chart');
    const chart = LightweightCharts.createChart(chartEl, {
        width: chartEl.clientWidth,
        height: 200,
        layout: { background: { color: '#222' }, textColor: '#DDD' },
        grid: { vertLines: { color: '#333' }, horzLines: { color: '#333' } },
        timeScale: { timeVisible: true, secondsVisible: false },
    });

    const series = chart.addCandlestickSeries({
        upColor: '#00ff99',
        downColor: '#ff5566',
        wickUpColor: '#00ff99',
        wickDownColor: '#ff5566',
        borderVisible: false,
    });

    fetch(`${BASE}/candles`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            series.setData(data);
        })
        .catch(err => {
            console.error('Chart fetch error:', err);
        });
}

// Demo / Real Mode
function updateModeDisplay() {
    fetch(`${BASE}/mode`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const modeLabel = document.getElementById('current-mode');
            const toggleBtn = document.getElementById('toggle-mode-btn');

            if (data.mode === 'DEMO') {
                modeLabel.textContent = 'DEMO';
                toggleBtn.textContent = 'Switch to LIVE';
                toggleBtn.style.background = 'grey';
            } else {
                modeLabel.textContent = 'LIVE';
                toggleBtn.textContent = 'Switch to DEMO';
                toggleBtn.style.background = 'dodgerblue';
            }
        });
}

function toggleMode() {
    const currentMode = document.getElementById('current-mode').textContent.toLowerCase();
    const newMode = currentMode === 'demo' ? 'live' : 'demo';

    fetch(`${BASE}/mode?mode=${newMode}`, {
        method: 'POST',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(updateModeDisplay)
    .catch(err => {
        console.error('Failed to toggle mode:', err);
    });
}

// AI WebSocket Output
function connectAnalysisWebSocket() {
    const output = document.getElementById('ai-output');
    const socket = new WebSocket("wss://aampav-backend.onrender.com/ws/analyze");

    socket.onopen = () => {
        output.textContent = "✅ Connected to Analysis AI...";
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        output.textContent = JSON.stringify(data.analysis, null, 2);
    };

    socket.onerror = () => {
        output.textContent = "❌ WebSocket error.";
    };

    socket.onclose = () => {
        output.textContent += "\n⚠️ Connection closed.";
    };
}

// Init
window.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateModeDisplay(); // Sets the initial mode and button text
    document.getElementById('toggle-mode-btn').addEventListener('click', toggleMode); // Attach listener to the correct button
    document.getElementById('startBot').addEventListener('click', startBot);
    document.getElementById('stopBot').addEventListener('click', stopBot);

    updateStatus();
    updateLogs();
    updateBrokers();
    updateSignals();
    updateMarket();
    updateProfit();
    updateWallet();
    fetchCandlesticks();
    connectAnalysisWebSocket();

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

// Payments
function deposit() {
    window.location.href = 'deposit.html';
}

function collect() {
    window.location.href = 'collect.html';
}
