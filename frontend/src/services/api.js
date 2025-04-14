import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const generateVisualization = (language, code) => {
    return axios.post(`${API_URL}/api/visualize`, {
        language,
        code
    });
};