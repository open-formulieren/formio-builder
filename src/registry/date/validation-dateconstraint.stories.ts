import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {within} from '@storybook/testing-library';

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
        datePicker: {
          showWeeks: true,
          startingDay: 0,
          initDate: '',
          minMode: 'day',
          maxMode: 'year',
          yearRows: 4,
          yearColumns: 5,
          minDate: null,
          maxDate: null,
        },
      },
    },
  },
  args: {
    constraint: 'minDate',
  },
  argTypes: {
    constraint: {
      options: ['minDate', 'maxDate'],
      control: {type: 'inline-radio'},
    },
  },
} as Meta<typeof DateConstraintValidation>;

type Story = StoryObj<typeof DateConstraintValidation>;

export const InitialState: Story = {};

export const FixedValue: Story = {
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          minDate: {
            mode: 'fixedValue',
          },
          maxDate: {mode: ''},
        },
        datePicker: {
          showWeeks: true,
          startingDay: 0,
          initDate: '',
          minMode: 'day',
          maxMode: 'year',
          yearRows: 4,
          yearColumns: 5,
          minDate: '2023-01-01',
          maxDate: null,
        },
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Fixed value')).toBeVisible();
    const datefield = await canvas.findByLabelText('Minimum date');
    expect(datefield).toBeVisible();
    expect(datefield).toHaveDisplayValue('2023-01-01');
  },
};

export const FutureOrPastIncludingToday: Story = {
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          minDate: {
            mode: 'future',
            includeToday: true,
          },
          maxDate: {mode: ''},
        },
        datePicker: {
          showWeeks: true,
          startingDay: 0,
          initDate: '',
          minMode: 'day',
          maxMode: 'year',
          yearRows: 4,
          yearColumns: 5,
          minDate: '2023-01-01',
          maxDate: null,
        },
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('In the future')).toBeVisible();
    const checkbox = await canvas.findByLabelText('Including today');
    expect(checkbox).toBeVisible();
    expect(checkbox).toBeChecked();
  },
};

export const RelativeToVariable: Story = {
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          minDate: {
            mode: 'relativeToVariable',
            delta: {
              years: null,
              months: null,
              days: null,
            },
            operator: 'add',
          },
          maxDate: {mode: ''},
        },
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('Relative to variable')).toBeVisible();
    const operator = await canvas.findByLabelText('Add/subtract duration');
    expect(operator).toBeVisible();
    expect(await canvas.findByText('Add')).toBeVisible();
  },
};
