import { ProductType, PRODUCT_NAMES } from 'src/constants/product.constant';
import {
  FeatureFlag,
  FEATURE_ACCESS_MAP,
  DEFAULT_FEATURE_ACCESS,
} from 'src/constants/feature-flags.constant';

const resolveProductType = (product: string): ProductType => {
  const normalized = product.toLowerCase();

  // Check if it matches a ProductType value directly
  if (Object.values(ProductType).includes(normalized as ProductType)) {
    return normalized as ProductType;
  }

  // Check if it matches a PRODUCT_NAMES value (e.g. email)
  const entry = Object.entries(PRODUCT_NAMES).find(
    (entry) => entry[1].toLowerCase() === normalized
  );

  if (entry) {
    return entry[0] as ProductType;
  }

  return normalized as ProductType;
};

export const hasFeatureAccess = (
  feature: FeatureFlag,
  product: string | null
): boolean => {
  // Nếu user không có product, check default access
  if (!product) {
    return DEFAULT_FEATURE_ACCESS.includes(feature);
  }

  // Normalize product string to ProductType
  const normalizedProduct = resolveProductType(product);

  // Nếu feature không có trong access map, mặc định cho phép tất cả
  const allowedProducts = FEATURE_ACCESS_MAP[feature];
  if (!allowedProducts) {
    return true;
  }

  // Check xem product có trong danh sách được phép không
  return allowedProducts.includes(normalizedProduct);
};

export const hasAnyFeatureAccess = (
  features: FeatureFlag[],
  product: string | null
): boolean => {
  return features.some((feature) => hasFeatureAccess(feature, product));
};

export const hasAllFeatureAccess = (
  features: FeatureFlag[],
  product: string | null
): boolean => {
  return features.every((feature) => hasFeatureAccess(feature, product));
};

export const getAccessibleFeatures = (
  product: string | null
): FeatureFlag[] => {
  const allFeatures = Object.values(FeatureFlag);
  return allFeatures.filter((feature) => hasFeatureAccess(feature, product));
};

export const filterByFeatureAccess = <T>(
  items: T[],
  getFeature: (item: T) => FeatureFlag | undefined,
  product: string | null
): T[] => {
  return items.filter((item) => {
    const feature = getFeature(item);
    if (!feature) return true; // Nếu item không có feature, luôn hiển thị
    return hasFeatureAccess(feature, product);
  });
};
