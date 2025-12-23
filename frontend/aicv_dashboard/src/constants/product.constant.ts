export enum ProductType {
  GS25 = 'gs25',
  MAROU = 'marou',
  TRIEN_KHAI = 'trienkhai',
}

export const PRODUCT_NAMES: Record<ProductType, string> = {
  [ProductType.GS25]: 'gs25@cxview.ai',
  [ProductType.MAROU]: 'marou.chocolate@cxview.ai',
  [ProductType.TRIEN_KHAI]: 'trienkhai@cxview.ai',
};
