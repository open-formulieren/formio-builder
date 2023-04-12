import {ExtendedComponentSchema} from 'formiojs';

import withFormik from '@bbbtech/storybook-formik';
import {PartialStoryFn, StoryContext} from '@storybook/csf';
import {ReactFramework} from '@storybook/react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {BuilderContext} from 'context';

import ComponentSelect, {ComponentSelectProps} from './component-select';

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

interface StoryArgs extends ComponentSelectProps {
  componentTree?: ExtendedComponentSchema[];
}

const builderContextDecorator = (Story: PartialStoryFn<ReactFramework>, context: StoryContext) => (
  <BuilderContext.Provider
    value={{
      uniquifyKey: key => key,
      getFormComponents: () => context?.args?.componentTree || COMPONENT_TREE,
      componentTranslationsRef: {current: null},
    }}
  >
    <Story />
  </BuilderContext.Provider>
);

export default {
  title: 'Formio/Builder/ComponentSelect',
  component: ComponentSelect,
  decorators: [withFormik, builderContextDecorator],
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
} as ComponentMeta<typeof ComponentSelect>;

const Template: ComponentStory<React.FC<StoryArgs>> = args => <ComponentSelect {...args} />;

export const Default = Template.bind({});
