import React from 'react';
import CandlestickDisplay from './CandlestickDisplay';

const Dashboard = () => {
  return (
    <div className="flex-1 p-6 bg-gray-900 overflow-y-auto">
      <CandlestickDisplay />
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Asset List (Coming soon)</h3>
        {/* Placeholder for bids/asks list */}
        <div className="bg-gray-800 p-4 rounded text-sm text-gray-300">Live asset data will go here...</div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Connected Brokers (Coming soon)</h3>
        <div className="bg-gray-800 p-4 rounded text-sm text-gray-300">Broker list will show here...</div>
      </div>
    </div>
  );
};

export default Dashboard;

