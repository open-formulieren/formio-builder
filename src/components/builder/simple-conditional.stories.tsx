import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory} from '@storybook/react';

import SimpleConditional from './simple-conditional';

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

export default {
  title: 'Formio/Builder/SimpleConditional',
  component: SimpleConditional,
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
      iframeHeight: 400,
    },
    modal: {noModal: true},
    builder: {enableContext: true},
    formik: {
      initialValues: {
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
      },
    },
  },
  args: {
    componentTree: COMPONENT_TREE,
  },
} as ComponentMeta<typeof SimpleConditional>;

const Template: ComponentStory<typeof SimpleConditional> = () => <SimpleConditional />;

export const Default = Template.bind({});
