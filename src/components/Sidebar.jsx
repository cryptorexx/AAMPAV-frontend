import React, { useEffect, useState } from 'react';
import { getStatus, startBot, stopBot, depositFunds, collectPayments } from '../services/api';

function Sidebar() {
  const [botStatus, setBotStatus] = useState('Unknown');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await getStatus();
        setBotStatus(res.data.status);
      } catch {
        setBotStatus('Disconnected');
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 bg-gray-800 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold text-green-400">AAMPAV</h2>
      <div className="text-sm">Bot Status: <span className={botStatus === 'running' ? 'text-green-400' : 'text-red-400'}>{botStatus}</span></div>
      <button onClick={startBot} className="bg-green-600 p-2 rounded">Start Bot</button>
      <button onClick={stopBot} className="bg-red-600 p-2 rounded">Stop Bot</button>
      <button onClick={() => depositFunds(1)} className="bg-blue-600 p-2 rounded">Deposit $1</button>
      <button onClick={collectPayments} className="bg-yellow-600 p-2 rounded">Collect</button>
    </div>
  );
}

export default Sidebar;

