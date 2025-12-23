import BaseButton from 'src/components/button/base-button/base-button';
import Row from 'src/components/common/row';
import { pxToRem } from 'src/theme/styles';

export interface ToolbarDrawerProps {
  textCancel?: string;
  textSubmit?: string;
  onCancel?: () => void;
  onAccept?: () => void;
  disabled?: boolean;
}

export default function ToolbarDrawer({
  textCancel = 'Cancel',
  textSubmit,
  onCancel,
  onAccept,
  disabled,
}: ToolbarDrawerProps) {
  return (
    <Row
      sx={{
        height: pxToRem(74),
        bgcolor: 'background.section',
        borderTopColor: 'input.background',
        paddingLeft: pxToRem(12),
        paddingRight: pxToRem(12),
        backdropFilter: 'blur(60px)',
      }}
      alignItems='center'
      justifyContent='end'
      gap={pxToRem(12)}
    >
      <BaseButton
        width={pxToRem(120)}
        size='medium'
        variant='outlined'
        text={textCancel}
        onClick={onCancel}
      />
      {textSubmit && (
        <BaseButton
          width={pxToRem(120)}
          size='medium'
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
