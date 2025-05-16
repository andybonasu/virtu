import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // ✅ Correct for browser use
});


export default instance;
