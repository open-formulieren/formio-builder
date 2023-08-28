import withFormik from '@bbbtech/storybook-formik';
import {Meta, StoryFn} from '@storybook/react';
import React from 'react';

import {TextField} from '.';
import DataMap from './datamap';

export default {
  title: 'Formio/Components/DataMap',
  component: DataMap,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 400,
    },
  },
  args: {
    name: 'f1Drivers',
    keyLabel: 'Number',
    f1Drivers: {
      33: 'VER',
      11: 'PER',
      44: 'HAM',
      63: 'RUS',
    },
  },
} as Meta<typeof DataMap>;

const Template: StoryFn<typeof DataMap> = args => (
  <DataMap {...args} valueComponent={<TextField name="driver" label="Driver" />} />
);

export const Default = {
  render: Template,
};
