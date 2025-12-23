import { useQuery } from '@tanstack/react-query';
import type { ICameraListRequest } from 'src/models/camera';
import type { IZoneListRequest } from 'src/models/zone';
import { groupService } from 'src/services';
import { cameraService } from 'src/services/api/camera.service';
import { zoneService } from 'src/services/api/zone.service';

export const CACHE_KEYS = {
  SystemGroupsList: 'SYSTEM_GROUPS_LIST',
  SystemAnalysisList: 'SYSTEM_ANALYSIS_LIST',
};

export const useSystemGroups = () => {
  return useQuery({
    queryKey: [CACHE_KEYS.SystemGroupsList],
    queryFn: () => groupService.getList(),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useZoneList = (params: IZoneListRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.SystemGroupsList, params],
    queryFn: () => zoneService.getList(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};

export const useCameraList = (params: ICameraListRequest) => {
  return useQuery({
    queryKey: [CACHE_KEYS.SystemGroupsList, params],
    queryFn: () => cameraService.getList(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    select: (res) => res.data,
  });
};
