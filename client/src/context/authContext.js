import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const API = axios.create({
    baseURL: `${API_URL}/users`,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },(error) => {
        return Promise.reject(error);
    }
);
API.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response && error.response.status === 401){
            localStorage.removeItem('token');
            window.location.href="/login";
        }
        return Promise.reject(error);
    }
);

export default API;