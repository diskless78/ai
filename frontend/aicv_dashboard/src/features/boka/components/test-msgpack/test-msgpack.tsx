import React, { useEffect, useState } from 'react';
import { unpack } from 'msgpackr';

const MsgpackReader: React.FC = () => {
  const [data] = useState<any>(null);

  useEffect(() => {
    const loadMsgpack = async () => {
      try {
        // 🧾 Fetch file binary
        const response = await fetch(
          'http://192.168.1.45:8000/api/v1/streams/cam_01/msgpack/pull?q=40',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/msgpack',
            },
          }
        );
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        const decoded = unpack(bytes);

        console.log('decoded: ', decoded);
      } catch (error) {
        console.error('Error reading msgpack file:', error);
      }
    };

    loadMsgpack();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h3>📦 Dữ liệu từ msgpack.bin</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default MsgpackReader;
