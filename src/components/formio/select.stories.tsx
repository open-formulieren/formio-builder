import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
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
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = args => <Select {...args} />;

export const Required = Template.bind({});
Required.args = {
  required: true,
  label: 'A required select',
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  label: '',
};

export const WithToolTip = Template.bind({});
WithToolTip.args = {
  label: 'With tooltip',
  tooltip: 'Hiya!',
  required: false,
};

export const Clearable = Template.bind({});
Clearable.args = {
  isClearable: true,
};

export const Multi = Template.bind({});
Multi.parameters = {
  formik: {
    initialValues: {'my-select': ['opt-1', 'opt-3']},
  },
};
Multi.args = {
  isMulti: true,
  options: [
    {value: 'opt-1', label: 'Option 1'},
    {value: 'opt-2', label: 'Option 2'},
    {value: 'opt-3', label: 'Option 3'},
  ],
};
Multi.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText('Option 1')).toBeInTheDocument();
  await expect(canvas.queryByText('Option 2')).not.toBeInTheDocument();
  await expect(canvas.queryByText('Option 3')).toBeInTheDocument();
};

export const ArbitraryOptionShape = Template.bind({});
ArbitraryOptionShape.parameters = {
  formik: {
    initialValues: {'my-select': 2},
  },
};
ArbitraryOptionShape.args = {
  options: [
    {id: 1, username: 'peterparker'},
    {id: 2, username: 'sherlock'},
  ],
  valueProperty: 'id',
  getOptionLabel: opt => opt.username,
};
ArbitraryOptionShape.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByText('sherlock')).toBeInTheDocument();
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  label: 'With errors',
};
WithErrors.parameters = {
  formik: {
    initialValues: {'my-select': ''},
    initialErrors: {'my-select': 'Example error', 'other-field': 'Other error'},
  },
};
WithErrors.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText('Other error')).not.toBeInTheDocument();
  await expect(canvas.queryByText('Example error')).toBeInTheDocument();
};
