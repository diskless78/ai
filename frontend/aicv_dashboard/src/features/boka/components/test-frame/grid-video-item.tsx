import React from 'react';
import { Grid, Card } from '@mui/material';
import MJPEGView from './mjpeg-view';

type Item = {
  id: string | number;
  title: string;
  subtitle?: string;
  content?: React.ReactNode;
};

type Grid4ViewProps = {
  items?: Item[];
  onSelect?: (item: Item) => void;
};

// Default sample data (will be used when `items` prop is not provided)
const defaultItems: Item[] = [
  { id: 1, title: 'Item 1', subtitle: 'Subtitle 1' },
  { id: 2, title: 'Item 2', subtitle: 'Subtitle 2' },
  { id: 3, title: 'Item 3', subtitle: 'Subtitle 3' },
  { id: 4, title: 'Item 4', subtitle: 'Subtitle 4' },
];

export default function GridVideoView({
  items = defaultItems,
}: Grid4ViewProps) {
  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid size={6} key={item.id}>
          <Card>
            <MJPEGView
              url={`http://192.168.1.21:8000/stream/${index + 1}`}
              width={640}
              height={480}
              alt='camera'
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
