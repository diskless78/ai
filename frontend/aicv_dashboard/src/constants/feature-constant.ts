import { ASSET_CONSTANT } from './asset.constant';
import { ROUTES_CONSTANT } from './routes.constant';
import { NavFeature } from './feature-flags.constant';

export interface FeatureMetadata {
  title: string;
  path: string;
  icon?: string;
  feature?: NavFeature; // Link to feature access control
}

export const FEATURE = {
  DATA_OVERVIEW: {
    title: 'Data overview',
    path: ROUTES_CONSTANT.HOME,
    icon: ASSET_CONSTANT.SVG.IconBoldDashboard,
  },

  ANALYSIS: {
    title: 'Analysis',
    path: '/analysis',
    icon: ASSET_CONSTANT.SVG.IconReports,
  },

  VISITOR_COUNT: {
    title: 'Visitor count',
    path: ROUTES_CONSTANT.VISITOR_COUNT,
    icon: ASSET_CONSTANT.SVG.IconReports,
  },

  ZONE_TRAFFIC: {
    title: 'Zone traffic',
    path: ROUTES_CONSTANT.ZONE_TRAFFIC,
    icon: ASSET_CONSTANT.SVG.IconReports,
  },

  USERS: {
    title: 'Users',
    path: '/users',
    icon: ASSET_CONSTANT.SVG.IconBoldHr,
    feature: NavFeature.USERS,
  },

  USER_MANAGEMENT: {
    title: 'User management',
    path: ROUTES_CONSTANT.USER_MANAGEMENT,
    icon: ASSET_CONSTANT.SVG.IconBoldHr,
    feature: NavFeature.USER_MANAGEMENT,
  },

  CREATE_USER: {
    title: 'Create new user',
    path: ROUTES_CONSTANT.CREATE_USER,
    feature: NavFeature.USER_MANAGEMENT,
  },

  PERMISSION_MANAGEMENT: {
    title: 'Permission management',
    path: ROUTES_CONSTANT.PERMISSION_MANAGEMENT,
    icon: ASSET_CONSTANT.SVG.IconBoldHr,
    feature: NavFeature.PERMISSION_MANAGEMENT,
  },

  CREATE_ROLE: {
    title: 'Create new role',
    path: ROUTES_CONSTANT.CREATE_ROLE,
    feature: NavFeature.PERMISSION_MANAGEMENT,
  },

  SETTINGS: {
    title: 'Settings',
    path: ROUTES_CONSTANT.SETTINGS,
    icon: ASSET_CONSTANT.SVG.IconBoldSetting2,
    feature: NavFeature.SETTINGS,
  },

  CONFIG: {
    title: 'Theme configuration',
    path: '/config',
    icon: ASSET_CONSTANT.SVG.IconBoldSetting1,
    feature: NavFeature.CONFIG,
  },

  COLOR_PALETTE: {
    title: 'Color Palette',
    path: ROUTES_CONSTANT.COLOR_PALETTE,
    icon: ASSET_CONSTANT.SVG.IconBoldSetting2,
    feature: NavFeature.COLOR_PALETTE,
  },

  // ==================== PRODUCTS (BoKa) ====================
  PRODUCTS: {
    title: 'Products',
    path: '/products',
  },

  PRODUCT_MANAGEMENT: {
    title: 'Product Management',
    path: ROUTES_CONSTANT.PRODUCT_MANAGEMENT,
  },

  PRODUCT_CATEGORY: {
    title: 'Product Category',
    path: ROUTES_CONSTANT.PRODUCT_CATEGORY,
  },
} as const satisfies Record<string, FeatureMetadata>;

// Export type for autocomplete
export type FeatureKey = keyof typeof FEATURE;
