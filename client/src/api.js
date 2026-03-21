import axios from 'axios';

// This automatically switches between localhost and your live server!
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

export default api;