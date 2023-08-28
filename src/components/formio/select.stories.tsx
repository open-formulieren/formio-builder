import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {Meta, StoryFn} from '@storybook/react';
import {within} from '@storybook/testing-library';

import Select from './select';

export default {
  title: 'Formio/Components/Select',
  component: Select,
  decorators: [withFormik],
  parameters: {
    modal: {noModal: true},
    formik: {initialValues: {'my-select': ''}},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 200,
    },
  },
  args: {
    name: 'my-select',
    label: 'My Select',
    required: false,
    tooltip: '',
    isClearable: false,
    valueProperty: 'value',
    options: [
      {value: 'opt-1', label: 'Option 1'},
      {value: 'opt-2', label: 'Option 2'},
    ],
  },
} as Meta<typeof Select>;

export const Required = {
  args: {
    required: true,
    label: 'A required select',
  },
};

export const WithoutLabel = {
  args: {
    label: '',
  },
};

export const WithToolTip = {
  args: {
    label: 'With tooltip',
    tooltip: 'Hiya!',
    required: false,
  },
};

export const Clearable = {
  args: {
    isClearable: true,
  },
};

export const Multi = {
  parameters: {
    formik: {
      initialValues: {'my-select': ['opt-1', 'opt-3']},
    },
  },

  args: {
    isMulti: true,
    options: [
      {value: 'opt-1', label: 'Option 1'},
      {value: 'opt-2', label: 'Option 2'},
      {value: 'opt-3', label: 'Option 3'},
    ],
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Option 1')).toBeInTheDocument();
    await expect(canvas.queryByText('Option 2')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Option 3')).toBeInTheDocument();
  },
};

export const ArbitraryOptionShape = {
  parameters: {
    formik: {
      initialValues: {'my-select': 2},
    },
  },

  args: {
    options: [
      {id: 1, username: 'peterparker'},
      {id: 2, username: 'sherlock'},
    ],
    valueProperty: 'id',
    getOptionLabel: opt => opt.username,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('sherlock')).toBeInTheDocument();
  },
};

export const WithErrors = {
  args: {
    label: 'With errors',
  },

  parameters: {
    formik: {
      initialValues: {'my-select': ''},
      initialErrors: {'my-select': 'Example error', 'other-field': 'Other error'},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
    await expect(canvas.queryByText('Example error')).toBeInTheDocument();
  },
};
