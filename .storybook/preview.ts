import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';
import {Preview} from '@storybook/react';
import 'formiojs/dist/formio.builder.css';
import 'leaflet/dist/leaflet.css';

import {BuilderContextDecorator, ModalDecorator} from './decorators';
import {reactIntl} from './reactIntl';

const preview: Preview = {
  decorators: [BuilderContextDecorator, ModalDecorator],
  globals: {
    locale: reactIntl.defaultLocale,
    locales: {
      en: 'English',
      nl: 'Nederlands',
    },
  },
  parameters: {
    reactIntl,
    actions: {argTypesRegex: '^on[A-Z].*'},
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
