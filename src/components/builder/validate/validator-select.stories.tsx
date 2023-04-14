import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, waitFor, within} from '@storybook/testing-library';

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
    builder: {enableContext: true, validatorPluginsDelay: 100},
    formik: {initialValues: {validate: {plugins: []}}},
  },
  args: {
    validatorPlugins: DEFAULT_VALIDATOR_PLUGINS,
  },
} as ComponentMeta<typeof ValidatorPluginSelect>;

const Template: ComponentStory<typeof ValidatorPluginSelect> = () => <ValidatorPluginSelect />;

export const Default = Template.bind({});
Default.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const input = await canvas.getByLabelText('Plugin(s)');

  // open the dropdown
  await input.focus();
  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await expect(canvas.queryByText('Loading...')).toBeInTheDocument();
  });
  // assert the options are present
  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 1')).toBeInTheDocument();
    await expect(canvas.queryByText('Plugin 2')).toBeInTheDocument();
  });
};
