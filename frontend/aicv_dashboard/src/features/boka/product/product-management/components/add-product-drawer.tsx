import { Typography } from '@mui/material';
import { useForm, type SubmitHandler } from 'react-hook-form';
import Column from 'src/components/common/column';
import SizedBox from 'src/components/common/sized-box';
import { pxToRem } from 'src/theme/styles';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormInputSelect from 'src/components/input/form-input-select/form-input-select';
import FormInputText from 'src/components/input/form-input-text/form-input-text';
import { useEffect } from 'react';
import BodyDrawer from 'src/components/drawer/body-drawer/body-drawer';
import { useLanguage } from 'src/i18n/i18n';
import FileDropzone from 'src/components/controls/file-drop-zone';

interface IFormInput {
  id?: string;
  name: string;
  link_rtsp: string;
  status: string;
  is_save_playback: string;
}

interface Props {
  data?: any;
  type: 'create' | 'edit';
  onClose?: () => void;
  onRefresh?: () => void;
}

export default function AddProductDrawer({
  data,
  type,
  onClose,
  // onRefresh,
}: Props) {
  const lang = useLanguage();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .nullable()
      .required(`Please do not leave this field blank`),
    link_rtsp: Yup.string()
      .nullable()
      .required(`Please do not leave this field blank`),
    status: Yup.string()
      .nullable()
      .required(`Please do not leave this field blank`),
    is_save_playback: Yup.string()
      .nullable()
      .required(`Please do not leave this field blank`),
  });

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      id: '',
      name: '',
      link_rtsp: '',
      status: '',
      is_save_playback: '',
    },
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      setValue('id', data.id || '');
      setValue('name', data.name || '');
      setValue('link_rtsp', data.link_rtsp || '');
      setValue('status', data.status || '');
      setValue(
        'is_save_playback',
        data.is_save_playback != null ? data.is_save_playback?.toString() : ''
      );
    }
  }, [data, setValue]);

  const onSubmit: SubmitHandler<IFormInput> = async () => {};

  return (
    <BodyDrawer
      onSubmit={handleSubmit(onSubmit)}
      textCancel='Cancel'
      textSubmit={
        type === 'create' ? lang('Common.Create') : lang('Common.Update')
      }
      onCancel={() => {
        onClose && onClose();
      }}
    >
      <Column
        padding={`${pxToRem(20)} ${pxToRem(20)} ${pxToRem(20)} ${pxToRem(20)}`}
      >
        <Typography variant='t3Bold' color='neutral.100'>
          {lang('ColorCheck.ProductImage')}
        </Typography>
        <SizedBox height={12} />
        <FileDropzone onFileSelected={(file) => console.log(file)} />
        <SizedBox height={20} />
        <Typography variant='t3Bold' color='neutral.100'>
          {lang('ColorCheck.InformationProduct')}
        </Typography>
        <SizedBox height={12} />
        <FormInputText
          required
          fullWidth
          label={lang('ColorCheck.SKU')}
          name='code'
          placeholder={lang('ColorCheck.TypeSKU')}
          control={control}
          errors={errors}
        />
        <SizedBox height={12} />
        <FormInputText
          required
          fullWidth
          label={lang('ColorCheck.ProductName')}
          name='name'
          placeholder={lang('ColorCheck.TypeProductName')}
          control={control}
          errors={errors}
        />
        <SizedBox height={12} />
        <FormInputSelect
          fullWidth
          name='category'
          control={control}
          required
          label={lang('ColorCheck.Category')}
          placeholder={lang('ColorCheck.SelectProductCategory')}
          list={[]}
          errors={errors}
        />
        <SizedBox height={12} />
        <FormInputSelect
          fullWidth
          name='woodType'
          control={control}
          required
          label={lang('ColorCheck.WoodType')}
          placeholder={lang('ColorCheck.SelectProductType')}
          list={[]}
          errors={errors}
        />
        <SizedBox height={12} />
        <FormInputText
          required
          fullWidth
          name='note'
          label={lang('ColorCheck.Note')}
          placeholder={lang('ColorCheck.TypeYourNoteHere')}
          control={control}
          errors={errors}
        />
      </Column>
    </BodyDrawer>
  );
}
