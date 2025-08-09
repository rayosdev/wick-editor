import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal i18n configuration to get the app running
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Add basic translations here if needed
        }
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 