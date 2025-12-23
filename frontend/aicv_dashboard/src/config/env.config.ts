export interface ENV {
  ENVIRONMENT: string;
  API_BASE_ENDPOINT: string;
  API_CXVIEW_ENDPOINT: string;
}

export const envConfig: ENV = {
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT ?? '',
  API_BASE_ENDPOINT: import.meta.env.VITE_API_BASE_ENDPOINT ?? '',
  API_CXVIEW_ENDPOINT: import.meta.env.VITE_API_CXVIEW_ENDPOINT ?? '',
};
