import {BuilderContext} from 'context';

import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory, ComponentStoryFn} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';

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
IsNewDeriveFromLabel.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const labelInput = await canvas.getByLabelText('Label');
  const keyInput = await canvas.getByLabelText('Property Name');

  // derive from label
  await userEvent.clear(labelInput);
  await userEvent.type(labelInput, 'My label');
  await expect(labelInput).toHaveValue('My label');
  await waitFor(async () => {
    await expect(keyInput).toHaveValue('myLabel');
  });

  // manually set the key, modifiying the label may then not touch the key anymore
  // this uses fireEvent since clear resets to calculated value again and select + paste
  // doesn't seem obvious
  // FIXME: if you can 'select all text + replace with paste/type' -> be my guest!
  await fireEvent.change(keyInput, {target: {value: 'customKey'}});
  await userEvent.clear(labelInput);
  await userEvent.type(labelInput, 'Updated label');
  await expect(labelInput).toHaveValue('Updated label');
  await waitFor(async () => {
    await expect(keyInput).toHaveValue('customKey');
  });
};

export const IsExistingDeriveFromLabel = WithLabelTemplate.bind({});
IsExistingDeriveFromLabel.storyName = "Existing component: don't derive key from label";
IsExistingDeriveFromLabel.parameters = {
  formik: {
    initialValues: {key: 'explicitlySetKey', label: 'Key not derived from label'},
    initialStatus: {isNew: false},
  },
};
IsExistingDeriveFromLabel.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const labelInput = await canvas.getByLabelText('Label');

  await userEvent.clear(labelInput);
  await userEvent.type(labelInput, 'My label');
  await expect(labelInput).toHaveValue('My label');
  await waitFor(async () => {
    await expect(canvas.getByLabelText('Property Name')).toHaveValue('explicitlySetKey');
  });
};
