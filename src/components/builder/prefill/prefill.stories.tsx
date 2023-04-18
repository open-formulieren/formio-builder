import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';

import {PrefillAttributeOption, PrefillConfiguration, PrefillPluginOption} from '.';

const DEFAULT_PREFILL_PLUGINS: PrefillPluginOption[] = [
  {id: 'plugin-1', label: 'Plugin 1'},
  {id: 'plugin-2', label: 'Plugin 2'},
];

const DEFAULT_PREFILL_ATTRIBUTES: {[key: string]: PrefillAttributeOption[]} = {
  'plugin-1': [
    {id: 'plugin-1-attribute-1', label: 'Plugin 1, attribute 1'},
    {id: 'plugin-1-attribute-2', label: 'Plugin 1, attribute 2'},
  ],
  'plugin-2': [
    {id: 'plugin-2-attribute-1', label: 'Plugin 2, attribute 1'},
    {id: 'plugin-2-attribute-2', label: 'Plugin 2, attribute 2'},
  ],
};

export default {
  title: 'Formio/Builder/Prefill/PrefillConfiguration',
  component: PrefillConfiguration,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
    builder: {
      enableContext: true,
      defaultComponentTree: [],
      defaultPrefillPlugins: DEFAULT_PREFILL_PLUGINS,
      defaultPrefillAttributes: DEFAULT_PREFILL_ATTRIBUTES,
    },
    formik: {
      initialValues: {prefill: {plugin: null, attribute: null}},
    },
  },
} as ComponentMeta<typeof PrefillConfiguration>;

const Template: ComponentStory<typeof PrefillConfiguration> = () => <PrefillConfiguration />;

export const Default = Template.bind({});

export const PluginBlankNoAttributes = Template.bind({});
PluginBlankNoAttributes.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  await canvas.getByLabelText('Plugin').focus();
  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 1')).toBeInTheDocument();
    await expect(canvas.queryByText('Plugin 2')).toBeInTheDocument();
  });

  await canvas.getByLabelText('Plugin attribute').focus();
  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await expect(canvas.queryByText('No options')).toBeInTheDocument();
  });
};

export const SelectingPluginFetchesAttributes = Template.bind({});
SelectingPluginFetchesAttributes.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  // select a plugin
  await canvas.getByLabelText('Plugin').focus();
  await userEvent.keyboard('[ArrowDown]');
  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 2')).toBeInTheDocument();
  });
  await userEvent.click(canvas.getByText('Plugin 2'));

  // check the returned attributes for the plugin
  await canvas.getByLabelText('Plugin attribute').focus();
  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 2, attribute 2')).toBeInTheDocument();
  });
};

export const ChangingPluginClearsAttribute = Template.bind({});
ChangingPluginClearsAttribute.parameters = {
  formik: {
    initialValues: {
      prefill: {
        plugin: 'plugin-2',
        attribute: 'plugin-2-attribute-1',
      },
    },
  },
};
ChangingPluginClearsAttribute.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 2')).toBeInTheDocument();
    await expect(canvas.queryByText('Plugin 2, attribute 1')).toBeInTheDocument();
  });

  // change plugin
  await canvas.getByLabelText('Plugin').focus();
  await userEvent.keyboard('[ArrowDown]');
  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 1')).toBeInTheDocument();
  });
  await userEvent.click(canvas.getByText('Plugin 1'));

  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 2, attribute 1')).not.toBeInTheDocument();
  });
  // check the returned attributes for the plugin
  await canvas.getByLabelText('Plugin attribute').focus();
  await userEvent.keyboard('[ArrowDown]');

  await waitFor(async () => {
    await expect(canvas.queryByText('Plugin 1, attribute 1')).toBeInTheDocument();
    await expect(canvas.queryByText('Plugin 1, attribute 2')).toBeInTheDocument();
  });
};
