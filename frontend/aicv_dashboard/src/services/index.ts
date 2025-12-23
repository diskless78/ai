/**
 * Services Module
 * Main entry point for all services
 */

// HTTP Client
export { httpClient } from './http';
export type { CustomAxiosRequestConfig, ApiResponse } from './http';

// Storage
export { authStorage, STORAGE_KEYS } from './storage';

// API Services
export {
  authService,
  userService,
  groupService,
  dataOverviewService,
  analyticsService,
  routeMapService,
} from './api';

// Endpoints
export * from './endpoints';

// Legacy exports for backward compatibility
export { authStorage as authTokens } from './storage';
