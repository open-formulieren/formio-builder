import {Meta, StoryObj} from '@storybook/react-vite';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import SimpleConditional from './simple-conditional';

const COMPONENT_TREE = [
  {type: 'textfield', key: 'text1', label: 'Textfield 1'},
  {type: 'currency', key: 'currency1', label: 'Currency 1'},
  {
    type: 'fieldset',
    key: 'fieldset1',
    label: 'Fieldset 1',
    components: [
      {type: 'textfield', key: 'text2', label: 'Textfield 2'},
      {type: 'number', key: 'nested.number1', label: 'Nested number'},
    ],
  },
];

export default {
  title: 'Formio/Builder/SimpleConditional',
  component: SimpleConditional,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 400,
    },
    modal: {noModal: true},
    builder: {enableContext: true},
    formik: {
      initialValues: {
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
      },
    },
  },
  args: {
    componentTree: COMPONENT_TREE,
  },
} satisfies Meta<typeof SimpleConditional>;

type Story = StoryObj<typeof SimpleConditional>;

export const Default: Story = {};

export const SelectATextComponent: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    let eqInput = canvas.queryByLabelText<HTMLInputElement>('Has the value');

    expect(eqInput).toBeNull();

    const showInput = canvas.getByLabelText('This component should display');
    await userEvent.click(showInput);
    await userEvent.keyboard('[ArrowDown]');
    await userEvent.click(canvas.getByText('True'));

    const whenInput = canvas.getByLabelText('When the form component');
    await userEvent.click(whenInput);
    await userEvent.keyboard('[ArrowDown]');
    await userEvent.click(canvas.getByText('Textfield 1 (text1)'));

    eqInput = canvas.queryByLabelText<HTMLInputElement>('Has the value');

    expect(eqInput).not.toBeNull();
    expect(eqInput!.type).toEqual('text');

    // find and click the clear button (x icon)
    const input = canvas.getByLabelText('When the form component');
    const container = input.closest('.formio-builder-select');
    const clearIcon = container!.querySelector(
      '.formio-builder-select__clear-indicator'
    ) as HTMLDivElement;
    await userEvent.click(clearIcon);

    eqInput = canvas.queryByLabelText('Has the value');

    expect(eqInput).toBeNull();
  },
};

export const SelectingANumberComponent: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const showInput = canvas.getByLabelText('This component should display');
    await userEvent.click(showInput);
    await userEvent.keyboard('[ArrowDown]');
    await userEvent.click(canvas.getByText('True'));

    const whenInput = canvas.getByLabelText('When the form component');
    await userEvent.click(whenInput);
    await userEvent.keyboard('[ArrowDown]');
    await userEvent.click(canvas.getByText('Nested number (nested.number1)'));

    const eqInput = canvas.queryByLabelText<HTMLInputElement>('Has the value');

    expect(eqInput).not.toBeNull();
    expect(eqInput!.type).toEqual('number');
  },
};

export const SelectingACurrencyComponent: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const showInput = canvas.getByLabelText('This component should display');
    await userEvent.click(showInput);
    await userEvent.keyboard('[ArrowDown]');
    await userEvent.click(canvas.getByText('True'));

    const whenInput = canvas.getByLabelText('When the form component');
    await userEvent.click(whenInput);
    await userEvent.keyboard('[ArrowDown]');
    await userEvent.click(canvas.getByText('Currency 1 (currency1)'));

    const eqInput = canvas.queryByLabelText<HTMLInputElement>('Has the value');

    expect(eqInput).not.toBeNull();
    expect(eqInput!.type).toEqual('number');
  },
};
