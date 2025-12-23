import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';
import Column from 'src/components/common/column';
import { useLanguage } from 'src/i18n/i18n';

interface ProductDetailCardProps {
  imageUrl: string;
  productCode: string;
  productName: string;
  category: string;
  productType: string;
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  imageUrl,
  productCode,
  productName,
  category,
  productType,
}) => {
  const theme = useTheme();
  const lang = useLanguage();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: pxToRem(6),
        overflow: 'hidden',
        bgcolor: theme.palette.neutral[10],
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Product Image */}
      <Box
        sx={{
          flex: 1,
          width: '100%',
          position: 'relative',
        }}
      >
        <Box
          component='img'
          src={imageUrl}
          alt={productName}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: pxToRem(6),
          }}
        />
      </Box>

      {/* Product Info */}
      <Column
        height={pxToRem(183)}
        sx={{
          padding: `${pxToRem(11)} ${pxToRem(6)} ${pxToRem(8)} ${pxToRem(6)}`,
        }}
      >
        {[
          { label: lang('ColorCheck.SKU'), value: productCode },
          { label: lang('ColorCheck.ProductName'), value: productName },
          { label: lang('ColorCheck.Category'), value: category },
          { label: lang('ColorCheck.WoodType'), value: productType },
        ].map((item, index) => (
          <Row
            key={index}
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: pxToRem(8),
              paddingBottom: pxToRem(12),
              marginX: pxToRem(8),
              borderBottom:
                index !== 3 ? `1px solid ${theme.palette.neutral[30]}` : 'none',
            }}
          >
            <Typography variant='t3Bold' color='neutral.999'>
              {item.label}
            </Typography>
            <Typography variant='b3Regular' color='neutral.999'>
              {item.value}
            </Typography>
          </Row>
        ))}
      </Column>
    </Paper>
  );
};

export default ProductDetailCard;
