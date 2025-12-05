import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Use backend to load translations from public/locales
// You may need to move locales to public/ for production, but for dev src/locales works

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: false,
    backend: {
      loadPath: '/src/locales/{{lng}}.json'
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
