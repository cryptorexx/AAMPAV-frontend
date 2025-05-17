import axios from 'axios';

const API_BASE_URL = 'https://aampav-backend.onrender.com';

export const getStatus = () => axios.get(`${BASE_URL}/status`);
export const startBot = () => axios.post(`${BASE_URL}/start-bot`);
export const stopBot = () => axios.post(`${BASE_URL}/stop-bot`);
export const depositFunds = (amount) => axios.post(`${BASE_URL}/deposit`, { amount });
export const getWallets = () => axios.get(`${BASE_URL}/wallets`);
export const collectPayments = () => axios.post(`${BASE_URL}/pay?amount=0`); // placeholder

