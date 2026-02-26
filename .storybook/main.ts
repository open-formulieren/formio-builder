import type {StorybookConfig} from '@storybook/react-vite';

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', 'storybook-react-intl', '@storybook/addon-docs'],
  viteFinal: async (config, {configType}) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    // The Monaco JSON Editor is mocked with a textarea component (the one used before),
    // as it doesn't play well with Storybook.
    config.resolve.alias!['@open-formulieren/monaco-json-editor'] = require.resolve(
      './__mocks__/mockedJsonEditor.tsx'
    );
    return config;
  },
  docs: {},
};

export default config;
