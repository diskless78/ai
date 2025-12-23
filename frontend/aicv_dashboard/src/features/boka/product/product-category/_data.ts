// _data.ts

export type ProductCategory = {
  id: number;
  name: string;
};

export const mockProductCategories: ProductCategory[] = [
  {
    id: 1,
    name: 'Gỗ bàn',
  },
  {
    id: 2,
    name: 'Gỗ bàn',
  },
  {
    id: 3,
    name: 'Gỗ bàn',
  },
];

export type WoodType = {
  id: number;
  name: string;
};

export const mockWoodTypes: WoodType[] = [
  {
    id: 1,
    name: 'Gỗ óc chó',
  },
  {
    id: 2,
    name: 'Gỗ sồi',
  },
  {
    id: 3,
    name: 'Gỗ hương',
  },
  {
    id: 4,
    name: 'Gỗ trắc',
  },
];
