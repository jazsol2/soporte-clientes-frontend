import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080'  // URL de tu Gateway
});

export default api;
