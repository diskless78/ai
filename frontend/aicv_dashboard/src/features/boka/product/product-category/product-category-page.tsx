import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ProductCategoryView } from './product-category-view';

// ----------------------------------------------------------------------

export default function ProductCategoryPage() {
  return (
    <>
      <Helmet>
        <title> {`Product Category - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductCategoryView />
    </>
  );
}
