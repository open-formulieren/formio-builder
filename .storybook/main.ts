// This file has been automatically migrated to valid ESM format by Storybook.
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
  addons: [
    '@storybook/addon-links',
    'storybook-react-intl',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  viteFinal: async config => {
    if (!config.resolve) {
      config.resolve = {};
    }

    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    // The Monaco JSON Editor is mocked with a textarea component (the one used before),
    // as it doesn't play well with Storybook.
    // @ts-ignore
    config.resolve.alias['@open-formulieren/monaco-json-editor'] = new URL(
      './__mocks__/mockedJsonEditor.tsx',
      import.meta.url
    ).pathname;

    return config;
  },
  docs: {},
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
};

export default config;
