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

// --- Bot Controls ---
function startBot() {
    authorizedFetch(`${BASE}/start-bot`, { method: 'POST' })
        .then(updateStatus)
        .then(updateLogs)
        .catch(err => console.error("Start bot failed:", err));
}

function stopBot() {
    authorizedFetch(`${BASE}/stop-bot`, { method: 'POST' })
        .then(updateStatus)
        .then(updateLogs)
        .catch(err => console.error("Stop bot failed:", err));
}

// --- Status & Logs ---
function updateStatus() {
    return authorizedFetch(`${BASE}/status`)
        .then(res => res.json())
        .then(data => {
            const el = document.getElementById('bot-status');
            if (el) el.textContent = `Status: ${data.status || 'Unknown'}`;
        });
}

function updateLogs() {
    return authorizedFetch(`${BASE}/logs`)
        .then(res => res.json())
        .then(data => {
            const el = document.getElementById('logs');
            if (el) el.textContent = (data.logs || []).join('\n');
        });
}

// --- Brokers ---
function updateBrokers() {
    return authorizedFetch(`${BASE}/brokers`)
        .then(res => res.json())
        .then(data => {
            const ul = document.getElementById('brokers');
            if (!ul) return;
            ul.innerHTML = '';
            (data.brokers || []).forEach(b => {
                const li = document.createElement('li');
                li.textContent = b;
                ul.appendChild(li);
            });
        });
}

// --- Signals (now from backend instead of dummy data) ---
function updateSignals() {
    return authorizedFetch(`${BASE}/signals`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById('signals');
            if (!list) return;
            list.innerHTML = '';
            (data.signals || []).forEach(sig => {
                const li = document.createElement('li');
                li.textContent = sig;
                list.appendChild(li);
            });
        })
        .catch(err => console.error("Signals fetch failed:", err));
}

// --- Market Data (backend driven) ---
function updateMarket() {
    return authorizedFetch(`${BASE}/market`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.querySelector('#market-table tbody');
            if (!tbody) return;
            tbody.innerHTML = '';
            (data.market || []).forEach(row => {
                const tr = document.createElement('tr');
                row.forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        })
        .catch(err => console.error("Market fetch failed:", err));
}

// --- Profit + Wallet ---
function updateProfit() {
    return authorizedFetch(`${BASE}/profit`)
        .then(res => res.json())
        .then(data => {
            const el = document.getElementById('daily-profit');
            if (el) el.textContent = `$${data.amount || 0}`;
        });
}

function updateWallet() {
    return authorizedFetch(`${BASE}/wallet`)
        .then(res => res.json())
        .then(data => {
            const el = document.getElementById('wallet-address');
            if (el) el.textContent = data.address || 'Unavailable';
        });
}

// --- Candlestick Bar ---
function getCandleEmoji(c) {
    if (c.close > c.open) return '📈';
    if (c.close < c.open) return '📉';
    return '➖';
}

function renderCandlestickBar(candles) {
    const bar = document.getElementById('candlestick-bar');
    if (!bar) return;
    bar.textContent = candles.map(c => `${getCandleEmoji(c)} ${c.symbol}`).join(' ');
}

function fetchCandlesticks() {
    return authorizedFetch(`${BASE}/candlesticks`)
        .then(res => res.json())
        .then(data => renderCandlestickBar(data))
        .catch(err => console.error("Candlestick fetch failed", err));
}

// --- Chart ---
function initChart() {
    const chartEl = document.getElementById('chart');
    if (!chartEl) return;

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

    authorizedFetch(`${BASE}/candles`)
        .then(res => res.json())
        .then(data => series.setData(data))
        .catch(err => console.error('Chart fetch error:', err));
}

// --- Mode Switch ---
function updateModeDisplay() {
    return authorizedFetch(`${BASE}/mode`)
        .then(res => res.json())
        .then(data => {
            const modeLabel = document.getElementById('current-mode');
            const toggleBtn = document.getElementById('toggle-mode-btn');
            if (!modeLabel || !toggleBtn) return;

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

    authorizedFetch(`${BASE}/mode?mode=${newMode}`, { method: 'POST' })
        .then(res => res.json())
        .then(updateModeDisplay)
        .catch(err => console.error('Failed to toggle mode:', err));
}

// --- WebSocket ---
function connectAnalysisWebSocket() {
    const output = document.getElementById('ai-output');
    if (!output) return;
    const socket = new WebSocket("wss://aampav-backend.onrender.com/ws/analyze");

    socket.onopen = () => (output.textContent = "✅ Connected to Analysis AI...");
    socket.onmessage = e => {
        try {
            const data = JSON.parse(e.data);
            output.textContent = JSON.stringify(data.analysis, null, 2);
        } catch {
            output.textContent = e.data;
        }
    };
    socket.onerror = () => (output.textContent = "❌ WebSocket error.");
    socket.onclose = () => (output.textContent += "\n⚠️ Connection closed.");
}

// --- Payments ---
function deposit() { window.location.href = 'deposit.html'; }
function collect() { window.location.href = 'collect.html'; }

// --- Init ---
window.addEventListener('DOMContentLoaded', () => {
    // Ensure all IDs exist before attaching
    const safeBind = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', fn);
    };

    safeBind('toggle-mode-btn', toggleMode);
    safeBind('startBot', startBot);
    safeBind('stopBot', stopBot);
    safeBind('depositBtn', deposit);
    safeBind('collectBtn', collect);

    initChart();
    updateModeDisplay();
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
