const locales = ['en', 'nl'];

const messages = locales.reduce(
  (acc, lang) => ({
    ...acc,
    [lang]: require(`../i18n/compiled/${lang}.json`),
  }),
  {}
);

const formats = {}; // optional, if you have any formats

export const reactIntl = {
  defaultLocale: 'en',
  locales,
  messages,
  formats,
};
