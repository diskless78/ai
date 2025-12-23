import {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { unpack } from 'msgpackr';
import type { CameraPreviewHandle } from './camera-preview';
import CameraPreview from './camera-preview';

const BASE_URL = 'http://192.168.1.45:8000';
const CAM_ID = 'cam_01';

type ResponseData = {
  frame_current: ArrayBuffer;
};

export type CameraPreviewContainerHandle = {
  triggerPoll: () => void;
};

type CameraPreviewContainerProps = {
  fps?: number;
  autoPoll?: boolean;
};

const CameraPreviewContainer = forwardRef<
  CameraPreviewContainerHandle,
  CameraPreviewContainerProps
>(({ fps = 10, autoPoll = true }, ref) => {
  const previewRef = useRef<CameraPreviewHandle>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchFrame = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/streams/${CAM_ID}/msgpack/pull?q=40`,
        { method: 'GET' }
      );

      if (!response.ok) {
        console.log('Request failed:', response.statusText);
        return;
      }

      const buffer = await response.arrayBuffer();
      const decoded = unpack(new Uint8Array(buffer));
      const data: ResponseData = decoded;
      const blob = new Blob([data.frame_current], { type: 'image/jpeg' });
      const objectUrl = URL.createObjectURL(blob);

      previewRef.current?.updateSrc(objectUrl);
    } catch (error) {
      console.log('Error fetching frame:', error);
    }
  }, []);

  useEffect(() => {
    if (autoPoll) {
      intervalRef.current = setInterval(fetchFrame, 1000 / fps);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoPoll, fps, fetchFrame]);

  useImperativeHandle(ref, () => ({
    triggerPoll: fetchFrame,
  }));

  return <CameraPreview ref={previewRef} showScanEffect fit='cover' />;
});

export default CameraPreviewContainer;
