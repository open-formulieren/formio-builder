import {Formik} from 'formik';
import {useRef} from 'react';

import withFormik from '@bbbtech/storybook-formik';
import {PartialStoryFn, StoryContext} from '@storybook/csf';
import {expect, jest} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {ReactFramework} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';

import Key, {useDeriveComponentKey} from './key';
import Label from './label';

export default {
  title: 'Formio/Builder/Key',
  component: Key,
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
    builder: {enableContext: true, defaultComponentTree: []},
  },
} as ComponentMeta<typeof Key>;

export const Standalone: ComponentStory<typeof Key> = () => {
  const ref = useRef<boolean>(false);
  return <Key isManuallySetRef={ref} generatedValue="" />;
};
Standalone.decorators = [withFormik];
Standalone.parameters = {
  formik: {
    initialValues: {key: ''},
  },
};

const FormikDecorator = (Story: PartialStoryFn<ReactFramework>, context: StoryContext) => (
  <Formik
    initialValues={{label: '', key: ''}}
    onSubmit={jest.fn()}
    {...(context?.parameters?.formik || {})}
  >
    <Story />
  </Formik>
);

const LabelAndKey = () => {
  const [isManuallySetRef, generatedKey] = useDeriveComponentKey();
  return (
    <>
      <Label />
      <Key isManuallySetRef={isManuallySetRef} generatedValue={generatedKey} />
    </>
  );
};

const WithLabelTemplate: ComponentStory<typeof Key> = () => <LabelAndKey />;

export const IsNewDeriveFromLabel = WithLabelTemplate.bind({});
IsNewDeriveFromLabel.storyName = 'New component: derive key from label';
IsNewDeriveFromLabel.decorators = [FormikDecorator];
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
};

export const DeriveFromLabelButSetManually = WithLabelTemplate.bind({});
DeriveFromLabelButSetManually.storyName =
  'New component: derive key from label but specify it manually';
DeriveFromLabelButSetManually.decorators = [FormikDecorator];
DeriveFromLabelButSetManually.parameters = {
  formik: {
    initialValues: {key: 'textField', label: 'Derive key from label'},
    initialStatus: {isNew: true},
  },
};
DeriveFromLabelButSetManually.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);
  const labelInput = await canvas.getByLabelText('Label');
  const keyInput = await canvas.getByLabelText('Property Name');

  // derive from label first
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
IsExistingDeriveFromLabel.decorators = [FormikDecorator];
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
