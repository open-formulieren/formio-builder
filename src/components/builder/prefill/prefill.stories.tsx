import {Meta, StoryFn, StoryObj} from '@storybook/react-webpack5';
import {expect, userEvent, waitFor, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

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
      initialValues: {prefill: {plugin: '', attribute: '', identifierRole: 'main'}},
    },
  },
} as Meta<typeof PrefillConfiguration>;

type Story = StoryObj<typeof PrefillConfiguration>;

const Template: StoryFn<typeof PrefillConfiguration> = () => <PrefillConfiguration />;

export const Default: Story = {
  render: Template,
};

export const PluginBlankNoAttributes: Story = {
  render: Template,

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const pluginInput = canvas.getByLabelText('Plugin');

    await waitFor(
      async () => {
        await userEvent.keyboard('[Esc]');
        pluginInput.focus();
        await userEvent.keyboard('[ArrowDown]');
        expect(canvas.queryByText('Plugin 1')).toBeInTheDocument();
        expect(canvas.queryByText('Plugin 2')).toBeInTheDocument();
      },
      {timeout: 1500, container: canvasElement}
    );

    const attributeInput = canvas.getByLabelText('Plugin attribute');

    await waitFor(async () => {
      await userEvent.keyboard('[Esc]');
      attributeInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await expect(canvas.queryByText('No options')).toBeInTheDocument();
    });
  },
};

export const SelectingPluginFetchesAttributes: Story = {
  render: Template,

  play: async ({canvasElement}) => {
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
  },
};

export const ChangingPluginClearsAttribute: Story = {
  render: Template,

  parameters: {
    formik: {
      initialValues: {
        prefill: {
          plugin: 'plugin-2',
          attribute: 'plugin-2-attribute-1',
        },
      },
    },
  },

  play: async ({canvasElement}) => {
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
  },
};

export const ChangingIdentifierRole: Story = {
  render: Template,

  parameters: {
    formik: {
      initialValues: {
        prefill: {
          plugin: 'plugin-2',
          attribute: 'plugin-2-attribute-1',
          identifierRole: 'main',
        },
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await waitFor(async () => {
      await expect(canvas.queryByText('Plugin 2')).toBeInTheDocument();
      await expect(canvas.queryByText('Plugin 2, attribute 1')).toBeInTheDocument();
      await expect(canvas.queryByText('Main')).toBeInTheDocument();
    });

    // change the identifier role
    await canvas.getByLabelText('Identifier role').focus();
    await userEvent.keyboard('[ArrowDown]');
    await waitFor(async () => {
      await expect(canvas.queryByText('Authorised person')).toBeInTheDocument();
    });
    await userEvent.click(canvas.getByText('Authorised person'));

    await waitFor(async () => {
      await expect(canvas.queryByText('Main')).not.toBeInTheDocument();
    });
  },
};
