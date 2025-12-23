import { envConfig } from 'src/config/env.config';
import { PRODUCT_NAMES, ProductType } from 'src/constants/product.constant';
import {
  NavFeature,
  FEATURE_ACCESS_MAP,
  DEV_ONLY_FEATURES,
  type Feature,
} from 'src/constants/feature-flags.constant';
import type { IUser } from 'src/models/user';

/**
 * Check if current environment is development
 */
export const isDevelopmentEnvironment = (): boolean => {
  return envConfig.ENVIRONMENT === 'development' || import.meta.env.DEV;
};

/**
 * Get user's product type from email
 */
export const getUserProductType = (user: IUser | null): ProductType | null => {
  if (!user?.email) return null;

  const productEntry = Object.entries(PRODUCT_NAMES).find(
    ([_, email]) => email === user.email
  );

  return productEntry ? (productEntry[0] as ProductType) : null;
};

/**
 * Check if user has access to a feature based on FEATURE_ACCESS_MAP
 */
export const hasFeatureAccess = (
  feature: Feature,
  user: IUser | null
): boolean => {
  const allowedProducts = FEATURE_ACCESS_MAP[feature];

  // If feature is not in map, everyone has access (default)
  if (!allowedProducts) return true;

  // If empty array, no one has access (disabled)
  if (allowedProducts.length === 0) {
    // Special case: Dev-only features require development environment
    if (DEV_ONLY_FEATURES.includes(feature as NavFeature)) {
      return isDevelopmentEnvironment();
    }
    return false;
  }

  // Check if user's product is in allowed list
  const userProduct = getUserProductType(user);
  if (!userProduct) return false;

  return allowedProducts.includes(userProduct);
};

/**
 * Check if user has access to any of the features (OR logic)
 */
export const hasAnyFeatureAccess = (
  features: Feature[],
  user: IUser | null
): boolean => {
  return features.some((feature) => hasFeatureAccess(feature, user));
};

/**
 * Check if user has access to all features (AND logic)
 */
export const hasAllFeatureAccess = (
  features: Feature[],
  user: IUser | null
): boolean => {
  return features.every((feature) => hasFeatureAccess(feature, user));
};

/**
 * Get all features user has access to
 */
export const getAccessibleFeatures = (user: IUser | null): Feature[] => {
  const allFeatures = Object.keys(FEATURE_ACCESS_MAP) as Feature[];
  return allFeatures.filter((feature) => hasFeatureAccess(feature, user));
};

