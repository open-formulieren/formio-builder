import enMessages from '../i18n/compiled/en.json';
import nlMessages from '../i18n/compiled/nl.json';

// Populate the messages object
const messages = {
  nl: nlMessages,
  en: enMessages,
};

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: 'en',
  locales: Object.keys(messages),
  messages,
  formats,
};
