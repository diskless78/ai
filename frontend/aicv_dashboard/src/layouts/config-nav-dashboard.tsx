import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { FEATURE } from 'src/constants/feature-constant';
import { authSelector, useAppSelector } from 'src/store';
import { hasFeatureAccess } from 'src/utils/nav-permission.utils';
import type { NavFeature } from 'src/constants/feature-flags.constant';

const icon = (src: string) => (
  <BaseIcon size={20} src={src} color='neutral.50' />
);

export interface ISubItem {
  title: string;
  count?: number;
  path?: string;
}

export interface INavItem {
  title: string;
  icon: string;
  subItems?: ISubItem[];
  path?: string;
}

export interface IMainNavItem {
  title: string;
  items: INavItem[];
}

export interface IRootNavItem {
  id: string;
  icon: React.ReactElement;
}

export const rootNavItems: IRootNavItem[] = [
  { id: 'page-1', icon: icon(ASSET_CONSTANT.SVG.IconBoldHome3) },
  { id: 'page-2', icon: icon(ASSET_CONSTANT.SVG.IconBoldHome3) },
  { id: 'page-3', icon: icon(ASSET_CONSTANT.SVG.IconBoldHome3) },
  { id: 'page-4', icon: icon(ASSET_CONSTANT.SVG.IconBoldHome3) },
  { id: 'page-5', icon: icon(ASSET_CONSTANT.SVG.IconBoldHome3) },
];

export const useNavData = () => {
  const { user } = useAppSelector(authSelector);

  /**
   * Helper function to check if user has access to a feature
   * Uses centralized FEATURE_ACCESS_MAP for permission management
   */
  const hasAccess = (feature?: NavFeature): boolean => {
    if (!feature) return true; // No feature restriction
    return hasFeatureAccess(feature, user);
  };

  const mainNavItems: IMainNavItem[] = [
    {
      title: 'Main',
      items: [
        {
          title: FEATURE.DATA_OVERVIEW.title,
          icon: FEATURE.DATA_OVERVIEW.icon!,
          path: FEATURE.DATA_OVERVIEW.path,
        },
        {
          title: FEATURE.ANALYSIS.title,
          icon: FEATURE.ANALYSIS.icon!,
          subItems: [
            {
              title: FEATURE.VISITOR_COUNT.title,
              path: FEATURE.VISITOR_COUNT.path,
            },
            {
              title: FEATURE.ZONE_TRAFFIC.title,
              path: FEATURE.ZONE_TRAFFIC.path,
            },
          ],
        },
      ],
    },
  ];

  // Build Management section items based on feature access
  const managementItems: INavItem[] = [];

  // USERS menu (dev only)
  if (hasAccess(FEATURE.USERS.feature)) {
    managementItems.push({
      title: FEATURE.USERS.title,
      icon: FEATURE.USERS.icon!,
      subItems: [
        {
          title: FEATURE.USER_MANAGEMENT.title,
          path: FEATURE.USER_MANAGEMENT.path,
        },
        {
          title: FEATURE.PERMISSION_MANAGEMENT.title,
          path: FEATURE.PERMISSION_MANAGEMENT.path,
        },
      ],
    });
  }

  // SETTINGS menu (dev only)
  if (hasAccess(FEATURE.SETTINGS.feature)) {
    managementItems.push({
      title: FEATURE.SETTINGS.title,
      icon: FEATURE.SETTINGS.icon!,
      path: FEATURE.SETTINGS.path,
    });
  }

  // CONFIG menu (trienkhai only)
  if (hasAccess(FEATURE.CONFIG.feature)) {
    managementItems.push({
      title: FEATURE.CONFIG.title,
      icon: FEATURE.CONFIG.icon!,
      subItems: [
        {
          title: FEATURE.COLOR_PALETTE.title,
          path: FEATURE.COLOR_PALETTE.path,
        },
      ],
    });
  }

  // Only add Management section if there are items
  if (managementItems.length > 0) {
    mainNavItems.push({
      title: 'Management',
      items: managementItems,
    });
  }

  return mainNavItems;
};

