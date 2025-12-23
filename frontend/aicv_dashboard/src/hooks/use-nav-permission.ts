import { useSelector } from 'react-redux';
import type { RootState } from 'src/store';
import type { Feature } from 'src/constants/feature-flags.constant';
import {
  hasFeatureAccess,
  hasAnyFeatureAccess,
  hasAllFeatureAccess,
  isDevelopmentEnvironment,
  getUserProductType,
  getAccessibleFeatures,
} from 'src/utils/nav-permission.utils';

/**
 * Hook for checking feature access (both feature flags and navigation features)
 * Uses centralized FEATURE_ACCESS_MAP for permission management
 */
export const useNavPermission = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return {
    /**
     * Check if user has access to a specific feature
     */
    hasAccess: (feature: Feature): boolean => {
      return hasFeatureAccess(feature, user);
    },

    /**
     * Check if user has access to ANY of the specified features (OR logic)
     */
    hasAnyAccess: (features: Feature[]): boolean => {
      return hasAnyFeatureAccess(features, user);
    },

    /**
     * Check if user has access to ALL of the specified features (AND logic)
     */
    hasAllAccess: (features: Feature[]): boolean => {
      return hasAllFeatureAccess(features, user);
    },

    /**
     * Get all features user has access to
     */
    accessibleFeatures: getAccessibleFeatures(user),

    /**
     * Check if current environment is development
     */
    isDevelopment: isDevelopmentEnvironment(),

    /**
     * Get user's product type
     */
    userProduct: getUserProductType(user),

    /**
     * Current user
     */
    user,
  };
};
