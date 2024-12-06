import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções
import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

i18n
  .use(LanguageDetector) // Detecta o idioma do navegador
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      es: { translation: es },
    },
    fallbackLng: 'en', // Idioma padrão
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
