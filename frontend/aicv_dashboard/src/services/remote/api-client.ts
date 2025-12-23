/**
 * @deprecated Use httpClient from 'src/services/http' instead
 * This file is kept for backward compatibility only
 */

import { httpClient } from '../http';

// Re-export for backward compatibility
export const apiClient = httpClient;
export default httpClient;
