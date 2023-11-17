import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

import ValuesSrc from './values-src';

export default {
  title: 'Formio/Builder/Values/ValuesSrc',
  component: ValuesSrc,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {
      initialValues: {
        openForms: {
          dataSrc: '',
        },
      },
    },
  },
  tags: ['autodocs'],
} as Meta<typeof ValuesSrc>;

type Story = StoryObj<typeof ValuesSrc>;

export const Default: Story = {};
