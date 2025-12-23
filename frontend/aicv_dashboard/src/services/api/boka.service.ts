import api from '../remote/base-api';

const baseURL = 'http://192.168.1.45:8000/api/v1/';

const getCamera = (): Promise<any> =>
  api.get(baseURL, 'streams/cam_04/pull', {
    params: {
      quality: 40,
    },
  });

const BokaService = {
  getCamera,
};

export default BokaService;
