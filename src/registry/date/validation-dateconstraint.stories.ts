import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

import DateConstraintValidation from './validation';

export default {
  title: 'Builder components/DateField/DateConstraintValidation',
  component: DateConstraintValidation,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {
      initialValues: {
        openForms: {
          minDate: {mode: ''},
          maxDate: {mode: ''},
        },
      },
    },
  },
  args: {
    constraint: 'minDate',
  },
} as Meta<typeof DateConstraintValidation>;

type Story = StoryObj<typeof DateConstraintValidation>;

export const Default: Story = {};
