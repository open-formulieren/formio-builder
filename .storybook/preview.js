import 'bootstrap/dist/css/bootstrap.min.css';
import 'formiojs/dist/formio.builder.css';

import {ModalDecorator} from './decorators';
import {reactIntl} from './reactIntl';

export const parameters = {
  reactIntl,
  locale: reactIntl.defaultLocale,
  locales: {
    en: 'English',
    nl: 'Nederlands',
  },
  actions: {argTypesRegex: '^on[A-Z].*'},
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [ModalDecorator];
