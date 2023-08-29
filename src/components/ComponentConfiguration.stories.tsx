import {SupportedLocales} from '@open-formulieren/types';
import {expect} from '@storybook/jest';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';
import React from 'react';

import {AnyComponentSchema} from '@/types';

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
} as Meta<typeof ComponentConfiguration>;

interface TemplateArgs {
  component: AnyComponentSchema;
  supportedLanguageCodes: SupportedLocales[];
  translationsStore: {
    [key: string]: {
      [key: string]: string;
    };
  };
  otherComponents: AnyComponentSchema[];
  validatorPlugins: ValidatorOption[];
  registrationAttributes: RegistrationAttributeOption[];
  prefillPlugins: PrefillPluginOption[];
  prefillAttributes: Record<string, PrefillAttributeOption[]>;
  isNew: boolean;
  builderInfo: BuilderInfo;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onSubmit: (c: AnyComponentSchema) => void;
}

const Template: StoryFn<TemplateArgs> = ({
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
}: TemplateArgs) => (
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

type Story = StoryObj<typeof Template>;

export const Default: Story = {
  render: Template,
  name: 'generic',

  args: {
    component: {
      id: 'wekruya',
      type: 'textfield',
      key: 'textfield',
      label: 'A text field',
      validate: {
        required: false,
      },
    },
  },
};

export const TextField: Story = {
  render: Template,
  name: 'type: textfield',

  args: {
    component: {
      id: 'wekruya',
      type: 'textfield',
      key: 'textfield',
      label: 'A text field',
      validate: {
        required: false,
      },
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A text field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aTextField');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
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
  },
};

export const Email: Story = {
  render: Template,
  name: 'type: email',

  args: {
    component: {
      id: 'ikrnvhe',
      type: 'email',
      key: 'email',
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
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('An email field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('anEmailField');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();
    await expect(canvas.queryByLabelText('Placeholder')).not.toBeInTheDocument();

    // ensure that changing fields in the edit form properly update the preview
    const preview = within(canvas.getByTestId('componentPreview'));

    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
    await expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('email');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    await fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field
    await userEvent.click(canvas.getByLabelText('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = await canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    // check that default value is e-mail validated
    const defaultInput0 = await canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('email');
    await userEvent.type(defaultInput0, 'invalid');
    // fireEvent.blur doesn't seem to do anything? -> just click the button to add another one,
    // that also removes focus from the input
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByText('Default Value must be a valid email.')).toBeVisible();
    });
  },
};
