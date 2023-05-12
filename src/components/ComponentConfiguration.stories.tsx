import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';
import {ExtendedComponentSchema} from 'formiojs/types/components/schema';
import React from 'react';

import {ExtendedEditFormComponentSchema} from '@/types';

import ComponentConfiguration from './ComponentConfiguration';
import {BuilderInfo} from './ComponentEditForm';
import {PrefillAttributeOption, PrefillPluginOption} from './builder/prefill';
import {RegistrationAttributeOption} from './builder/registration/registration-attribute';
import {ValidatorOption} from './builder/validate/validator-select';

export default {
  title: 'Public API/ComponentConfiguration',
  component: ComponentConfiguration,
  argTypes: {
    componentTranslationsRef: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    isNew: true,
    otherComponents: [{type: 'select', label: 'A select', key: 'aSelect'}],
    validatorPlugins: [
      {id: 'phone-intl', label: 'Phone (international)'},
      {id: 'phone-nl', label: 'Phone (Dutch)'},
      {id: 'license-plate', label: 'License plate'},
    ],
    registrationAttributes: [
      {id: 'bsn', label: 'BSN'},
      {id: 'firstName', label: 'First name'},
      {id: 'dob', label: 'Date of Birth'},
    ],
    prefillPlugins: [
      {id: 'stuf-bg', label: 'StUF-BG'},
      {id: 'haalcentraal', label: 'Haal Centraal'},
    ],
    prefillAttributes: {
      'stuf-bg': [
        {id: 'BSN', label: 'BSN'},
        {id: 'geslachtsNaam', label: 'Geslachtsnaam'},
      ],
      haalcentraal: [
        {id: 'burgerservicenummer', label: 'BSN'},
        {id: 'lastName', label: 'Achternaam'},
      ],
    },
    supportedLanguageCodes: ['nl'],
    translationsStore: {
      nl: {
        'A select': 'Een dropdown',
        'A text field': 'Een tekstveld',
      },
    },
    builderInfo: {
      title: 'Text field',
      group: 'basic',
      icon: 'terminal',
      schema: {placeholder: ''},
      weight: 0,
    },
  },
} as ComponentMeta<typeof ComponentConfiguration>;

interface TemplateArgs {
  component: ExtendedEditFormComponentSchema;
  supportedLanguageCodes: string[];
  translationsStore: {
    [key: string]: {
      [key: string]: string;
    };
  };
  otherComponents: ExtendedComponentSchema[];
  validatorPlugins: ValidatorOption[];
  registrationAttributes: RegistrationAttributeOption[];
  prefillPlugins: PrefillPluginOption[];
  prefillAttributes: Record<string, PrefillAttributeOption[]>;
  isNew: boolean;
  builderInfo: BuilderInfo;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (c: ExtendedEditFormComponentSchema) => void;
}

const Template = ({
  component,
  otherComponents,
  validatorPlugins,
  registrationAttributes,
  prefillPlugins,
  prefillAttributes,
  supportedLanguageCodes,
  translationsStore,
  isNew,
  builderInfo,
  onCancel,
  onRemove,
  onSubmit,
}: TemplateArgs) => {
  return (
    <ComponentConfiguration
      uniquifyKey={(key: string) => key}
      supportedLanguageCodes={supportedLanguageCodes}
      componentTranslationsRef={{current: translationsStore}}
      getFormComponents={() => otherComponents}
      getValidatorPlugins={async () => validatorPlugins}
      getRegistrationAttributes={async () => registrationAttributes}
      getPrefillPlugins={async () => prefillPlugins}
      getPrefillAttributes={async (plugin: string) => prefillAttributes[plugin]}
      component={component}
      isNew={isNew}
      builderInfo={builderInfo}
      onCancel={onCancel}
      onRemove={onRemove}
      onSubmit={onSubmit}
    />
  );
};

export const Default: ComponentStory<typeof Template> = Template.bind({});
Default.storyName = 'generic';

Default.args = {
  component: {
    id: 'wekruya',
    type: 'textfield',
    label: 'A text field',
    validate: {
      required: false,
    },
  },
};

export const TextField: ComponentStory<typeof Template> = Template.bind({});
TextField.storyName = 'type: textfield';

TextField.args = {
  component: {
    id: 'wekruya',
    type: 'textfield',
    label: 'A text field',
    validate: {
      required: false,
    },
  },
};

TextField.play = async ({canvasElement}) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByLabelText('Label')).toHaveValue('A text field');
  await waitFor(async () => {
    await expect(canvas.getByLabelText('Property Name')).toHaveValue('aTextField');
  });
  await expect(canvas.getByLabelText('Description')).toHaveValue('');
  await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
  await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
  await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();

  // ensure that changing fields in the edit form properly update the preview
  const preview = within(canvas.getByTestId('componentPreview'));

  await userEvent.clear(canvas.getByLabelText('Label'));
  await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
  await expect(await preview.findByText('Updated preview label'));

  const previewInput = preview.getByLabelText('Updated preview label');
  await expect(previewInput).toHaveDisplayValue('');

  // Ensure that the manually entered key is kept instead of derived from the label,
  // even when key/label components are not mounted.
  const keyInput = canvas.getByLabelText('Property Name');
  await fireEvent.change(keyInput, {target: {value: 'customKey'}});
  await userEvent.click(canvas.getByRole('tab', {name: 'Location'}));
  await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
  await userEvent.clear(canvas.getByLabelText('Label'));
  await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
  await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

  // check that toggling the 'multiple' checkbox properly updates the preview and default
  // value field
  await userEvent.click(canvas.getByLabelText('Multiple values'));
  await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
  await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
  // test for the default value inputs -> these don't have accessible labels/names :(
  const addButtons = await canvas.getAllByRole('button', {name: 'Add another'});
  await userEvent.click(addButtons[0]);
  await expect(await canvas.findByTestId('input-defaultValue[0]'));
};

export const Email: ComponentStory<typeof Template> = Template.bind({});
Email.storyName = 'type: email';

Email.args = {
  component: {
    id: 'ikrnvhe',
    type: 'email',
    label: 'An email field',
    validate: {
      required: false,
    },
    validateOn: 'blur',
  },
  builderInfo: {
    title: 'Email',
    group: 'basic',
    icon: 'at',
    schema: {placeholder: ''},
    weight: 10,
  },
};
