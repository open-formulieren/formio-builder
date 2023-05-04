import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, within} from '@storybook/testing-library';
import {Formik} from 'formik';

import ValidationErrorTranslations, {useManageValidatorsTranslations} from './i18n';

export default {
  title: 'Formio/Builder/Validation/Translations',
  component: ValidationErrorTranslations,
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    builder: {
      enableContext: true,
      supportedLanguageCodes: ['nl', 'en', 'de'],
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
} as ComponentMeta<typeof ValidationErrorTranslations>;

interface BodyProps {
  errorCodes: string[];
}

const Body: React.FC<BodyProps> = ({errorCodes}) => {
  useManageValidatorsTranslations(errorCodes);
  return <ValidationErrorTranslations />;
};

interface StoryArgs {
  errorCodes: string[];
  translatedErrors: Record<string, Record<string, string>>;
}

const Template: ComponentStory<React.FC<StoryArgs>> = ({errorCodes, translatedErrors}) => {
  return (
    <Formik initialValues={{translatedErrors}} onSubmit={console.log}>
      <Body errorCodes={errorCodes} />
    </Formik>
  );
};

export const Default = Template.bind({});
Default.play = async ({canvasElement}) => {
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
};
