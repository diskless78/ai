import { useQuery } from '@tanstack/react-query';
import type { IRouteMapRequest } from 'src/models/route-map';
import { routeMapService } from 'src/services';

export const useRouteMapByCam = (params: IRouteMapRequest) => {
  return useQuery({
    queryKey: ['route-map-by-cam', params],
    queryFn: () => routeMapService.getRoutemapByCam(params),
    staleTime: 5_000,
    enabled:
      !!params.camera_id &&
      !!params.time_filter_type &&
      !!params.start_date &&
      !!params.end_date,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};
