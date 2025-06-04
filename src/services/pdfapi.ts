import axios from 'axios';

const pdfapi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Add auth token to requests if it exists
const token = localStorage.getItem('token');
if (token) {
  pdfapi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default pdfapi;