import {expect} from '@storybook/jest';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {userEvent, waitFor, within} from '@storybook/testing-library';

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
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 200,
    },
    modal: {noModal: true},
    builder: {enableContext: true, validatorPluginsDelay: 1000},
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

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Plugin(s)');

    // open the dropdown
    input.focus();
    await userEvent.keyboard('[ArrowDown]');

    await step('Loading items from backend', async () => {
      await waitFor(
        async () => {
          await expect(canvas.queryByText('Loading...')).toBeNull();
        },
        {timeout: 1500}
      );
    });

    await step('Check available options displayed', async () => {
      // assert the options are present
      await expect(await canvas.findByText('Plugin 1')).toBeInTheDocument();
      await expect(await canvas.findByText('Plugin 2')).toBeInTheDocument();
    });
  },
};
