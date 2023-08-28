import withFormik from '@bbbtech/storybook-formik';
import {PartialStoryFn, StoryContext} from '@storybook/csf';
import {expect, jest} from '@storybook/jest';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {ReactFramework} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';
import {Formik} from 'formik';
import {useRef} from 'react';

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
} as Meta<typeof Key>;

export const Standalone: StoryObj<typeof Key> = {
  render: () => {
    const ref = useRef<boolean>(false);
    return <Key isManuallySetRef={ref} generatedValue="" />;
  },

  decorators: [withFormik],

  parameters: {
    formik: {
      initialValues: {key: ''},
    },
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

const WithLabelTemplate: StoryFn<typeof Key> = () => <LabelAndKey />;

export const IsNewDeriveFromLabel = {
  render: WithLabelTemplate,
  name: 'New component: derive key from label',
  decorators: [FormikDecorator],

  parameters: {
    formik: {
      initialValues: {key: 'defaultKey', label: 'Derive key from label'},
      initialStatus: {isNew: true},
    },
  },

  play: async ({canvasElement}) => {
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
  },
};

export const DeriveFromLabelButSetManually = {
  render: WithLabelTemplate,
  name: 'New component: derive key from label but specify it manually',
  decorators: [FormikDecorator],

  parameters: {
    formik: {
      initialValues: {key: 'textField', label: 'Derive key from label'},
      initialStatus: {isNew: true},
    },
  },

  play: async ({canvasElement}) => {
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
  },
};

export const IsExistingDeriveFromLabel = {
  render: WithLabelTemplate,
  name: "Existing component: don't derive key from label",
  decorators: [FormikDecorator],

  parameters: {
    formik: {
      initialValues: {key: 'explicitlySetKey', label: 'Key not derived from label'},
      initialStatus: {isNew: false},
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const labelInput = await canvas.getByLabelText('Label');

    await userEvent.clear(labelInput);
    await userEvent.type(labelInput, 'My label');
    await expect(labelInput).toHaveValue('My label');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('explicitlySetKey');
    });
  },
};
