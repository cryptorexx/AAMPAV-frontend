import React from 'react';

const dummyData = [
  { symbol: 'AAPL', color: 'green', height: 70 },
  { symbol: 'TSLA', color: 'red', height: 40 },
  { symbol: 'BTC', color: 'green', height: 90 },
  { symbol: 'OIL', color: 'red', height: 30 },
];

const CandlestickDisplay = () => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Global Candlestick Snapshot</h3>
      <div className="flex gap-3 items-end h-32 bg-gray-800 p-4 rounded">
        {dummyData.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`w-6 rounded-sm ${item.color === 'green' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ height: `${item.height}px` }}
            ></div>
            <span className="text-xs mt-1 text-white">{item.symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandlestickDisplay;

