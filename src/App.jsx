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
    } catch (err) {
      setStatus('Error');
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/logs`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      setLogs(['Error fetching logs']);
    }
  };

  const fetchBrokers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/brokers`);
      const data = await res.json();
      setBrokers(data.brokers || []);
    } catch (err) {
      setBrokers(['Error fetching brokers']);
    }
  };

  const startBot = async () => {
    try {
      await fetch(`${API_BASE_URL}/start-bot`, { method: 'POST' });
      fetchStatus();
    } catch (err) {
      alert('Error starting bot');
    }
  };

  return (
    <main className="p-6 space-y-6 text-white bg-black min-h-screen">
      <h1 className="text-2xl font-bold">AAMPAV Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="font-semibold">Bot Status</p>
            <p className="text-lg text-green-400">{status}</p>
            <Button onClick={startBot} className="mt-2">Start Bot</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="font-semibold">Daily Profit</p>
            <p className="text-lg">$0.00</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="font-semibold">Profit Signals</p>
            <ul className="text-sm list-disc ml-5 mt-1">
              <li>BTC/USD +2.1%</li>
              <li>ETH/USD +1.4%</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="font-semibold mb-2">Market Overview</p>
            <div className="space-y-1">
              <div className="flex justify-between"><span>BTC/USD</span><span>$62,000</span></div>
              <div className="flex justify-between"><span>ETH/USD</span><span>$3,100</span></div>
              <div className="flex justify-between"><span>SOL/USD</span><span>$145</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="font-semibold mb-2">Candlestick Chart</p>
            <div className="w-full h-40 bg-gray-800 rounded flex items-center justify-center text-gray-500">[Chart Placeholder]</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
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
        <CardContent className="p-4">
          <p className="font-semibold mb-2">Connected Brokers</p>
          <ul className="list-disc ml-5 text-sm text-gray-300">
            {brokers.map((broker, i) => <li key={i}>{broker}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="font-semibold mb-2">Bot Logs</p>
          <ul className="text-xs text-gray-400 max-h-40 overflow-y-auto">
            {logs.map((log, i) => <li key={i}>• {log}</li>)}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
