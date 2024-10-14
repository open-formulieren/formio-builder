import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';
import {Preview} from '@storybook/react';
import 'formiojs/dist/formio.builder.css';
import 'leaflet/dist/leaflet.css';
import '@/jsonEditor.scss';

import {BuilderContextDecorator, ModalDecorator} from './decorators';
import {reactIntl} from './reactIntl';

const preview: Preview = {
  decorators: [BuilderContextDecorator, ModalDecorator],
  parameters: {
    reactIntl,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Public API',
          'Edit form',
          'Generic',
          'Formio',
          'Builder components',
      ],
      }
    }
  },
  initialGlobals: {
    locale: reactIntl.defaultLocale,
    locales: {
      en: 'English',
      nl: 'Nederlands',
    },
  },
};

export default preview;
