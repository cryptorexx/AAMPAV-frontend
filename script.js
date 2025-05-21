const BASE = 'https://aampav-backend.onrender.com';

function updateStatus() {
  fetch(`${BASE}/status`)
    .then(res => res.json())
    .then(data => {
      document.querySelector('#status .value').textContent = data.status || 'Unknown';
    })
    .catch(() => {
      document.querySelector('#status .value').textContent = 'Error';
    });
}

function updateLogs() {
  fetch(`${BASE}/logs`)
    .then(res => res.json())
    .then(data => {
      document.querySelector('#logs pre').textContent = (data.logs || []).join('\n');
    })
    .catch(() => {
      document.querySelector('#logs pre').textContent = 'Error fetching logs.';
    });
}

function updateBrokers() {
  fetch(`${BASE}/brokers`)
    .then(res => res.json())
    .then(data => {
      const ul = document.querySelector('#brokers ul');
      ul.innerHTML = '';
      (data.brokers || []).forEach(b => {
        const li = document.createElement('li');
        li.textContent = b;
        ul.appendChild(li);
      });
    })
    .catch(() => {
      document.querySelector('#brokers ul').innerHTML = '<li>Error loading brokers</li>';
    });
}

function startBot() {
  fetch(`${BASE}/start-bot`, { method: 'POST' })
    .then(() => updateStatus());
}

function stopBot() {
  fetch(`${BASE}/stop-bot`, { method: 'POST' })
    .then(() => updateStatus());
}

// Auto refresh
updateStatus();
updateLogs();
updateBrokers();
setInterval(() => {
  updateStatus();
  updateLogs();
  updateBrokers();
}, 15000);
