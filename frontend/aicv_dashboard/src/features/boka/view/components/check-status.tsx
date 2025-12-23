import { SvgColor } from 'src/components/svg/svg-color';
import TagContained from 'src/components/tag/tag-contained/tag-contained';
import { ASSET_CONSTANT } from 'src/constants/asset.constant';
import { useLanguage } from 'src/i18n/i18n';

type Props = {
  action: string;
};

export function CheckStatus({ action }: Props) {
  const lang = useLanguage();
  if (action === 'pass')
    return (
      <TagContained
        label={lang('ColorCheck.Pass')}
        textColor='success'
        backgroundColor='inherit'
        iconLeft={
          <SvgColor
            src={ASSET_CONSTANT.SVG.IconSuccess}
            width={20}
            height={20}
            color='#009951'
          />
        }
      />
    );
  else if (action === 'recheck')
    return (
      <TagContained
        label={lang('ColorCheck.ReCheck')}
        textColor='warning'
        backgroundColor='inherit'
        hasBorder
        iconLeft={
          <SvgColor
            src={ASSET_CONSTANT.SVG.IconWarning}
            width={20}
            height={20}
            color='#CD7E0E'
          />
        }
      />
    );
  else if (action === 'fail')
    return (
      <TagContained
        label={lang('ColorCheck.Fail')}
        textColor='error'
        backgroundColor='inherit'
        hasBorder
        iconLeft={
          <SvgColor
            src={ASSET_CONSTANT.SVG.IconError}
            width={20}
            height={20}
            color='#D92C2C'
          />
        }
      />
    );
}
