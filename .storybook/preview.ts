import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/css/v4-shims.css';
import {Preview} from '@storybook/react';
import 'formiojs/dist/formio.builder.css';
import 'react-tooltip/dist/react-tooltip.css';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
// @ts-ignore
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import iconUrl from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

import {BuilderContextDecorator, ModalDecorator} from './decorators';
import {reactIntl} from './reactIntl';

/**
 * fix leaflet images import - https://github.com/Leaflet/Leaflet/issues/4968
 * @return {Void}
 */
const fixIconUrls = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  // the call to `require` ensures that the static assets are bundled along (or, for small
  // images, inlined as base64)
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
  });
};

fixIconUrls();

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
