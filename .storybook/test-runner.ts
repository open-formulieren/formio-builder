import {TestRunnerConfig} from '@storybook/test-runner';

const config: TestRunnerConfig = {
  preRender: async (page, context) => {
    const {id} = context;
    console.log(`Testing story with id: ${id}`);
  },

  postRender: async (page, context) => {
    const {id} = context;
    console.log(`Done testing story with id: ${id}`);
  },
};

export default config;
