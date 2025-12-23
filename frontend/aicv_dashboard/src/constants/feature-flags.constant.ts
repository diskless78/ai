import { ProductType } from './product.constant';

// Feature flags for conditional features
export enum FeatureFlag {
  TRANSACTION_AND_INTERACTION = 'transaction_and_interaction',
  STORE_TRANSACTION = 'store_transaction',
  TRAFFIC_TREND = 'traffic_trend',
}

// Navigation features that require specific permissions
export enum NavFeature {
  USERS = 'users',
  USER_MANAGEMENT = 'user_management',
  PERMISSION_MANAGEMENT = 'permission_management',
  SETTINGS = 'settings',
  CONFIG = 'config',
  COLOR_PALETTE = 'color_palette',
}

// All features (both feature flags and navigation features)
export type Feature = FeatureFlag | NavFeature;

/**
 * Feature Access Map - Centralized permission management
 * Maps features to allowed product types
 * - Empty array [] = No one has access (disabled)
 * - Specific products = Only those products have access
 * - Not in map = Everyone has access (default)
 */
export const FEATURE_ACCESS_MAP: Partial<Record<Feature, ProductType[]>> = {
  // Feature flags (conditional features)
  [FeatureFlag.TRANSACTION_AND_INTERACTION]: [ProductType.GS25],
  [FeatureFlag.STORE_TRANSACTION]: [ProductType.GS25],
  [FeatureFlag.TRAFFIC_TREND]: [ProductType.GS25],

  // Navigation features - Config/Theme (trienkhai only)
  [NavFeature.CONFIG]: [ProductType.TRIEN_KHAI],
  [NavFeature.COLOR_PALETTE]: [ProductType.TRIEN_KHAI],

  // Navigation features - User Management (dev environment only)
  // Note: These will be checked with isDevelopment flag in addition to product
  [NavFeature.USERS]: [],
  [NavFeature.USER_MANAGEMENT]: [],
  [NavFeature.PERMISSION_MANAGEMENT]: [],
  [NavFeature.SETTINGS]: [],
};

/**
 * Features that require development environment
 * These features check BOTH product access AND dev environment
 */
export const DEV_ONLY_FEATURES: NavFeature[] = [
  NavFeature.USERS,
  NavFeature.USER_MANAGEMENT,
  NavFeature.PERMISSION_MANAGEMENT,
  NavFeature.SETTINGS,
];

export const DEFAULT_FEATURE_ACCESS: FeatureFlag[] = [];

