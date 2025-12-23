// _data.ts

export type SampleProduct = {
  id: string;
  productName: string;
  category: string;
  type: string;
  imageUrl: string;
};

export const mockSampleProducts: SampleProduct[] = [
  {
    id: 'CX31102501',
    productName: 'Bàn không ngăn',
    category: 'Gỗ Thông',
    type: 'Gỗ Thông Đà Lạt',
    imageUrl: '/assets/images/temp/sample-product-1.jpeg',
  },
  {
    id: 'CX31102502',
    productName: 'Bàn gỗ nâu',
    category: 'Hoàng Đàn',
    type: 'Hoàng Đà Tuyết Lạng Sơn',
    imageUrl: '/assets/images/temp/sample-product-2.jpeg',
  },
];
