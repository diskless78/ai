import axios from 'axios';

/**
 * Create Axios instance with default configuration
 */
export const createHttpClient = () => {
  return axios.create({
    withCredentials: false,
    timeout: 20000,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    paramsSerializer: {
      indexes: null, // Serialize arrays without brackets: key=value1&key=value2
    },
  });
};

/**
 * HTTP configuration constants
 */
export const HTTP_CONFIG = {
  DEFAULT_TIMEOUT: 20000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
} as const;
