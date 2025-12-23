import { useEffect, useRef, useState } from 'react';

const IMG_URLS = [
  '/assets/images/image1.jpg',
  '/assets/images/image2.jpg',
  '/assets/images/image3.jpg',
  '/assets/images/image4.jpg',
];

type Mode = 'blob' | 'base64';

interface MemoryInfo {
  usedJS: number;
  totalJS: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

const PerformanceWithMemoryView = () => {
  const [mode, setMode] = useState<Mode>('blob');
  const [imgSrcs, setImgSrcs] = useState<string[]>(Array(4).fill(''));
  const [fps, setFps] = useState<number>(0);
  const [avgRender, setAvgRender] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<MemoryInfo | null>(null);

  const totalRenderTime = useRef<number>(0);
  const rafId = useRef<number | null>(null);
  const currentUrls = useRef<string[]>([]);

  const binaries = useRef<ArrayBuffer[]>([]);
  const base64s = useRef<string[]>([]);

  // 🧰 Load 4 images once in binary and Base64
  useEffect(() => {
    Promise.all(
      IMG_URLS.map((url) => fetch(url).then((res) => res.arrayBuffer()))
    ).then((buffers) => {
      binaries.current = buffers;

      Promise.all(
        buffers.map(
          (buf) =>
            new Promise<string>((resolve) => {
              const blob = new Blob([buf], { type: 'image/jpeg' });
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            })
        )
      ).then((base64Array) => {
        base64s.current = base64Array;
      });
    });
  }, []);

  useEffect(() => {
    if (binaries.current.length === 0 || base64s.current.length === 0) return;

    let lastFpsTime = performance.now();
    let frameCounter = 0;

    const renderLoop = () => {
      const start = performance.now();

      if (mode === 'blob') {
        // Revoke URLs cũ trước
        currentUrls.current.forEach((u) => URL.revokeObjectURL(u));

        const urls = binaries.current.map((buf) => {
          const blob = new Blob([buf], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          return url;
        });
        currentUrls.current = urls;
        setImgSrcs(urls);
      } else {
        setImgSrcs(base64s.current);
      }

      const end = performance.now();
      totalRenderTime.current += end - start;
      // frameCount.current++;
      frameCounter = frameCounter + IMG_URLS.length;
      console.log(`totalRenderTime: ${totalRenderTime.current}`);
      console.log(`end: ${end}`);
      console.log(`frameCounter: ${frameCounter}`);

      // update metrics every second
      if (end - lastFpsTime >= 2000) {
        setFps((frameCounter / totalRenderTime.current) * 1000);
        setAvgRender(totalRenderTime.current / frameCounter);
        frameCounter = 0;
        totalRenderTime.current = 0;
        lastFpsTime = end;

        const perf = performance as PerformanceWithMemory;
        if (perf.memory) {
          setMemoryUsage({
            usedJS: perf.memory.usedJSHeapSize,
            totalJS: perf.memory.totalJSHeapSize,
          });
        }
      }

      rafId.current = requestAnimationFrame(renderLoop);
    };

    rafId.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      // Cleanup URLs khi unmount hoặc mode change
      currentUrls.current.forEach((u) => URL.revokeObjectURL(u));
      currentUrls.current = [];
    };
  }, [mode]);

  const formatBytes = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let num = bytes;
    while (num >= 1024 && i < units.length - 1) {
      num /= 1024;
      i++;
    }
    return `${num.toFixed(1)} ${units[i]}`;
  };

  return (
    <div className='p-4 font-sans'>
      <h1 className='text-2xl font-bold mb-4'>
        🧪 React Image Render Benchmark — 4 Grid
      </h1>

      <div className='mb-4 flex gap-2'>
        <button
          onClick={() => setMode('blob')}
          className={`px-3 py-2 rounded ${
            mode === 'blob' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
        >
          Blob + ObjectURL
        </button>
        <button
          onClick={() => setMode('base64')}
          className={`px-3 py-2 rounded ${
            mode === 'base64' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
        >
          Base64 Data URI
        </button>
      </div>

      <div className='mb-4 text-sm'>
        <p>
          <b>Mode:</b> {mode}
        </p>
        <p>
          <b>FPS:</b> {fps.toFixed(0)} frames/sec
        </p>
        <p>
          <b>Average render time:</b> {avgRender.toFixed(2)} ms/frame
        </p>
        {memoryUsage && (
          <>
            <p>
              <b>Used JS Heap:</b> {formatBytes(memoryUsage.usedJS)}
            </p>
            <p>
              <b>Total JS Heap:</b> {formatBytes(memoryUsage.totalJS)}
            </p>
          </>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {imgSrcs.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`test-${idx}`}
            style={{ width: '100%', border: '1px solid #ccc' }}
          />
        ))}
      </div>
    </div>
  );
};

export default PerformanceWithMemoryView;
