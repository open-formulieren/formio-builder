import {Meta, StoryFn, StoryObj} from '@storybook/react-vite';
import {Formik} from 'formik';
import {expect, userEvent, waitFor, within} from 'storybook/test';

import {TextField} from '@/components/formio';
import {withFormik} from '@/sb-decorators';

import {ComponentTranslations} from './i18n';

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
      // 'de' is not part of the languages type, but this is fine at runtime
      supportedLanguageCodes: ['nl', 'en', 'de'],
    },
  },
  args: {
    fieldLabels: {
      label: 'Label',
      description: 'Description',
    },

    initialValues: {
      label: 'Hi there {{ firstName }}',
      nonTranslatableField: '',
      openForms: {
        translations: {
          nl: {
            label: 'Hallo daar, {{ firstName }}',
          },
        },
      },
    },
  },
} as Meta<typeof ComponentTranslations>;

interface BodyProps {
  fieldLabels: {
    label: string;
    description: string;
  };
}

interface DummyComponent {
  type: 'textfield';
  key: string;
  id: string;
  label: string;
  description: string;
}

const Body: React.FC<BodyProps> = ({fieldLabels}) => {
  return (
    <>
      <TextField name="label" label="Label" />
      <TextField name="description" label="Description" />
      <TextField name="nonTranslatableField" label="Non-translatable field" />
      <ComponentTranslations<DummyComponent> propertyLabels={fieldLabels} />
    </>
  );
};

interface StoryArgs extends BodyProps {
  initialValues: {
    [key: string]: any;
  };
}

type Story = StoryObj<StoryArgs>;

const render: StoryFn<React.FC<StoryArgs>> = ({fieldLabels, initialValues}) => (
  <Formik enableReinitialize initialValues={initialValues} onSubmit={console.log}>
    <Body fieldLabels={fieldLabels} />
  </Formik>
);

export const Default: Story = {
  render: render,

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Translations component must display the registered/existing translations.
    const translationField1 = canvas.getByLabelText('Translation for "label"');
    expect(translationField1).toBeVisible();

    const translationField2 = canvas.queryByLabelText('Translation for "nonTranslatableField"');
    expect(translationField2).toBeNull();

    await waitFor(async () => {
      const literal1Reference = canvas.getByText('Hi there {{ firstName }}');
      expect(literal1Reference).toBeVisible();
      await canvas.findByDisplayValue('Hallo daar, {{ firstName }}');
    });

    // Enter a value in the non-translatable field
    await userEvent.type(canvas.getByLabelText('Non-translatable field'), 'Literal 2');
    expect(translationField2).toBeNull();
  },
};

export const LongStringsWrap: StoryObj<typeof ComponentTranslations<DummyComponent>> = {
  decorators: [withFormik],
  args: {
    propertyLabels: {
      label: 'Label',
    },
  },
  parameters: {
    formik: {
      initialValues: {
        label: Array(100).fill('a').join(''),
        openForms: {
          translations: {
            nl: {
              label: 'Insgelijks',
            },
          },
        },
      },
    },
  },
};
