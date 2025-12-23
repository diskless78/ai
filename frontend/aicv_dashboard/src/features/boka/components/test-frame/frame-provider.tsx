// frame-provider.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFrames(indexes: number[], fps: number = 20) {
  const [frames, setFrames] = useState<Record<number, string>>({});

  useEffect(() => {
    let isMounted = true;

    async function fetchFrames() {
      try {
        const results = await Promise.all(
          indexes.map(async (i) => {
            const res = await axios.get(
              `http://192.168.1.21:8000/frame_b64_json/${i}`,
              {
                responseType: 'json',
                timeout: 5000,
              }
            );
            const result =
              typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
            return [i, result.frame_b64] as [number, string];
          })
        );

        if (isMounted) {
          const nextFrames: Record<number, string> = {};
          results.forEach(([i, base64]) => {
            nextFrames[i] = base64;
          });
          setFrames(nextFrames);
        }
      } catch (e) {
        console.error(e);
      }
    }

    const interval = setInterval(fetchFrames, 1000 / fps);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [indexes, fps]);

  return frames;
}
