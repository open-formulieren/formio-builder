import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {expect, userEvent, waitFor, within} from '@storybook/test';

import {withFormik} from '@/sb-decorators';

import ValidatorPluginSelect, {ValidatorOption} from './validator-select';

const DEFAULT_VALIDATOR_PLUGINS: ValidatorOption[] = [
  {id: 'plugin-1', label: 'Plugin 1'},
  {id: 'plugin-2', label: 'Plugin 2'},
];

export default {
  title: 'Formio/Builder/Validation/ValidatorPluginSelect',
  component: ValidatorPluginSelect,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    builder: {enableContext: true, validatorPluginsDelay: 300},
    formik: {initialValues: {validate: {plugins: []}}},
  },
  args: {
    validatorPlugins: DEFAULT_VALIDATOR_PLUGINS,
  },
} as Meta<typeof ValidatorPluginSelect>;

type Story = StoryObj<typeof ValidatorPluginSelect>;

const Template: StoryFn<typeof ValidatorPluginSelect> = () => <ValidatorPluginSelect />;

export const Default: Story = {
  render: Template,

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Plugin(s)');

    await waitFor(
      async () => {
        await userEvent.keyboard('[Esc]');
        input.focus();
        await userEvent.keyboard('[ArrowDown]');
        expect(canvas.getByText('Plugin 1')).toBeInTheDocument();
      },
      {timeout: 1500, container: canvasElement}
    );
    expect(canvas.getByText('Plugin 2')).toBeInTheDocument();
  },
};
