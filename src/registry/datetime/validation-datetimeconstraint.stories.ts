import {Meta, StoryObj} from '@storybook/react-webpack5';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import DateTimeConstraintValidation from './validation';

export default {
  title: 'Builder components/DateTimeField/DateTimeConstraintValidation',
  component: DateTimeConstraintValidation,
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
} as Meta<typeof DateTimeConstraintValidation>;

type Story = StoryObj<typeof DateTimeConstraintValidation>;

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
          minDate: '2023-01-01T16:00',
          maxDate: null,
        },
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Expand the panel
    await userEvent.click(canvas.getByText(/date/));

    expect(await canvas.findByText('Fixed value')).toBeVisible();
    const datefield = await canvas.findByLabelText('Minimum date');
    expect(datefield).toBeVisible();
    expect(datefield).toHaveDisplayValue('2023-01-01T16:00');
  },
};

export const FutureOrPast: Story = {
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          minDate: {mode: 'future'},
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

    // Expand the panel
    await userEvent.click(canvas.getByText(/date/));

    expect(await canvas.findByText('In the future')).toBeVisible();
    const checkbox = canvas.queryByLabelText('Including today');
    expect(checkbox).not.toBeInTheDocument();
  },
};

export const RelativeToVariable: Story = {
  parameters: {
    formik: {
      initialValues: {
        openForms: {
          minDate: {
            mode: 'relativeToVariable',
            variable: 'now',
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

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expand the panel
    await userEvent.click(canvas.getByText(/date/));

    expect(await canvas.findByText('Relative to variable')).toBeVisible();

    await step('Configuring the operator', async () => {
      const operator = await canvas.findByLabelText('Add/subtract duration');
      expect(operator).toBeVisible();
      expect(await canvas.findByText('Add')).toBeVisible();
    });

    await step('Configuring the variable', async () => {
      const variableInput = await canvas.findByLabelText('Variable');
      expect(variableInput).toBeVisible();
      userEvent.clear(variableInput);
      await userEvent.type(variableInput, 'someOtherKey');
      expect(variableInput).toHaveDisplayValue('someOtherKey');
    });

    await step('Configuring the delta', async () => {
      const yearInput = await canvas.findByLabelText('Years');
      expect(yearInput).toBeVisible();
      await userEvent.type(yearInput, '3');
      expect(yearInput).toHaveValue(3);

      const monthInput = await canvas.findByLabelText('Months');
      expect(monthInput).toBeVisible();
      await userEvent.type(monthInput, '1');
      expect(monthInput).toHaveValue(1);

      const dayInput = await canvas.findByLabelText('Days');
      expect(dayInput).toBeVisible();
      await userEvent.type(dayInput, '0');
      expect(dayInput).toHaveValue(0);
    });
  },
};
