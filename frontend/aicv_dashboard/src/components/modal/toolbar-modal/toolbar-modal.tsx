import BaseButton from 'src/components/button/base-button/base-button';
import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';

export interface ToolbarModalProps {
  textCancel?: string;
  textSubmit?: string;
  onCancel?: () => void;
  onAccept?: () => void;
  disabled?: boolean;
}

export default function ToolbarModal({
  textCancel = 'Cancel',
  textSubmit,
  onCancel,
  onAccept,
  disabled,
}: ToolbarModalProps) {
  return (
    <Row
      sx={{
        height: pxToRem(52),
        borderTop: '1px solid',
        borderTopColor: 'grey.200',
        paddingLeft: pxToRem(12),
        paddingRight: pxToRem(12),
        backdropFilter: 'blur(60px)',
        boxShadow: '0px -5px 32px 0px #0000001F',
        marginLeft: pxToRem(-4),
        marginRight: pxToRem(-4),
        marginBottom: pxToRem(-4),
        borderBottomLeftRadius: pxToRem(12),
        borderBottomRightRadius: pxToRem(12),
      }}
      alignItems='center'
      justifyContent='end'
      gap={pxToRem(12)}
    >
      <BaseButton
        width={pxToRem(120)}
        size='small'
        variant='contained'
        color='secondary'
        text={textCancel}
        onClick={onCancel}
      />
      {textSubmit && (
        <BaseButton
          width={pxToRem(120)}
          size='small'
          variant='contained'
          text={textSubmit}
          type={onAccept ? 'button' : 'submit'}
          disabled={disabled}
          onClick={onAccept}
        />
      )}
    </Row>
  );
}
