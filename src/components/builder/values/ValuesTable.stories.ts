import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import {withFormik} from '@/../.storybook/decorators';

import ValuesTable from './ValuesTable';

const ValuesTableComponent = ValuesTable<{
  values: Option[];
}>;

export default {
  title: 'Formio/Builder/ValuesTable',
  component: ValuesTableComponent,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {
      initialValues: {
        values: [
          {value: 'mediahaven', label: 'Mediahaven'},
          {value: 'keizersgracht', label: 'Keizersgracht'},
        ],
      },
    },
  },
  args: {
    name: 'values',
  },
  argTypes: {
    name: {table: {disable: true}},
  },
  tags: ['autodocs'],
} as Meta<typeof ValuesTableComponent>;

type Story = StoryObj<typeof ValuesTableComponent>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const optionLabels = canvas.getAllByRole('textbox', {name: 'Option label'});
    expect(optionLabels).toHaveLength(2);
    expect(optionLabels[0]).toHaveDisplayValue('Mediahaven');
    expect(optionLabels[1]).toHaveDisplayValue('Keizersgracht');

    const optionValues = canvas.getAllByRole('textbox', {name: 'Option value'});
    expect(optionValues).toHaveLength(2);
    expect(optionValues[0]).toHaveDisplayValue('mediahaven');
    expect(optionValues[1]).toHaveDisplayValue('keizersgracht');
  },
};

export const AddOption: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByRole('textbox', {name: 'Option label'})).toHaveLength(2);
    expect(canvas.getAllByRole('textbox', {name: 'Option value'})).toHaveLength(2);

    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    expect(canvas.getAllByRole('textbox', {name: 'Option label'})).toHaveLength(3);
    expect(canvas.getAllByRole('textbox', {name: 'Option value'})).toHaveLength(3);
  },
};

export const RemoveOption: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByRole('textbox', {name: 'Option label'})).toHaveLength(2);
    expect(canvas.getAllByRole('textbox', {name: 'Option value'})).toHaveLength(2);

    const removeButtons = canvas.getAllByRole('button', {name: 'Remove'});
    expect(removeButtons).toHaveLength(2);
    await userEvent.click(removeButtons[0]);

    const optionLabels = canvas.getAllByRole('textbox', {name: 'Option label'});
    expect(optionLabels).toHaveLength(1);
    expect(optionLabels[0]).toHaveDisplayValue('Keizersgracht');
    const optionValues = canvas.getAllByRole('textbox', {name: 'Option value'});
    expect(optionValues).toHaveLength(1);
    expect(optionValues[0]).toHaveDisplayValue('keizersgracht');
  },
};

export const ValueDerivedFromLabel: Story = {
  parameters: {
    formik: {
      initialValues: {
        values: [
          {
            value: '',
            label: '',
          },
        ],
      },
    },
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const label = canvas.getByLabelText('Option label');

    await step('Derive value from label when value is unset', async () => {
      await userEvent.type(label, 'The first option');

      expect(canvas.getByLabelText('Option value')).toHaveDisplayValue('theFirstOption');
    });

    await step('Clearing the label clears the derived value', async () => {
      await userEvent.clear(label);
      expect(canvas.getByLabelText('Option value')).toHaveDisplayValue('');
    });

    await step('Explicit value is not overwritten', async () => {
      const optionValue = canvas.getByLabelText('Option value');
      await userEvent.type(optionValue, 'explicit value');
      await userEvent.type(label, 'First option');
      expect(optionValue).toHaveDisplayValue('explicit value');
    });

    await step('Clearing the label does not clear the explicit value', async () => {
      await userEvent.clear(label);
      expect(canvas.getByLabelText('Option value')).toHaveDisplayValue('explicit value');
    });
  },
};

export const ReorderOptions: Story = {
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {
      initialValues: {
        values: [
          {value: 'mediahaven', label: 'Mediahaven'},
          {value: 'keizersgracht', label: 'Keizersgracht'},
          {value: 'sloterdijk', label: 'sloterdijk'},
        ],
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByRole('textbox', {name: 'Option label'})).toHaveLength(3);

    const middleUpButton = canvas.getAllByRole('button', {name: 'Move up'})[1];
    await userEvent.click(middleUpButton);

    const firstOptionLabel = canvas.getAllByRole('textbox', {name: 'Option label'})[0];
    expect(firstOptionLabel).toHaveDisplayValue('Keizersgracht');
  },
};
