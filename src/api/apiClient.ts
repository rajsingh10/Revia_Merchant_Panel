import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://analytixdata.co.in/api/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  let token = localStorage.getItem('token');
  if (token) {
    // Remove quotes if they exist (common issue if stored via JSON.stringify)
    token = token.replace(/^"(.*)"$/, '$1');
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
