export interface ICameraListRequest {
  group_ids: string[];
  modules: string;
}

export interface ICameraResponse {
  data: ICameraItem[];
}

export interface ICameraItem {
  id: string;
  name: string;
}
