const BASE = 'https://aampav-backend.onrender.com';

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
