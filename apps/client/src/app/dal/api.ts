import axios from 'axios';

const DEV_URL = 'http://localhost:3000/api';
const PROD_URL = '/api';

export const api = axios.create({
  baseURL: window.location.host.includes('localhost') ? DEV_URL : PROD_URL,
});
