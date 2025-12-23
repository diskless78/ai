import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Grid,
  Link,
  IconButton,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import FormInputText from 'src/components/input/form-input-text/form-input-text';
import { pxToRem } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import FormPanel from 'src/components/card/form-panel/form-panel';
import { DashboardContent } from 'src/layouts/dashboard/main';
import Column from 'src/components/common/column';
import BaseBreadcrumb from 'src/components/common/base-breadcrumb';
import { FEATURE } from 'src/constants/feature-constant';
import BaseButton from 'src/components/button/base-button/base-button';
import Row from 'src/components/common/row';

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  accountName: string;
  password: string;
}

const roles = [
  'Administrator',
  'Administrator',
  'Administrator',
  'Administrator',
];

export function UserDetailView() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      fullName: 'Đoàn Trọng Nghĩa',
      phoneNumber: '0936435632',
      email: 'nghia.doantrong@cx-view.ai',
      accountName: 'Joseph Doan',
      password: '',
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([0, 2]);
  const handleAutoGeneratePassword = () => {
    const generatedPassword = Math.random().toString(36).slice(-12);
    setValue('password', generatedPassword);
  };
  const handleToggleRole = (index: number) => {
    setSelectedRoles((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const handleSelectAll = () => {
    if (selectedRoles.length === roles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles.map((_, index) => index));
    }
  };
  return (
    <DashboardContent disablePadding maxWidth={false}>
      <Column
        padding={`${pxToRem(16)} ${pxToRem(16)} ${pxToRem(20)} ${pxToRem(16)}`}
        gap={pxToRem(20)}
      >
        <Row alignItems='center' justifyContent='space-between'>
          <BaseBreadcrumb
            items={[
              {
                title: FEATURE.USER_MANAGEMENT.title,
                path: FEATURE.USER_MANAGEMENT.path,
              },
              {
                title: FEATURE.CREATE_USER.title,
                path: FEATURE.CREATE_USER.path,
              },
            ]}
          />
          <Row gap={pxToRem(12)}>
            <BaseButton
              text='Cancel'
              size='medium'
              color='secondary'
              //onClick={handleCancel}
            />
            <BaseButton
              text='Save'
              size='medium'
              color='primary'
              //onClick={handleSubmit(onSubmit)}
            />
          </Row>
        </Row>
        <FormPanel title='Information'>
          <Grid container rowSpacing={pxToRem(12)} columnSpacing={pxToRem(20)}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormInputText
                name='fullName'
                label='Full name'
                control={control}
                errors={errors}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormInputText
                name='phoneNumber'
                label='Phone number'
                control={control}
                errors={errors}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormInputText
                required
                name='email'
                label='Email'
                control={control}
                errors={errors}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormInputText
                required
                name='accountName'
                label='Account name'
                control={control}
                errors={errors}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative' }}>
                <FormInputText
                  required
                  name='password'
                  label='Password'
                  // label={
                  //   <Box
                  //     sx={{
                  //       display: 'flex',
                  //       alignItems: 'center',
                  //       gap: pxToRem(8),
                  //     }}
                  //   >
                  //     Password
                  //     <Link
                  //       component='button'
                  //       variant='b3Regular'
                  //       onClick={handleAutoGeneratePassword}
                  //       sx={{
                  //         color: 'blue.60',
                  //         textDecoration: 'none',
                  //         cursor: 'pointer',
                  //         '&:hover': {
                  //           textDecoration: 'underline',
                  //         },
                  //       }}
                  //     >
                  //       Auto Generate
                  //     </Link>
                  //   </Box>
                  // }
                  type={showPassword ? 'text' : 'password'}
                  control={control}
                  errors={errors}
                  fullWidth
                  inputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge='end'
                        size='small'
                      >
                        <Iconify
                          icon={showPassword ? 'mdi:eye-off' : 'mdi:eye'}
                          width={20}
                        />
                      </IconButton>
                    ),
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </FormPanel>
        {/* Role Panel */}
        <FormPanel
          title='Role'
          messageError='This field is required'
          action={
            <Link
              component='button'
              variant='b3Regular'
              onClick={handleSelectAll}
              sx={{
                color: 'blue.60',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Select all
            </Link>
          }
        >
          <Grid container spacing={1}>
            {roles.map((role, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRoles.includes(index)}
                      onChange={() => handleToggleRole(index)}
                      sx={{
                        color: 'neutral.40',
                        '&.Mui-checked': {
                          color: 'blue.60',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant='b3Regular' color='neutral.80'>
                      {role}
                    </Typography>
                  }
                />
              </Grid>
            ))}
          </Grid>
        </FormPanel>
      </Column>
    </DashboardContent>
  );
}
