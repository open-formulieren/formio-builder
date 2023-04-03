const locales = ['en', 'nl'];

const messages = locales.reduce(
  (acc, lang) => ({
    ...acc,
    [lang]: {}, // TODO: define default messages?
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
