import { IconButton, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import BaseButton from 'src/components/button/base-button/base-button';
import Column from 'src/components/common/column';
import FormInputText from 'src/components/input/form-input-text/form-input-text';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from 'src/store';
import { useNavigate } from 'react-router-dom';
import BaseIcon from 'src/components/svg/base-icon/base-icon';
import { useLanguage } from 'src/i18n/i18n';
import SizedBox from 'src/components/common/sized-box';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { loginAsync } from 'src/store/thunks/auth.thunk';
import { envConfig } from 'src/config/env.config';
import { selectAuthLoading } from 'src/store/selectors/auth.selectors';

interface IFormInput {
  email: string;
  password: string;
}

export default function LoginForm() {
  const lang = useLanguage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectAuthLoading);

  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required(lang('Login.PleaseEnterYourEmail'))
      .email(lang('Login.InvalidEmailFormat')),
    password: Yup.string()
      .min(6, lang('Login.PasswordMustBeAtLeast6Characters'))
      .required(lang('Login.PleaseEnterYourPassword')),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      //trienkhai@cxview.ai
      //trienkhai@CXView2024
      // marou.chocolate@cxview.ai
      // marou@CXView2025
      // gs25@cxview.ai
      // Gs25@CxView2025*#
      email:
        envConfig.ENVIRONMENT === 'development'
          ? 'marou.chocolate@cxview.ai'
          : '',
      password:
        envConfig.ENVIRONMENT === 'development' ? 'marou@CXView2025' : '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    dispatch(loginAsync({ request: data, navigate }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='login-form'>
      <Column alignItems='flex-start'>
        <FormInputText
          fullWidth
          label='Username'
          name='email'
          placeholder='Enter your email'
          control={control}
          errors={errors}
        />
        <SizedBox height={14} />
        <FormInputText
          fullWidth
          label='Password'
          name='password'
          placeholder='Enter your password'
          type={showPassword ? 'text' : 'password'}
          control={control}
          inputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge='end'
                >
                  <BaseIcon
                    size={18}
                    color='text.body'
                    src={
                      showPassword
                        ? ASSET_CONSTANT.SVG.IconEye
                        : ASSET_CONSTANT.SVG.IconUnhide
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          errors={errors}
        />
        <SizedBox height={24} />
        <BaseButton
          type='submit'
          fullWidth
          size='medium'
          variant='contained'
          text='Sign in'
          loading={isLoading}
        />
      </Column>
    </form>
  );
}
