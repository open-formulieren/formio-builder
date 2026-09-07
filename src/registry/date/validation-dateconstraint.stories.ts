import type {DateComponentSchema} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

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
          minDate: null,
          maxDate: null,
        } satisfies DateComponentSchema['datePicker'],
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
} satisfies Meta<typeof DateConstraintValidation>;

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
          minDate: '2023-01-01',
          maxDate: null,
        } satisfies DateComponentSchema['datePicker'],
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
          minDate: '2023-01-01',
          maxDate: null,
        } satisfies DateComponentSchema['datePicker'],
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Expand the panel
    await userEvent.click(canvas.getByText(/date/));

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
