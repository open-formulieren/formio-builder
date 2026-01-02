import {Meta, StoryObj} from '@storybook/react';
import {expect, userEvent, within} from '@storybook/test';

import {withFormik} from '@/sb-decorators';

import ValidationErrorTranslations, {useManageValidatorsTranslations} from './i18n';
import {PossibleValidatorErrorKeys, SchemaWithValidation} from './types';

interface Args {
  errorCodes: PossibleValidatorErrorKeys<SchemaWithValidation>[];
  translatedErrors: Record<
    string,
    Partial<Record<PossibleValidatorErrorKeys<SchemaWithValidation>, string>>
  >;
}

export default {
  title: 'Formio/Builder/Validation/Translations',
  decorators: [
    (Story, {args}) => {
      useManageValidatorsTranslations(args.errorCodes);
      return <Story />;
    },
    withFormik,
  ],
  component: ValidationErrorTranslations,
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    builder: {
      enableContext: true,
      supportedLanguageCodes: ['nl', 'en', 'de'],
    },
    formik: {
      initialValues: {
        translatedErrors: {
          nl: {
            required: 'Dit veld is verplicht.',
            pattern: '',
          },
          en: {
            required: 'This field is required.',
            pattern: '',
          },
          de: {
            required: 'Dieses Feld ist erforderlich.',
            pattern: '',
          },
        },
      },
    },
  },
  args: {
    errorCodes: ['required', 'pattern'],
    translatedErrors: {
      nl: {
        required: 'Dit veld is verplicht.',
        pattern: '',
      },
      en: {
        required: 'This field is required.',
        pattern: '',
      },
      de: {
        required: 'Dieses Feld ist erforderlich.',
        pattern: '',
      },
    },
  },
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText('NL')).not.toBeInTheDocument();
    await expect(canvas.queryByText('EN')).not.toBeInTheDocument();
    await expect(canvas.queryByText('DE')).not.toBeInTheDocument();

    await userEvent.click(canvas.getByText('Custom error messages'));
    await expect(canvas.getByText('NL')).toBeInTheDocument();
    await expect(canvas.getByText('EN')).toBeInTheDocument();
    await expect(canvas.getByText('DE')).toBeInTheDocument();

    await expect(canvas.queryByDisplayValue('Dit veld is verplicht.')).toBeInTheDocument();
    await expect(canvas.queryByDisplayValue('This field is required.')).not.toBeInTheDocument();

    await userEvent.click(canvas.getByText('EN'));
    await expect(canvas.queryByDisplayValue('This field is required.')).toBeInTheDocument();
  },
};
