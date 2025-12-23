import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { StyledBaseCheckbox } from './styles';
import SvgImage from '../svg/svg-image/svg-image';

type Props = {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
};

export default function BaseCheckbox({ checked, disabled, onChange }: Props) {
  return (
    <StyledBaseCheckbox
      icon={
        <SvgImage
          src={ASSET_CONSTANT.SVG.CheckboxUnCheck}
          width={18}
          height={18}
        />
      }
      checkedIcon={
        <SvgImage
          src={ASSET_CONSTANT.SVG.CheckboxCheck}
          width={18}
          height={18}
        />
      }
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
  );
}
