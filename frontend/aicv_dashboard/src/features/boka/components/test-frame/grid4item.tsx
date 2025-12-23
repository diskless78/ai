import React from 'react';
import { Grid, Card } from '@mui/material';
import { useFrames } from './frame-provider';

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

export default function Grid4View({ items = defaultItems }: Grid4ViewProps) {
  const frames = useFrames(
    items.map((_, idx) => idx + 1),
    20
  );

  return (
    <Grid container spacing={2}>
      {items.map((item, index) => (
        <Grid size={6} key={item.id}>
          <Card>
            <img
              src={
                frames[index + 1]
                  ? `data:image/jpeg;base64,${frames[index + 1]}`
                  : ''
              }
              alt='Live Frame'
              className='rounded-lg shadow-lg max-w-full max-h-full'
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
