import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/sb-decorators';

import ComponentSelect from './component-select';

const COMPONENT_TREE = [
  {type: 'textfield', key: 'text1', label: 'Textfield 1'},
  {
    type: 'fieldset',
    key: 'fieldset1',
    label: 'Fieldset 1',
    components: [
      {type: 'textfield', key: 'text2', label: 'Textfield 2'},
      {type: 'number', key: 'nested.number1', label: 'Nested number'},
    ],
  },
];

type Story = StoryObj<typeof ComponentSelect>;

export default {
  title: 'Formio/Builder/ComponentSelect',
  component: ComponentSelect,
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
    builder: {enableContext: true},
    formik: {
      initialValues: {aComponent: ''},
    },
  },
  args: {
    name: 'aComponent',
    label: 'Select component',
    required: false,
    tooltip: '',
    isClearable: true,
    componentTree: COMPONENT_TREE,
  },
} as Meta<typeof ComponentSelect>;

export const Default: Story = {};
