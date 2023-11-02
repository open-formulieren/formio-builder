import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';

import {withFormik} from '@/../.storybook/decorators';

import ValuesTable from './ValuesTable';

export default {
  title: 'Formio/Builder/ValuesTable',
  component: ValuesTable,
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
} as Meta<typeof ValuesTable>;

type Story = StoryObj<typeof ValuesTable>;

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
