import { useEffect, useRef, useState } from 'react';
import BaseToggle from 'src/components/controls/base-toggle';
import { changeLanguage, CountryLanguage } from 'src/i18n/i18n';

export function LanguageToggle() {
  const controlRef = useRef<HTMLDivElement | null>(null);
  const enRef = useRef<HTMLDivElement | null>(null);
  const vnRef = useRef<HTMLDivElement | null>(null);

  const [defaultIndex, setDefaultIndex] = useState<number | null>(null);

  useEffect(() => {
    const locale = localStorage.getItem('language')?.toLowerCase() || 'en';
    setDefaultIndex(locale === 'en' ? 0 : 1);
  }, []);

  if (defaultIndex === null) return null; // tránh render sớm khi chưa có ngôn ngữ

  return (
    <BaseToggle
      name='language-toggle'
      size='small'
      defaultIndex={defaultIndex}
      controlRef={controlRef}
      callback={(val) => {
        changeLanguage(val as CountryLanguage);
      }}
      segments={[
        { label: 'EN', value: 'en', ref: enRef },
        { label: 'VN', value: 'vi', ref: vnRef },
      ]}
    />
  );
}

export default LanguageToggle;
