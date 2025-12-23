import { useTranslation, initReactI18next } from 'react-i18next';
import i18next from 'i18next';
import EN from './locales/en';
import VI from './locales/vn';

export enum CountryLanguage {
  'EN' = 'en',
  'VI' = 'vi',
}

const locale = localStorage.getItem('language');

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: [locale ? locale.toLowerCase() : `${CountryLanguage.EN}`],
  debug: false,
  resources: {
    en: {
      translation: EN,
    },
    vi: {
      translation: VI,
    },
  },
});

const useLanguage = () => {
  const { t } = useTranslation();
  return t;
};

const changeLanguage = (value: CountryLanguage) => {
  Lang.changeLanguage(value);
  localStorage.setItem('language', value);
};

const useI18n = () => {
  const { i18n } = useTranslation();
  return i18n;
};
export { useI18n, useLanguage, changeLanguage };

const Lang = i18next;

export default Lang;
