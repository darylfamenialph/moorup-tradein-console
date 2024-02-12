/* eslint-disable react-hooks/exhaustive-deps */
import { LoaderContainer, Tab, Tabs, useProduct } from '@tradein-admin/libs';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { EditProductDetails } from './edit-product';
import { EditProductVariant } from './edit-product-variant';

export function EditProductPage() {
  const {
    state,
    getProduct,
    getProductTypes,
    getProductStatuses,
    clearProduct,
  } = useProduct();
  const { product, isFetchingProduct, isUpdatingProduct } = state;

  const location = useLocation();
  const parts = location.pathname.split('/');
  const productId = parts[parts.length - 1];

  const shouldRun = useRef(true);

  useEffect(() => {
    if (shouldRun.current) {
      getProduct(productId);
      getProductTypes();
      getProductStatuses();
      shouldRun.current = false;
    }

    return () => {
      clearProduct({});
    };
  }, []);

  return (
    <LoaderContainer
      color="#01463a"
      loading={isFetchingProduct || isUpdatingProduct}
      title="Edit Product"
    >
      <Tabs>
        <Tab label="Details">
          <EditProductDetails productData={product} />
        </Tab>
        <Tab label="Variants">
          <EditProductVariant productData={product} />
        </Tab>
      </Tabs>
    </LoaderContainer>
  );
}
