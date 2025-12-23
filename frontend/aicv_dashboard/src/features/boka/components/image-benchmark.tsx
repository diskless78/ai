import React, { useEffect, useRef, useState } from 'react';

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

export default function ImageBenchmark() {
  const [mode, setMode] = useState<Mode>('blob');
  const [imgSrcs, setImgSrcs] = useState<string[]>(Array(4).fill(''));
  const [fps, setFps] = useState(0);
  const [avgRender, setAvgRender] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState<MemoryInfo | null>(null);

  const frameCount = useRef(0);
  const totalRenderTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const binaries = useRef<ArrayBuffer[]>([]);
  const base64s = useRef<string[]>([]);

  // 🧰 Load binary and Base64 once
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

  // 🎯 Benchmark render loop (Uncached only)
  useEffect(() => {
    if (binaries.current.length === 0 || base64s.current.length === 0) return;

    frameCount.current = 0;
    totalRenderTime.current = 0;
    let lastFpsTime = performance.now();
    let frameCounter = 0;

    const renderLoop = () => {
      const start = performance.now();

      if (mode === 'blob') {
        // ⚡ Blob mỗi frame tạo lại objectURL khác
        const urls = binaries.current.map((buf) => {
          const blob = new Blob([buf], { type: 'image/jpeg' });
          const url = URL.createObjectURL(blob);
          return url;
        });
        setImgSrcs(urls);
        setTimeout(() => urls.forEach((u) => URL.revokeObjectURL(u)), 0);
      } else {
        // ⚡ Base64: clone string để tránh browser cache nội bộ
        // Bằng cách thêm comment nhẹ vào cuối (sẽ không phá base64)
        setImgSrcs(
          base64s.current.map(
            (b64) => b64 + '#refresh-' + Math.random().toString(36).slice(2, 5)
          )
        );
      }

      const end = performance.now();
      totalRenderTime.current += end - start;
      frameCount.current++;
      frameCounter++;

      // ⏱️ update stats mỗi giây
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(frameCounter);
        setAvgRender(totalRenderTime.current / frameCount.current);
        frameCounter = 0;
        lastFpsTime = now;

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
        🧪 React Image Benchmark (Uncached)
      </h1>

      <div className='mb-3 flex gap-2'>
        <button
          onClick={() => setMode('blob')}
          className={`px-3 py-2 rounded ${mode === 'blob' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
        >
          Blob + ObjectURL
        </button>
        <button
          onClick={() => setMode('base64')}
          className={`px-3 py-2 rounded ${mode === 'base64' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
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
          <b>Avg render:</b> {avgRender.toFixed(2)} ms/frame
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
            alt={`img-${idx}`}
            className='w-full border border-gray-300'
          />
        ))}
      </div>
    </div>
  );
}
