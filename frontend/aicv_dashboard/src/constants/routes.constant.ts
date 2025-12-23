const BASE_PATHS = {
  ANALYSIS: '/analysis',
  USERS: '/users',
  PRODUCTS: '/products',
  COMPONENTS: '/components',
  SETTINGS: '/settings',
  CONFIG: '/config',
} as const;

export const AUTH_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
} as const;

export const ANALYSIS_ROUTES = {
  VISITOR_COUNT: `${BASE_PATHS.ANALYSIS}/visitor-count`,
  ZONE_TRAFFIC: `${BASE_PATHS.ANALYSIS}/zone-traffic`,
} as const;

export const USERS_ROUTES = {
  USER_MANAGEMENT: `${BASE_PATHS.USERS}/user-management`,
  CREATE_USER: `${BASE_PATHS.USERS}/create-user`,
  PERMISSION_MANAGEMENT: `${BASE_PATHS.USERS}/permission-management`,
  CREATE_ROLE: `${BASE_PATHS.USERS}/create-role`,
  PERMISSION_DETAIL: `${BASE_PATHS.USERS}/permission`,
  EDIT_ROLE: `${BASE_PATHS.USERS}/edit-permission`,
} as const;

export const PRODUCTS_ROUTES = {
  PRODUCT_MANAGEMENT: `${BASE_PATHS.PRODUCTS}/product-management`,
  PRODUCT_CATEGORY: `${BASE_PATHS.PRODUCTS}/product-category`,
} as const;

export const SETTINGS_ROUTES = {
  SETTINGS: BASE_PATHS.SETTINGS,
} as const;

export const CONFIG_ROUTES = {
  COLOR_PALETTE: `${BASE_PATHS.CONFIG}/color-palette`,
} as const;

export const DEV_ROUTES = {
  TEST_PAGE: '/test-page',
  COLOR_CHECK: '/color-check',
} as const;

export const ERROR_ROUTES = {
  NOT_FOUND: '/404',
} as const;

export const ROUTES_CONSTANT = {
  // Auth
  HOME: AUTH_ROUTES.HOME,
  LOGIN: AUTH_ROUTES.LOGIN,
  PROFILE: AUTH_ROUTES.PROFILE,

  // Analysis Module
  VISITOR_COUNT: ANALYSIS_ROUTES.VISITOR_COUNT,
  ZONE_TRAFFIC: ANALYSIS_ROUTES.ZONE_TRAFFIC,

  // Users Module
  USER_MANAGEMENT: USERS_ROUTES.USER_MANAGEMENT,
  CREATE_USER: USERS_ROUTES.CREATE_USER,
  PERMISSION_MANAGEMENT: USERS_ROUTES.PERMISSION_MANAGEMENT,
  CREATE_ROLE: USERS_ROUTES.CREATE_ROLE,
  PERMISSION_DETAIL: USERS_ROUTES.PERMISSION_DETAIL,
  EDIT_ROLE: USERS_ROUTES.EDIT_ROLE,
  // Settings Module
  SETTINGS: SETTINGS_ROUTES.SETTINGS,

  // Configuration Module
  COLOR_PALETTE: CONFIG_ROUTES.COLOR_PALETTE,

  // Product Module (BoKa)
  PRODUCT_MANAGEMENT: PRODUCTS_ROUTES.PRODUCT_MANAGEMENT,
  PRODUCT_CATEGORY: PRODUCTS_ROUTES.PRODUCT_CATEGORY,

  // Components (Development/Testing)
  TEST_PAGE: DEV_ROUTES.TEST_PAGE,
  COLOR_CHECK: DEV_ROUTES.COLOR_CHECK,

  // Error Pages
  NOT_FOUND: ERROR_ROUTES.NOT_FOUND,
} as const;
