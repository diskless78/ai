export interface IZoneListResponse {
  data: IZone[];
}

export interface IZoneListRequest {
  group_ids: string[];
  type: string[];
}

export interface IZone {
  groupID: string;
  id: string;
  inside: boolean;
  name: string;
}
