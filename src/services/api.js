import axios from 'axios';

const API_BASE_URL = 'https://aampav-backend.onrender.com';

export const getStatus = () => axios.get(`${BASE_URL}/status`);
export const startBot = () => axios.post(`${BASE_URL}/start-bot`);
export const stopBot = () => axios.post(`${BASE_URL}/stop-bot`);
export const depositFunds = (amount) => axios.post(`${BASE_URL}/deposit`, { amount });
export const getWallets = () => axios.get(`${BASE_URL}/wallets`);
export const collectPayments = () => axios.post(`${BASE_URL}/pay?amount=0`); // placeholder

{
  "daily_profit": "112.56",
  "signals": 14,
  "total_volume": "98624.45",
  "assets": [
    { "name": "BTC", "price": "62543", "change": "+1.4", "volume": "15000" },
    ...
  ],
  "brokers": [
    { "name": "Binance", "status": "connected" },
    { "name": "FTX", "status": "disconnected" }
  ]
}
