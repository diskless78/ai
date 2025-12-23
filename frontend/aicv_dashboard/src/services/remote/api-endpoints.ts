/**
 * @deprecated Use endpoints from 'src/services/endpoints' instead
 * This file is kept for backward compatibility only
 */

import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  GROUP_ENDPOINTS,
  CAMERA_ENDPOINTS,
  ANALYTICS_ENDPOINTS,
  DATA_OVERVIEW_ENDPOINTS,
  ZONE_ENDPOINTS,
  ROUTE_MAP_ENDPOINTS,
} from '../endpoints';

const apiEndpoints = {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  GROUP: GROUP_ENDPOINTS,
  CAMERA: CAMERA_ENDPOINTS,
  ZONE: ZONE_ENDPOINTS,
  DATA_OVERVIEW: DATA_OVERVIEW_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
  ROUTE_MAP: ROUTE_MAP_ENDPOINTS,
};

export default apiEndpoints;
