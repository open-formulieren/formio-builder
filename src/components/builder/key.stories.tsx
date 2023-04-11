import {BuilderContext} from 'context';

import withFormik from '@bbbtech/storybook-formik';
import {ComponentMeta, ComponentStory, ComponentStoryFn} from '@storybook/react';

import Key from './key';
import Label from './label';

const builderContextDecorator = (Story: ComponentStoryFn<typeof Key>) => (
  <BuilderContext.Provider
    value={{
      uniquifyKey: key => key,
      getFormComponents: () => [],
      componentTranslationsRef: {current: null},
    }}
  >
    <Story />
  </BuilderContext.Provider>
);

export default {
  title: 'Formio/Builder/Key',
  component: Key,
  decorators: [withFormik, builderContextDecorator],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
    formik: {
      initialValues: {key: ''},
    },
  },
} as ComponentMeta<typeof Key>;

export const Standalone: ComponentStory<typeof Key> = () => <Key />;

const WithLabelTemplate: ComponentStory<typeof Key> = () => (
  <>
    <Label />
    <Key />
  </>
);

export const IsNewDeriveFromLabel = WithLabelTemplate.bind({});
IsNewDeriveFromLabel.storyName = 'New component: derive key from label';
IsNewDeriveFromLabel.parameters = {
  formik: {
    initialValues: {key: 'defaultKey', label: 'Derive key from label'},
    initialStatus: {isNew: true},
  },
};

export const IsExistingDeriveFromLabel = WithLabelTemplate.bind({});
IsExistingDeriveFromLabel.storyName = "Existing component: don't derive key from label";
IsExistingDeriveFromLabel.parameters = {
  formik: {
    initialValues: {key: 'explicitlySetKey', label: 'Key not derived from label'},
    initialStatus: {isNew: false},
  },
};
