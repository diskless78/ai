import { Typography } from '@mui/material';
import BaseButton from 'src/components/button/base-button/base-button';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import BaseTable from 'src/components/table/base-table/base-table';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { DashboardContent } from 'src/layouts/dashboard/main';
import { pxToRem } from 'src/theme/styles';
import SizedBox from 'src/components/common/sized-box';
import BaseIconButton from 'src/components/button/button-icon/button-icon';
import {
  mockProductCategories,
  mockWoodTypes,
  type ProductCategory,
  type WoodType,
} from './_data';
import { BaseAccordion } from 'src/components/common/base-accordion/base-accordion';
import BaseBreadcrumb from 'src/components/common/base-breadcrumb';
import { ROUTES_CONSTANT } from 'src/constants/routes.constant';
import { useLanguage } from 'src/i18n/i18n';

export function ProductCategoryView() {
  const lang = useLanguage();

  return (
    <DashboardContent disablePadding maxWidth={false}>
      <Column
        padding={`${pxToRem(12)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(20)}`}
      >
        <Row alignItems='center' justifyContent='space-between' py={pxToRem(5)}>
          <BaseBreadcrumb
            items={[
              {
                title: `${lang('ColorCheck.ProductManagement')} (64)`,
                path: ROUTES_CONSTANT.HOME,
              },
              { title: lang('ColorCheck.CategoryAndProductTypeManagement') },
            ]}
          />
        </Row>
        <SizedBox height={8} />
        <Row gap={pxToRem(24)}>
          <BaseAccordion flex={1} gap={pxToRem(16)}>
            <Row alignItems='center' justifyContent='space-between'>
              <Typography variant='h5' color='neutral.999'>
                {lang('ColorCheck.Category')} ({mockProductCategories?.length})
              </Typography>
              <BaseButton
                size='small'
                variant='contained'
                text={lang('ColorCheck.AddCategory')}
                onClick={() => {}}
                iconLeft={
                  <BaseIcon
                    size={20}
                    src={ASSET_CONSTANT.SVG.IconLinearPlus}
                    color='white'
                  />
                }
              />
            </Row>
            <BaseTable<ProductCategory>
              showIndex
              heightRow={60}
              headersTable={[
                {
                  title: lang('ColorCheck.Category'),
                  field: 'name',
                  align: 'center',
                  width: 'auto',
                },
                {
                  title: lang('ColorCheck.Activity'),
                  field: 'id',
                  align: 'center',
                  width: 120,
                  renderItem: () => (
                    <Row
                      gap={pxToRem(10)}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <BaseIconButton size='small' color='grey'>
                        <BaseIcon
                          src={ASSET_CONSTANT.SVG.IconLinearEdit}
                          size={24}
                          color='neutral.80'
                        />
                      </BaseIconButton>
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
                items: mockProductCategories ?? [],
                page: 1,
                page_size: 10,
                total: 0,
                is_full: false,
              }}
              onChangePaging={() => {}}
            />
          </BaseAccordion>
          <BaseAccordion flex={1} gap={pxToRem(16)}>
            <Row alignItems='center' justifyContent='space-between'>
              <Typography variant='h5' color='neutral.999'>
                {lang('ColorCheck.WoodType')} ({mockWoodTypes?.length})
              </Typography>
              <BaseButton
                size='small'
                variant='contained'
                text={lang('ColorCheck.AddCategory')}
                onClick={() => {}}
                iconLeft={
                  <BaseIcon
                    size={20}
                    src={ASSET_CONSTANT.SVG.IconLinearPlus}
                    color='white'
                  />
                }
              />
            </Row>
            <BaseTable<WoodType>
              showIndex
              heightRow={60}
              headersTable={[
                {
                  title: lang('ColorCheck.Category'),
                  field: 'name',
                  align: 'center',
                  width: 'auto',
                },
                {
                  title: lang('ColorCheck.Activity'),
                  field: 'id',
                  align: 'center',
                  width: 120,
                  renderItem: () => (
                    <Row
                      gap={pxToRem(10)}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <BaseIconButton size='small' color='grey'>
                        <BaseIcon
                          src={ASSET_CONSTANT.SVG.IconLinearEdit}
                          size={24}
                          color='neutral.80'
                        />
                      </BaseIconButton>
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
                items: mockWoodTypes ?? [],
                page: 1,
                page_size: 10,
                total: 0,
                is_full: false,
              }}
              onChangePaging={() => {}}
            />
          </BaseAccordion>
        </Row>
      </Column>
    </DashboardContent>
  );
}
