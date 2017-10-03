import axios from 'axios';
import ENV from '../env';

let axiosInstance = axios.create({
  baseURL: ENV.apiUrl
});

export default axiosInstance;
