import { useSelector } from 'react-redux';
import type { RootState } from 'src/store';
import { FeatureFlag } from 'src/constants/feature-flags.constant';
import {
  hasFeatureAccess,
  hasAnyFeatureAccess,
  hasAllFeatureAccess,
  getAccessibleFeatures,
} from 'src/utils/feature-flag.utils';

export const useFeatureFlag = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const userProduct = user?.email || null;

  return {
    /**
     * Kiểm tra quyền truy cập một feature
     */
    hasAccess: (feature: FeatureFlag): boolean => {
      return hasFeatureAccess(feature, userProduct);
    },

    /**
     * Kiểm tra quyền truy cập bất kỳ feature nào trong danh sách (OR)
     */
    hasAnyAccess: (features: FeatureFlag[]): boolean => {
      return hasAnyFeatureAccess(features, userProduct);
    },

    /**
     * Kiểm tra quyền truy cập tất cả features trong danh sách (AND)
     */
    hasAllAccess: (features: FeatureFlag[]): boolean => {
      return hasAllFeatureAccess(features, userProduct);
    },

    /**
     * Lấy danh sách tất cả features có quyền truy cập
     */
    accessibleFeatures: getAccessibleFeatures(userProduct),

    /**
     * Product hiện tại của user
     */
    userProduct,
  };
};
