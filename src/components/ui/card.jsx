import React from 'react';

export function Card({ children }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg shadow p-4">
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`text-white ${className}`}>
      {children}
    </div>
  );
}
