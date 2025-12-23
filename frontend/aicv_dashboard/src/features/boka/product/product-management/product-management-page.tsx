import { Helmet } from 'react-helmet-async';
import { CONFIG } from 'src/config-global';
import { ProductManagementView } from './product-management-view';

// ----------------------------------------------------------------------

export default function ProductManagementPage() {
  return (
    <>
      <Helmet>
        <title> {`Product Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProductManagementView />
    </>
  );
}
