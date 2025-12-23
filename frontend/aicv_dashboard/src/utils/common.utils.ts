import { envConfig } from 'src/config/env.config';

const baseURL = envConfig.API_BASE_ENDPOINT;

export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const urlImage = (url) => {
  return url ? `${baseURL}/${url}` : '';
};
