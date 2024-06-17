import type {StorybookConfig} from '@storybook/react-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
    disableWhatsNewNotifications: true,
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-react-intl',
    '@storybook/addon-webpack5-compiler-babel',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          // Replaces existing CSS rules with given rule
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          // Replaces any existing Sass rules with given rules
          {
            test: /\.s[ac]ss$/i,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'sass-loader',
                options: {implementation: require.resolve('sass')},
              },
            ],
          },
        ],
      },
    },
  ],
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (config, {configType}) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    // The Monaco JSON Editor is mocked with a textarea component (the one used before),
    // as it doesn't play well with Storybook.
    config.resolve.alias!['@open-formulieren/monaco-json-editor'] = require.resolve(
      './__mocks__/mockedJsonEditor.tsx'
    );
    return config;
  },
};

export default config;
