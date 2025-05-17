import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://aampav-backend.onrender.com';

export default function App() {
  const [status, setStatus] = useState('Disconnected');
  const [logs, setLogs] = useState([]);
  const [brokers, setBrokers] = useState([]);

  useEffect(() => {
    fetchStatus();
    fetchLogs();
    fetchBrokers();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/status`);
      const data = await res.json();
      setStatus(data.status || 'Unknown');
    } catch {
      setStatus('Error');
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/logs`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch {
      setLogs(['Error fetching logs']);
    }
  };

  const fetchBrokers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/brokers`);
      const data = await res.json();
      setBrokers(data.brokers || []);
    } catch {
      setBrokers(['Error fetching brokers']);
    }
  };

  const startBot = async () => {
    try {
      await fetch(`${API_BASE_URL}/start-bot`, { method: 'POST' });
      fetchStatus();
    } catch {
      alert('Error starting bot');
    }
  };

  const stopBot = async () => {
    try {
      await fetch(`${API_BASE_URL}/stop-bot`, { method: 'POST' });
      fetchStatus();
    } catch {
      alert('Error stopping bot');
    }
  };

  const depositFunds = async () => {
    alert('Deposit functionality not implemented yet.');
  };

  const collectPayments = async () => {
    alert('Collect payments functionality not implemented yet.');
  };

  return (
    <main className="max-w-7xl mx-auto p-4 space-y-6 text-gray-100 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">AAMPAV Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent>
            <p className="font-semibold text-lg mb-2">Bot Status</p>
            <p className={`text-xl font-mono mb-4 ${status === 'Running' ? 'text-green-400' : 'text-red-400'}`}>{status}</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={depositFunds} className="bg-blue-600 hover:bg-blue-700">Deposit</Button>
              <Button onClick={startBot} className="bg-green-600 hover:bg-green-700">Start Bot</Button>
              <Button onClick={stopBot} className="bg-red-600 hover:bg-red-700">Stop Bot</Button>
              <Button onClick={collectPayments} className="bg-yellow-600 hover:bg-yellow-700">Collect Payments</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold text-lg mb-2">Daily Profit</p>
            <p className="text-2xl">$0.00</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold text-lg mb-2">Profit Signals</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>BTC/USD +2.1%</li>
              <li>ETH/USD +1.4%</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <p className="font-semibold mb-2">Market Overview</p>
            <div className="space-y-1">
              <div className="flex justify-between"><span>BTC/USD</span><span>$62,000</span></div>
              <div className="flex justify-between"><span>ETH/USD</span><span>$3,100</span></div>
              <div className="flex justify-between"><span>SOL/USD</span><span>$145</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="font-semibold mb-2">Candlestick Chart</p>
            <div className="w-full h-40 bg-gray-800 rounded flex items-center justify-center text-gray-500">
              [Chart Placeholder]
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <p className="font-semibold mb-2">Asset List</p>
          <div className="grid grid-cols-4 font-semibold text-sm mb-1">
            <span>Asset</span>
            <span>Price</span>
            <span>Change</span>
            <span>Volume</span>
          </div>
          <div className="grid grid-cols-4 text-sm text-gray-300">
            <span>BTC/USD</span>
            <span>$62,000</span>
            <span>+2.1%</span>
            <span>$20B</span>
          </div>
          <div className="grid grid-cols-4 text-sm text-gray-300">
            <span>ETH/USD</span>
            <span>$3,100</span>
            <span>+1.4%</span>
            <span>$12B</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="font-semibold mb-2">Connected Brokers</p>
          <ul className="list-disc ml-5 text-sm text-gray-300">
            {brokers.map((broker, i) => <li key={i}>{broker}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <p className="font-semibold mb-2">Bot Logs</p>
          <ul className="text-xs text-gray-400 max-h-40 overflow-y-auto">
            {logs.map((log, i) => <li key={i} className="mb-1">• {log}</li>)}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
