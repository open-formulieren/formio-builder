import type {FAQItem} from '@open-formulieren/types';
import type {Meta, StoryFn, StoryObj} from '@storybook/react-vite';
import {Formik} from 'formik';
import {expect, userEvent, waitFor, within} from 'storybook/test';

import {TextField} from '@/components/formio';
import {withFormik} from '@/sb-decorators';

import {FAQItemsTranslations} from './faq-items';
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
      faqItems: [
        {
          id: '38380023-853d-451d-8d9d-fc8c71c4ffc2',
          label: 'Should I fill this in?',
          content: 'Yes you should',
          openForms: {
            translations: {
              nl: {
                label: 'Moet ik dit invullen?',
                content: 'Ja dat moet',
              },
              en: {
                label: 'Should I fill this in?',
                content: 'Yes you should',
              },
            },
          },
        },
        {
          id: 'cd50ec95-a747-471d-91c7-67979032fd7c',
          label: "I've XYZ, should I fill this in?",
          content: 'Add XYZ',
          openForms: {
            translations: {
              en: {
                label: "I've XYZ, should I fill this in?",
                content: 'Add XYZ',
              },
            },
          },
        },
      ],
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
  faqItems: FAQItem[];
}

interface DummyComponent {
  type: 'textfield';
  key: string;
  id: string;
  label: string;
  description: string;
}

const Body: React.FC<BodyProps> = ({fieldLabels, faqItems}) => {
  return (
    <>
      <TextField name="label" label="Label" faqItems={faqItems} />
      <TextField name="description" label="Description" />
      <TextField name="nonTranslatableField" label="Non-translatable field" />
      <ComponentTranslations<DummyComponent> propertyLabels={fieldLabels}>
        <FAQItemsTranslations />
      </ComponentTranslations>
    </>
  );
};

interface StoryArgs extends BodyProps {
  initialValues: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

type Story = StoryObj<StoryArgs>;

const render: StoryFn<React.FC<StoryArgs>> = ({fieldLabels, initialValues}) => (
  <Formik enableReinitialize initialValues={initialValues} onSubmit={console.log}>
    <Body fieldLabels={fieldLabels} faqItems={initialValues.faqItems} />
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

    const faqLabel1 = canvas.getByLabelText(
      'Translation for label with value "Should I fill this in?"'
    );
    expect(faqLabel1).toBeVisible();
    const faqLabel2 = canvas.getByLabelText(
      'Translation for label with value "I\'ve XYZ, should I fill this in?"'
    );
    expect(faqLabel2).toBeVisible();

    await waitFor(async () => {
      const literal1Reference = canvas.getByText('Hi there {{ firstName }}');
      expect(literal1Reference).toBeVisible();
      await canvas.findByDisplayValue('Hallo daar, {{ firstName }}');

      const faqItem1Labels = canvas.getAllByText('Should I fill this in?');
      await expect(faqItem1Labels.length).toEqual(2);
      await expect(faqItem1Labels[0]).toBeVisible();
      const faqItem2Labels = canvas.getAllByText("I've XYZ, should I fill this in?");
      await expect(faqItem2Labels.length).toEqual(2);
      await expect(faqItem2Labels[0]).toBeVisible();
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
