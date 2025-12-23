import { useTheme, Typography, Box } from '@mui/material';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Column from 'src/components/common/column';
import Row from 'src/components/common/row';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { pxToRem } from 'src/theme/styles';
import { SvgColor } from '../svg/svg-color';

type Props = {
  onFileSelected: (file: File | null) => void;
};

const FileDropzone: React.FC<Props> = ({ onFileSelected }) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 4 * 1024 * 1024, // 4MB
    multiple: false,
    accept: {
      'image/*': [],
    },
  });

  function formatBytes(bytes: number): string {
    const KB = 1024;
    const MB = KB * 1024;

    if (bytes >= MB) {
      return `${(bytes / MB).toFixed(2)} MB`;
    }
    if (bytes >= KB) {
      return `${(bytes / KB).toFixed(2)} KB`;
    }
    return `${bytes} B`;
  }

  return (
    <Column
      {...getRootProps()}
      justifyContent='space-between'
      sx={{
        borderRadius: pxToRem(12),
        backgroundColor: theme.palette.neutral[10],
        ':hover': {
          cursor: 'pointer',
        },
      }}
    >
      <Column alignItems='center' padding={pxToRem(34)} gap={pxToRem(12)}>
        <input {...getInputProps()} />
        <Box
          sx={{
            width: pxToRem(48),
            height: pxToRem(48),
            borderRadius: pxToRem(48),
            backgroundColor: theme.palette.neutral.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgColor
            color='blue.50'
            src={ASSET_CONSTANT.SVG.IconLinearImport}
            width={24}
            height={24}
          />
        </Box>
        <Column gap={pxToRem(4)} alignItems='center'>
          <Typography variant='t3SemiBold' color='neutral.100'>
            Kéo thả vào đây hoặc nhấn để tải lên
          </Typography>
          <Typography variant='b4Regular' color='neutral.70'>
            Chấp nhận JPG, PNG, dung lượng tối đa 10 MB
          </Typography>
        </Column>
        {selectedFile && (
          <Row
            width='100%'
            alignItems='center'
            gap={pxToRem(8)}
            padding={pxToRem(8)}
            sx={{
              // backgroundColor: theme.palette.background.tabprimary,
              borderRadius: pxToRem(12),
            }}
          >
            <img
              src={URL.createObjectURL(selectedFile)}
              width={36}
              height={36}
              alt=''
              style={{ borderRadius: pxToRem(3), objectFit: 'cover' }}
            />
            <Column>
              <Typography variant='body2'>{selectedFile.name}</Typography>
              <Typography variant='t3SemiBold'>
                {formatBytes(selectedFile.size)}
              </Typography>
            </Column>
          </Row>
        )}
      </Column>
    </Column>
  );
};

export default FileDropzone;
