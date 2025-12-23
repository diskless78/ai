import { Typography } from '@mui/material';
import BaseButton from 'src/components/button/base-button/base-button';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import BaseTable from 'src/components/table/base-table/base-table';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import { mockProducts, type Product } from './_data';
import SizedBox from 'src/components/common/sized-box';
import BaseImage from 'src/components/image/image-network/base-image';
import BaseIconButton from 'src/components/button/button-icon/button-icon';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import { useRouter } from 'src/routes/hooks';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';
import { useLanguage } from 'src/i18n/i18n';
import { useState } from 'react';
import BaseDrawer from 'src/components/drawer/base-drawer/base-drawer';
import AddProductDrawer from './components/add-product-drawer';

export function ProductManagementView() {
  const lang = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <BaseDrawer title={lang('ColorCheck.AddNewProduct')} open={open}>
        <AddProductDrawer
          type={'edit'}
          data={null}
          onClose={() => setOpen(false)}
          onRefresh={() => {}}
        />
      </BaseDrawer>
      <DashboardContent disablePadding maxWidth={false}>
        <Column
          padding={`${pxToRem(12)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(20)}`}
        >
          <Row
            alignItems='center'
            justifyContent='space-between'
            py={pxToRem(5)}
          >
            <Typography variant='h3'>
              {lang('ColorCheck.ProductManagement')} (64)
            </Typography>
            <Row gap={pxToRem(8)}>
              <BaseButton
                size='medium'
                variant='contained'
                color='secondary'
                text={lang('ColorCheck.CategoryAndProductTypeManagement')}
                onClick={() => router.push(ROUTES_CONSTANT.PRODUCT_CATEGORY)}
              />
              <BaseButton
                size='medium'
                variant='contained'
                text={lang('ColorCheck.AddNewProduct')}
                onClick={() => setOpen(true)}
                iconLeft={
                  <BaseIcon
                    size={24}
                    src={ASSET_CONSTANT.SVG.IconLinearPlus}
                    color='white'
                  />
                }
              />
            </Row>
          </Row>
          <SizedBox height={8} />
          <BaseAccordion>
            <BaseTable<Product>
              heightRow={60}
              placeholder={lang('ColorCheck.NoActivityYet')}
              headersTable={[
                {
                  title: lang('ColorCheck.DateTime'),
                  field: 'createdAt',
                  align: 'center',
                },
                {
                  title: lang('ColorCheck.SKU'),
                  field: 'productCode',
                  align: 'center',
                },
                {
                  title: lang('ColorCheck.ProductName'),
                  field: 'productName',
                  align: 'center',
                },
                {
                  title: lang('ColorCheck.Category'),
                  field: 'category',
                  align: 'center',
                },
                {
                  title: lang('ColorCheck.WoodType'),
                  field: 'woodType',
                  align: 'center',
                },
                {
                  title: lang('ColorCheck.ProductImage'),
                  field: 'imageUrl',
                  align: 'center',
                  renderItem: (item) => {
                    return (
                      <Row justifyContent='center'>
                        <BaseImage
                          width={42}
                          height={42}
                          src={item.imageUrl}
                          borderRadius={2}
                        />
                      </Row>
                    );
                  },
                },
                {
                  title: lang('ColorCheck.Activity'),
                  field: 'id',
                  align: 'center',
                  renderItem: () => (
                    <Row
                      gap={pxToRem(8)}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <BaseButton
                        text={lang('ColorCheck.View')}
                        size='small'
                        color='secondary'
                        onClick={() => {}}
                      />
                      <BaseIconButton size='small' color='red'>
                        <BaseIcon
                          src={ASSET_CONSTANT.SVG.IconLinearTrash}
                          size={24}
                          color='red.70'
                        />
                      </BaseIconButton>
                    </Row>
                  ),
                },
              ]}
              data={{
                items: mockProducts ?? [],
                page: 1,
                page_size: 10,
                total: 0,
                is_full: false,
              }}
              onChangePaging={() => {}}
            />
          </BaseAccordion>
        </Column>
      </DashboardContent>
    </>
  );
}
