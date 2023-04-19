import {Formik} from 'formik';
import {OpenFormsComponentSchemaBase} from 'types/schemas';

import {TextField} from '@components/formio';
import {expect, jest} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, waitFor, within} from '@storybook/testing-library';

import {ComponentTranslations, SchemaKey, useManageTranslations} from './i18n';

export default {
  title: 'Formio/Builder/i18n/ComponentTranslations',
  component: ComponentTranslations,
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
    },
    modal: {noModal: true},
    builder: {
      enableContext: true,
      supportedLanguageCodes: ['nl', 'en', 'de'],
      translationsStore: {
        nl: {
          'Literal 1': 'Vertaling 1',
        },
        en: {},
        de: {},
      },
    },
  },
  args: {
    translatableFields: ['translatableField', 'nested.translatableField'],
    initialValues: {
      translatableField: 'Literal 1',
      nonTranslatableField: '',
      nested: {translatableField: ''},
      openForms: {translations: {}},
    },
  },
} as ComponentMeta<typeof ComponentTranslations>;

interface StorySchema extends OpenFormsComponentSchemaBase<string> {
  translatableField: string;
  nonTranslatableField: string;
  nested: {
    translatableField: string;
  };
}

interface BodyProps {
  translatableFields: string[];
}

const Body: React.FC<BodyProps> = ({translatableFields}) => {
  // FIXME: proper typing with nested keys
  useManageTranslations<StorySchema>(translatableFields as SchemaKey<StorySchema>[]);
  return (
    <>
      <TextField name="translatableField" label="Translatable field" />
      <TextField name="nonTranslatableField" label="Non-translatable field" />
      <TextField name="nested.translatableField" label="Nested translatable field" />
      <ComponentTranslations />
    </>
  );
};

interface StoryArgs {
  translatableFields: string[];
  initialValues: {
    [key: string]: any;
  };
}

const Template: ComponentStory<React.FC<StoryArgs>> = ({translatableFields, initialValues}) => (
  <Formik enableReinitialize initialValues={initialValues} onSubmit={console.log}>
    <Body translatableFields={translatableFields} />
  </Formik>
);

export const Default = Template.bind({});
Default.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  // Translations component should initialize/synchronize with available literals and
  // translations from the store.
  await waitFor(async () => {
    const literal1Inputs = canvas.queryAllByDisplayValue('Literal 1');
    expect(literal1Inputs).toHaveLength(2);
    await canvas.findByDisplayValue('Vertaling 1');
  });

  // Enter a value in the non-translatable field
  await userEvent.type(canvas.getByLabelText('Non-translatable field'), 'Literal 2');
  await waitFor(async () => {
    const literal2Inputs = canvas.queryAllByDisplayValue('Literal 2');
    expect(literal2Inputs).toHaveLength(1);
  });

  // Enter a value for the nested translatable field
  await userEvent.type(canvas.getByLabelText('Nested translatable field'), 'Literal 3');
  await waitFor(async () => {
    const literal3Inputs = canvas.queryAllByDisplayValue('Literal 3');
    expect(literal3Inputs).toHaveLength(2);
  });
};
