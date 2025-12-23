import { useEffect, useRef } from 'react';
import axios from 'axios';

type Props = {
  index: number;
};

export default function FrameBase64ImageViewer({ index }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let isMounted = true;

    const FRAME_URL = `http://192.168.1.21:8000/frame_b64_json/${index}`;

    async function fetchFrame() {
      try {
        const response = await axios.get(FRAME_URL, {
          responseType: 'json',
          timeout: 1000,
        });

        const result = JSON.parse(response.data);

        const base64 = result['frame_b64'];

        // const uint8Array = new Uint8Array(jpegArray);

        // const blob = new Blob([uint8Array], { type: 'image/jpeg' });

        // const objectUrl = URL.createObjectURL(blob);

        if (isMounted && imgRef.current) {
          imgRef.current.src = `data:image/jpeg;base64,${base64}`;
        }
      } catch (error) {
        console.error('Failed to fetch frame:', error);
      }
    }

    const interval = setInterval(fetchFrame, 1000 / 20); // 20 FPS
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [index]);

  return (
    <div className='flex justify-center items-center bg-black w-full h-full'>
      {imgRef ? (
        <img
          ref={imgRef}
          alt='Live Frame'
          className='rounded-lg shadow-lg max-w-full max-h-full'
        />
      ) : (
        <p className='text-white'>Loading frames...</p>
      )}
    </div>
  );
}
