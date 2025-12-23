import { type RefObject } from 'react';

export type SegmentedControlSize = 'small' | 'medium';

export interface Segment {
  value: string;
  label: string;
  ref: RefObject<HTMLDivElement | null>;
}

export type SegmentedControlProps = {
  name: string;
  segments: Segment[];
  onChange: (value: string, index: number) => void;
  defaultIndex?: number;
  controlRef: RefObject<HTMLDivElement | null>;
  size?: SegmentedControlSize;
  segmentedWidth?: string | number;
};
