import {ContentComponentSchema, SupportedLocales} from '@open-formulieren/types';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {expect, fireEvent, fn, userEvent, waitFor, within} from '@storybook/test';
import React from 'react';

import {
  CONFIDENTIALITY_LEVELS,
  DEFAULT_AUTH_PLUGINS,
  DEFAULT_COLORS,
  DEFAULT_DOCUMENT_TYPES,
  DEFAULT_FILE_TYPES,
} from '@/tests/sharedUtils';
import {AnyComponentSchema} from '@/types';

import ComponentConfiguration from './ComponentConfiguration';
import {BuilderInfo} from './ComponentEditForm';
import {PrefillAttributeOption, PrefillPluginOption} from './builder/prefill';
import {RegistrationAttributeOption} from './builder/registration/registration-attribute';
import {ValidatorOption} from './builder/validate/validator-select';

export default {
  title: 'Public API/ComponentConfiguration',
  component: ComponentConfiguration,
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
    fileTypes: DEFAULT_FILE_TYPES,
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),
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
  otherComponents: AnyComponentSchema[];
  validatorPlugins: ValidatorOption[];
  registrationAttributes: RegistrationAttributeOption[];
  prefillPlugins: PrefillPluginOption[];
  prefillAttributes: Record<string, PrefillAttributeOption[]>;
  fileTypes: Array<{value: string; label: string}>;
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
  fileTypes,
  isNew,
  builderInfo,
  onCancel,
  onRemove,
  onSubmit,
}: TemplateArgs) => (
  <ComponentConfiguration
    uniquifyKey={(key: string) => key}
    supportedLanguageCodes={supportedLanguageCodes}
    richTextColors={DEFAULT_COLORS}
    getFormComponents={() => otherComponents}
    getValidatorPlugins={async () => validatorPlugins}
    getRegistrationAttributes={async () => registrationAttributes}
    getPrefillPlugins={async () => prefillPlugins}
    getPrefillAttributes={async (plugin: string) => prefillAttributes[plugin]}
    getFileTypes={async () => fileTypes}
    serverUploadLimit="50MB"
    getDocumentTypes={async () => DEFAULT_DOCUMENT_TYPES}
    getConfidentialityLevels={async () => CONFIDENTIALITY_LEVELS}
    getAuthPlugins={async () => DEFAULT_AUTH_PLUGINS}
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

  play: async ({canvasElement, args}) => {
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Location'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');
    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    expect(await canvas.findByTestId('input-defaultValue[0]'));

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
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

  play: async ({canvasElement, args}) => {
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
    await expect(await preview.findByText('Updated preview label')).toBeVisible();

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('email');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    // check that default value is e-mail validated
    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('email');
    await userEvent.type(defaultInput0, 'invalid');
    // fireEvent.blur doesn't seem to do anything? -> just click the button to add another one,
    // that also removes focus from the input
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByText('Default Value must be a valid email.')).toBeVisible();
    });

    await userEvent.type(defaultInput0, '@example.com');
    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const NumberField: Story = {
  render: Template,
  name: 'type: number',

  args: {
    component: {
      id: 'wekruya',
      type: 'number',
      key: 'number',
      label: 'A number field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Number',
      group: 'basic',
      icon: 'hashtag',
      schema: {placeholder: ''},
      weight: 30,
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A number field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aNumberField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('number');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Textarea: Story = {
  render: Template,
  name: 'type: textarea',

  args: {
    component: {
      id: 'wekruya',
      type: 'textarea',
      key: 'textarea',
      label: 'A textarea field',
      autoExpand: false,
      rows: 3,
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Textarea',
      group: 'basic',
      icon: 'hashtag',
      schema: {placeholder: ''},
      weight: 30,
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A textarea field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aTextareaField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');
    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    expect(await canvas.findByTestId('input-defaultValue[0]'));

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const DateField: Story = {
  render: Template,
  name: 'type: date',

  args: {
    component: {
      id: 'wekruya',
      type: 'date',
      key: 'date',
      label: 'A date field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Date Field',
      icon: 'calendar',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A date field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aDateField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('date');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    // check that default value is e-mail validated
    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('date');
    // userEvent.type does not reliably work with date input, and the native browser
    // datepicker helps in enforcing only valid dates.

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const DateTimeField: Story = {
  render: Template,
  name: 'type: datetime',

  args: {
    component: {
      id: 'wekruya',
      type: 'datetime',
      key: 'datetime',
      label: 'A datetime field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Date/Time Field',
      icon: 'calendar-plus',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A datetime field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aDatetimeField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('datetime-local');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    // check that default value is e-mail validated
    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('datetime-local');
    // userEvent.type does not reliably work with datetime-local input

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const TimeField: Story = {
  render: Template,
  name: 'type: time',

  args: {
    component: {
      id: 'wekruya',
      type: 'time',
      inputType: 'text',
      format: 'HH:mm',
      validateOn: 'blur',
      key: 'time',
      label: 'A time field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Time Field',
      icon: 'clock-o',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A time field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aTimeField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('time');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    // check that default value is e-mail validated
    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('time');
    // userEvent.type does not reliably work with time input

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Postcode: Story = {
  render: Template,
  name: 'type: postcode (deprecated)',

  args: {
    component: {
      id: 'wekruya',
      type: 'postcode',
      validateOn: 'blur',
      inputMask: '9999 AA',
      key: 'postcode',
      label: 'A postcode field',
      validate: {
        required: false,
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
    },

    builderInfo: {
      title: 'Postcode',
      icon: 'home',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A postcode field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aPostcodeField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('text');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    // check that default value is e-mail validated
    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('text');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const PhoneNumber: Story = {
  render: Template,
  name: 'type: phoneNumber',

  args: {
    component: {
      id: 'wekruya',
      type: 'phoneNumber',
      inputMask: null,
      key: 'phoneNumber',
      label: 'A phone number field',
    },

    builderInfo: {
      title: 'Phone number',
      icon: 'phone-square',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A phone number field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aPhoneNumberField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    expect(await canvas.findByTestId('input-defaultValue[0]'));

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const FileUpload: Story = {
  render: Template,
  name: 'type: file',

  args: {
    component: {
      id: 'kiweljhr',
      storage: 'url',
      webcam: false,
      options: {
        withCredentials: true,
      },
      url: '',
      type: 'file',
      key: 'file',
      label: 'A file upload',
      file: {
        name: '',
        type: [],
        allowedTypesLabels: [],
      },
      filePattern: '',
    },

    builderInfo: {
      title: 'File upload',
      icon: '',
      group: 'file',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    await step('Basic tab', async () => {
      await expect(canvas.getByLabelText('Label')).toHaveValue('A file upload');
      await waitFor(async () => {
        await expect(canvas.getByLabelText('Property Name')).toHaveValue('aFileUpload');
      });

      await expect(canvas.getByLabelText('Description')).toHaveValue('');
      await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
      await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
      await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
      await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();

      await expect(canvas.getByLabelText('Multiple values')).not.toBeChecked();
      await expect(canvas.getByLabelText('Hidden')).not.toBeChecked();
      await expect(canvas.getByLabelText('Clear on hide')).toBeChecked();
      await expect(canvas.getByLabelText('Is sensitive data')).toBeChecked();
    });

    await step('File tab', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'File'}));

      await expect(canvas.getByLabelText('Maximum file size')).toHaveDisplayValue('10MB');
      await expect(canvas.getByText('Note that the server upload limit is 50MB.')).toBeVisible();

      // check that the file types are visible
      canvas.getByLabelText('File types').focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await expect(canvas.queryByText('any filetype')).toBeVisible();
      });
      await expect(canvas.queryByText('.pdf')).toBeVisible();
      await userEvent.click(canvas.getByText('.jpg'));
      // wait for dropdown to close and selected option to be visible;
      await waitFor(async () => {
        await expect(canvas.queryByText('.pdf')).toBeNull();
      });
      await expect(canvas.queryByText('.jpg')).toBeVisible();
    });

    await step('Submit configuration', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      // See EditForm.defaultValues for the defaults
      expect(args.onSubmit).toHaveBeenCalledWith({
        type: 'file',
        id: 'kiweljhr',
        webcam: false,
        options: {withCredentials: true},
        storage: 'url',
        url: '',
        // basic tab
        label: 'A file upload',
        key: 'aFileUpload',
        description: '',
        tooltip: '',
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
        multiple: false,
        hidden: false,
        clearOnHide: true,
        isSensitiveData: true,
        // Advanced tab
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
        // Validation tab
        validate: {
          required: false,
        },
        translatedErrors: {
          nl: {required: ''},
        },
        // file tab
        file: {
          name: '',
          type: ['image/jpeg'],
          allowedTypesLabels: ['.jpg'], // derived from file.type
        },
        filePattern: 'image/jpeg', // derived from file.type
        useConfigFiletypes: false,
        of: {
          image: {
            resize: {
              apply: false,
              width: 2000,
              height: 2000,
            },
          },
        },
        fileMaxSize: '10MB',
        maxNumberOfFiles: null,
        // registration tab
        registration: {
          informatieobjecttype: '',
          bronorganisatie: '',
          docVertrouwelijkheidaanduiding: '',
          titel: '',
        },
      });
    });
  },
};

export const SelectBoxes: Story = {
  render: Template,
  name: 'type: selectboxes',

  args: {
    component: {
      id: 'wqimsadk',
      type: 'selectboxes',
      key: 'selectboxes',
      label: 'A selectboxes field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
      defaultValue: {},
    },

    builderInfo: {
      title: 'Select Boxes',
      icon: 'plus-square',
      group: 'basic',
      weight: 60,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const editForm = within(canvas.getByTestId('componentEditForm'));
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('A selectboxes field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aSelectboxesField');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();

    // ensure that changing fields in the edit form properly update the preview

    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByRole('checkbox');
    await expect(previewInput).not.toBeChecked();

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await step('Set up manual options', async () => {
      // enter some possible options
      const firstOptionLabelInput = canvas.getByLabelText('Option label');
      expect(firstOptionLabelInput).toHaveDisplayValue('');
      await userEvent.type(firstOptionLabelInput, 'Option label 1');
      const firstOptionValue = canvas.getByLabelText('Option value');
      await waitFor(() => expect(firstOptionValue).toHaveDisplayValue('optionLabel1'));

      // add a second option
      await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
      const optionLabels = canvas.queryAllByLabelText('Option label');
      const optionValues = canvas.queryAllByLabelText('Option value');
      expect(optionLabels).toHaveLength(2);
      expect(optionValues).toHaveLength(2);
      await userEvent.type(optionValues[1], 'manualValue');
      await userEvent.type(optionLabels[1], 'Second option');

      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalledWith({
        id: 'wqimsadk',
        type: 'selectboxes',
        // basic tab
        label: 'Other label',
        key: 'customKey',
        description: '',
        tooltip: '',
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
        hidden: false,
        clearOnHide: true,
        isSensitiveData: false,
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
        values: [
          {
            value: 'optionLabel1',
            label: 'Option label 1',
          },
          {
            value: 'manualValue',
            label: 'Second option',
            openForms: {translations: {}},
          },
        ],
        defaultValue: {
          optionLabel1: false,
          manualValue: false,
        },
        // Advanced tab
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
        // Validation tab
        validate: {
          required: false,
          plugins: [],
        },
        translatedErrors: {
          nl: {
            required: '',
            minSelectedCount: '',
            maxSelectedCount: '',
          },
        },
        // registration tab
        registration: {
          attribute: '',
        },
      });
      // @ts-expect-error
      args.onSubmit.mockClear();
    });

    await step('Option labels are translatable', async () => {
      await userEvent.click(canvas.getByRole('tab', {name: 'Translations'}));

      // check that the option labels are in the translations table
      expect(await editForm.findByText('Option label 1')).toBeVisible();
      expect(await editForm.findByText('Second option')).toBeVisible();
    });

    await step('Set up itemsExpression for options', async () => {
      await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));

      canvas.getByLabelText('Data source').focus();
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('From variable'));
      const itemsExpressionInput = canvas.getByLabelText('Items expression');
      await userEvent.clear(itemsExpressionInput);
      // { needs to be escaped: https://github.com/testing-library/user-event/issues/584
      const expression = '{"var": "someVar"}'.replace(/[{[]/g, '$&$&');
      await userEvent.type(itemsExpressionInput, expression);

      await expect(editForm.queryByLabelText('Default value')).toBeNull();
      await expect(preview.getByRole('checkbox', {name: /Options from expression:/})).toBeVisible();

      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalledWith({
        id: 'wqimsadk',
        type: 'selectboxes',
        // basic tab
        label: 'Other label',
        key: 'customKey',
        description: '',
        tooltip: '',
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
        hidden: false,
        clearOnHide: true,
        isSensitiveData: false,
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'someVar'},
          translations: {},
        },
        defaultValue: {},
        // Advanced tab
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
        // Validation tab
        validate: {
          required: false,
          plugins: [],
        },
        translatedErrors: {
          nl: {
            required: '',
            minSelectedCount: '',
            maxSelectedCount: '',
          },
        },
        // registration tab
        registration: {
          attribute: '',
        },
      });
      // @ts-expect-error
      args.onSubmit.mockClear();
    });
  },
};

export const Radio: Story = {
  render: Template,
  name: 'type: radio',

  args: {
    component: {
      id: 'wqimsadk',
      type: 'radio',
      key: 'radio',
      label: 'A radio field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [],
      defaultValue: '',
    },

    builderInfo: {
      title: 'Radio',
      icon: 'dot-circle-o',
      group: 'basic',
      weight: 100,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const editForm = within(canvas.getByTestId('componentEditForm'));
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('A radio field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aRadioField');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();

    // ensure that changing fields in the edit form properly update the preview

    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByRole('radio');
    await expect(previewInput).toBeChecked(); // matches '' value

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await step('Set up manual options', async () => {
      // enter some possible options
      const firstOptionLabelInput = canvas.getByLabelText('Option label');
      expect(firstOptionLabelInput).toHaveDisplayValue('');
      await userEvent.type(firstOptionLabelInput, 'Option label 1');
      const firstOptionValue = canvas.getByLabelText('Option value');
      await waitFor(() => expect(firstOptionValue).toHaveDisplayValue('optionLabel1'));

      // add a second option
      await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
      const optionLabels = canvas.queryAllByLabelText('Option label');
      const optionValues = canvas.queryAllByLabelText('Option value');
      expect(optionLabels).toHaveLength(2);
      expect(optionValues).toHaveLength(2);
      await userEvent.type(optionValues[1], 'manualValue');
      await userEvent.type(optionLabels[1], 'Second option');

      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalledWith({
        id: 'wqimsadk',
        type: 'radio',
        // basic tab
        label: 'Other label',
        key: 'customKey',
        description: '',
        tooltip: '',
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
        hidden: false,
        clearOnHide: true,
        isSensitiveData: false,
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
        values: [
          {
            value: 'optionLabel1',
            label: 'Option label 1',
          },
          {
            value: 'manualValue',
            label: 'Second option',
            openForms: {translations: {}},
          },
        ],
        defaultValue: '',
        // Advanced tab
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
        // Validation tab
        validate: {
          required: false,
          plugins: [],
        },
        translatedErrors: {
          nl: {required: ''},
        },
        // registration tab
        registration: {
          attribute: '',
        },
      });
      // @ts-expect-error
      args.onSubmit.mockClear();
    });

    await step('Option labels are translatable', async () => {
      await userEvent.click(canvas.getByRole('tab', {name: 'Translations'}));

      // check that the option labels are in the translations table
      expect(await editForm.findByText('Option label 1')).toBeVisible();
      expect(await editForm.findByText('Second option')).toBeVisible();
    });

    await step('Set up itemsExpression for options', async () => {
      await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));

      canvas.getByLabelText('Data source').focus();
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('From variable'));
      const itemsExpressionInput = canvas.getByLabelText('Items expression');
      await userEvent.clear(itemsExpressionInput);
      // { needs to be escaped: https://github.com/testing-library/user-event/issues/584
      const expression = '{"var": "someVar"}'.replace(/[{[]/g, '$&$&');
      await userEvent.type(itemsExpressionInput, expression);

      await expect(editForm.queryByLabelText('Default value')).toBeNull();
      await expect(preview.getByRole('radio', {name: /Options from expression:/})).toBeVisible();

      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalledWith({
        id: 'wqimsadk',
        type: 'radio',
        // basic tab
        label: 'Other label',
        key: 'customKey',
        description: '',
        tooltip: '',
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
        hidden: false,
        clearOnHide: true,
        isSensitiveData: false,
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'someVar'},
          translations: {},
        },
        defaultValue: '',
        // Advanced tab
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
        // Validation tab
        validate: {
          required: false,
          plugins: [],
        },
        translatedErrors: {
          nl: {required: ''},
        },
        // registration tab
        registration: {
          attribute: '',
        },
      });
      // @ts-expect-error
      args.onSubmit.mockClear();
    });
  },
};

export const Select: Story = {
  render: Template,
  name: 'type: select',

  args: {
    component: {
      id: 'wqimsadk',
      type: 'select',
      key: 'select',
      label: 'A select field',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      dataSrc: 'values',
      data: {values: []},
      defaultValue: '',
    },

    builderInfo: {
      title: 'Select',
      icon: 'th-list',
      group: 'basic',
      weight: 70,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const editForm = within(canvas.getByTestId('componentEditForm'));
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('A select field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aSelectField');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();

    // ensure that changing fields in the edit form properly update the preview

    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
    expect(await preview.findByText('Updated preview label'));

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await step('Set up manual options', async () => {
      // enter some possible options
      const firstOptionLabelInput = canvas.getByLabelText('Option label');
      expect(firstOptionLabelInput).toHaveDisplayValue('');
      await userEvent.type(firstOptionLabelInput, 'Option label 1');
      const firstOptionValue = canvas.getByLabelText('Option value');
      await waitFor(() => expect(firstOptionValue).toHaveDisplayValue('optionLabel1'));

      // add a second option
      await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
      const optionLabels = canvas.queryAllByLabelText('Option label');
      const optionValues = canvas.queryAllByLabelText('Option value');
      expect(optionLabels).toHaveLength(2);
      expect(optionValues).toHaveLength(2);
      await userEvent.type(optionValues[1], 'manualValue');
      await userEvent.type(optionLabels[1], 'Second option');

      const previewSearchInput = preview.getByLabelText('Other label');
      previewSearchInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await preview.findByRole('listbox');
      await expect(await preview.findByRole('option', {name: 'Second option'})).toBeVisible();
      await userEvent.keyboard('[Escape]');
      await waitFor(async () => {
        expect(preview.queryByRole('listbox')).toBeNull();
      });

      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalledWith({
        id: 'wqimsadk',
        type: 'select',
        // basic tab
        label: 'Other label',
        key: 'customKey',
        description: '',
        tooltip: '',
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
        hidden: false,
        clearOnHide: true,
        isSensitiveData: false,
        dataSrc: 'values',
        data: {
          values: [
            {
              value: 'optionLabel1',
              label: 'Option label 1',
            },
            {
              value: 'manualValue',
              label: 'Second option',
              openForms: {translations: {}},
            },
          ],
        },
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
        defaultValue: '',
        // Advanced tab
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
        // Validation tab
        validate: {
          required: false,
          plugins: [],
        },
        translatedErrors: {
          nl: {required: ''},
        },
        // registration tab
        registration: {
          attribute: '',
        },
      });
      // @ts-expect-error
      args.onSubmit.mockClear();
    });

    await step('Option labels are translatable', async () => {
      await userEvent.click(canvas.getByRole('tab', {name: 'Translations'}));

      // check that the option labels are in the translations table
      expect(await editForm.findByText('Option label 1')).toBeVisible();
      expect(await editForm.findByText('Second option')).toBeVisible();
    });

    await step('Set up itemsExpression for options', async () => {
      await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));

      canvas.getByLabelText('Data source').focus();
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('From variable'));
      const itemsExpressionInput = canvas.getByLabelText('Items expression');
      await userEvent.clear(itemsExpressionInput);
      // { needs to be escaped: https://github.com/testing-library/user-event/issues/584
      const expression = '{"var": "someVar"}'.replace(/[{[]/g, '$&$&');
      await userEvent.type(itemsExpressionInput, expression);

      await expect(editForm.queryByLabelText('Default value')).toBeNull();

      const previewSearchInput = preview.getByLabelText('Other label');
      previewSearchInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await expect(await preview.findByText(/"someVar"/)).toBeVisible();
      await userEvent.keyboard('[Escape]');

      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalledWith({
        id: 'wqimsadk',
        type: 'select',
        // basic tab
        label: 'Other label',
        key: 'customKey',
        description: '',
        tooltip: '',
        showInSummary: true,
        showInEmail: false,
        showInPDF: true,
        hidden: false,
        clearOnHide: true,
        isSensitiveData: false,
        dataSrc: 'values',
        data: {},
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'someVar'},
          translations: {},
        },
        defaultValue: '',
        // Advanced tab
        conditional: {
          show: undefined,
          when: '',
          eq: '',
        },
        // Validation tab
        validate: {
          required: false,
          plugins: [],
        },
        translatedErrors: {
          nl: {required: ''},
        },
        // registration tab
        registration: {
          attribute: '',
        },
      });
      // @ts-expect-error
      args.onSubmit.mockClear();
    });
  },
};

export const BSN: Story = {
  render: Template,
  name: 'type: bsn',

  args: {
    component: {
      id: 'wekruya',
      inputMask: '999999999',
      validateOn: 'blur',
      type: 'bsn',
      key: 'bsn',
      label: 'A BSN field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'BSN Field',
      icon: 'id-card-o',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A BSN field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aBsnField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('text');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('text');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Checkbox: Story = {
  render: Template,
  name: 'type: checkbox',

  args: {
    component: {
      id: 'wekruya',
      type: 'checkbox',
      key: 'checkbox',
      label: 'A checkbox field',
      validate: {
        required: false,
      },
      defaultValue: false,
    },

    builderInfo: {
      title: 'Checkbox',
      icon: 'check-square',
      group: 'basic',
      weight: 50,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A checkbox field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aCheckboxField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).not.toBeChecked();
    await expect(previewInput.type).toEqual('checkbox');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Currency: Story = {
  render: Template,
  name: 'type: currency',

  args: {
    component: {
      id: 'wekruya',
      type: 'currency',
      currency: 'EUR',
      key: 'currency',
      label: 'A currency field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Currency',
      icon: 'eur',
      group: 'basic',
      weight: 70,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A currency field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aCurrencyField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('number');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Iban: Story = {
  render: Template,
  name: 'type: iban',

  args: {
    component: {
      id: 'wekruya',
      type: 'iban',
      validateOn: 'blur',
      key: 'iban',
      label: 'An IBAN field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'IBAN Field',
      icon: 'wallet',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('An IBAN field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('anIbanField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('text');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('text');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const LicensePlate: Story = {
  render: Template,
  name: 'type: licenseplate',

  args: {
    component: {
      id: 'wekruya',
      type: 'licenseplate',
      validateOn: 'blur',
      key: 'licenseplate',
      label: 'A license plate field',
      validate: {
        required: false,
        pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
      },
    },

    builderInfo: {
      title: 'licenseplate Field',
      icon: 'wallet',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A license plate field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aLicensePlateField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('text');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview and default
    // value field. We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);
    await waitFor(async () => {
      await expect(await canvas.findByTestId('input-defaultValue[0]')).toBeVisible();
    });

    const defaultInput0 = canvas.getByTestId<HTMLInputElement>('input-defaultValue[0]');
    await expect(defaultInput0.type).toEqual('text');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const NpFamilyMembers: Story = {
  render: Template,
  name: 'type: npFamilyMembers',

  args: {
    component: {
      id: 'wqimsadk',
      type: 'npFamilyMembers',
      key: 'npFamilyMembers',
      label: 'An npFamilyMembers field',
      includeChildren: true,
      includePartners: false,
    },

    builderInfo: {
      title: 'Family members',
      icon: 'users',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('An npFamilyMembers field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('anNpFamilyMembersField');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();

    // ensure that changing fields in the edit form properly update the preview

    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
    await expect(await preview.findByText('Updated preview label')).toBeVisible();

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await step('Toggling options updates preview', async () => {
      const childrenCheckbox = await preview.findByLabelText('Child 1');
      await expect(childrenCheckbox).toBeVisible();
      await expect(childrenCheckbox).not.toBeChecked();

      let partnersCheckbox = preview.queryByLabelText('Partner 1');
      await expect(partnersCheckbox).toBeNull();

      const partnersOption = canvas.getByLabelText('Include partners');
      fireEvent.click(partnersOption);
      await waitFor(async () => {
        await expect(partnersOption).toBeChecked();
      });
      partnersCheckbox = await preview.findByLabelText('Partner 1');
      await expect(partnersCheckbox).toBeVisible();
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      await expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const AddressNL: Story = {
  render: Template,
  name: 'type: addressNL',

  args: {
    component: {
      id: 'wekruya',
      type: 'addressNL',
      key: 'address',
      label: 'A Dutch address',
      validate: {
        required: false,
      },
    },
    builderInfo: {
      title: 'Address Field',
      icon: 'home',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A Dutch address');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aDutchAddress');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByText('Updated preview label');
    await expect(previewInput).toBeVisible();

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
    // not have any value, which triggers the generate-key-from-label behaviour.
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const Columns: Story = {
  render: Template,
  name: 'type: columns',

  args: {
    component: {
      id: 'wekruya',
      type: 'columns',
      key: 'columns',
      columns: [],
    },

    builderInfo: {
      title: 'Columns',
      icon: 'columns',
      group: 'layout',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args, step}) => {
    const canvas = within(canvasElement);

    await step('Label is not relevant for columns', async () => {
      const labelInput = canvas.queryByLabelText('Label');
      expect(labelInput).toBeNull();
    });

    await step('Sliders for column widths', async () => {
      const defaultSliders = await canvas.findAllByRole('slider', {
        name: 'Column size, value between 1 and 12.',
      });
      expect(defaultSliders).toHaveLength(2);
      expect(defaultSliders[0]).toHaveDisplayValue('6');
      expect(defaultSliders[1]).toHaveDisplayValue('6');

      const mobileSliders = await canvas.findAllByRole('slider', {
        name: 'Column size on mobile, value between 1 and 4.',
      });
      expect(mobileSliders).toHaveLength(2);
      expect(mobileSliders[0]).toHaveDisplayValue('4');
      expect(mobileSliders[1]).toHaveDisplayValue('4');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      await expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const FieldSet: Story = {
  render: Template,
  name: 'type: fieldset',

  args: {
    component: {
      id: 'wekruya',
      type: 'fieldset',
      key: 'fieldset',
      label: 'A field set',
      hideHeader: false,
      components: [],
    },

    builderInfo: {
      title: 'Field set',
      icon: 'th-large',
      group: 'layout',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A field set');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aFieldSet');
    });
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Hidden')).not.toBeChecked();
    await expect(canvas.getByLabelText('Clear on hide')).toBeChecked();
    await expect(canvas.getByLabelText('Hide fieldset header')).not.toBeChecked();

    // ensure that changing fields in the edit form properly update the preview
    const preview = within(canvas.getByTestId('componentPreview'));

    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByText('Updated preview label');
    await expect(previewInput).toBeVisible();

    await step('Manually edit key', async () => {
      // Ensure that the manually entered key is kept instead of derived from the label,
      // even when key/label components are not mounted.
      const keyInput = canvas.getByLabelText('Property Name');
      // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
      // not have any value, which triggers the generate-key-from-label behaviour.
      fireEvent.change(keyInput, {target: {value: 'customKey'}});
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
      await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');
    });

    await step('Toggle hideHeader', async () => {
      // check that toggling the 'hideHeader' checkbox properly updates the preview. We
      // use fireEvent because firefox borks on userEvent.click, see:
      // https://github.com/testing-library/user-event/issues/1149
      fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Hide fieldset header'));
      await waitFor(() => expect(preview.queryByText('A field set')).toBeNull());
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const EditGrid: Story = {
  render: Template,
  name: 'type: editgrid',

  args: {
    component: {
      id: 'wekruya',
      type: 'editgrid',
      key: 'editgrid',
      label: 'A repeating group',
      hideLabel: false,
      groupLabel: 'Group',
      disableAddingRemovingRows: false,
      components: [],
    },

    builderInfo: {
      title: 'Repeating group',
      icon: 'repeat',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A repeating group');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aRepeatingGroup');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Group label')).toHaveValue('Group');
    await expect(canvas.getByLabelText('Hidden')).not.toBeChecked();
    await expect(canvas.getByLabelText('Clear on hide')).toBeChecked();
    await expect(canvas.getByLabelText('Hide label')).not.toBeChecked();

    // ensure that changing fields in the edit form properly update the preview
    const preview = within(canvas.getByTestId('componentPreview'));

    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
    expect(await preview.findByText('Updated preview label')).toBeVisible();

    await step('Manually edit key', async () => {
      // Ensure that the manually entered key is kept instead of derived from the label,
      // even when key/label components are not mounted.
      const keyInput = canvas.getByLabelText('Property Name');
      // fireEvent is deliberate, as userEvent.clear + userEvent.type briefly makes the field
      // not have any value, which triggers the generate-key-from-label behaviour.
      fireEvent.change(keyInput, {target: {value: 'customKey'}});
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
      await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');
    });

    await step('Toggle hideLabel', async () => {
      // check that toggling the 'hideLabel' checkbox properly updates the preview. We
      // use fireEvent because firefox borks on userEvent.click, see:
      // https://github.com/testing-library/user-event/issues/1149
      fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Hide label'));
      await waitFor(() => expect(preview.queryByText('Updated preview label')).toBeNull());
    });

    await step('Change group label', async () => {
      const groupLabelInput = canvas.getByLabelText('Group label');
      await userEvent.clear(groupLabelInput);
      await userEvent.type(groupLabelInput, 'Duckling');
      await expect(await preview.findByText('Duckling 1')).toBeVisible();
      await expect(await preview.findByText('Duckling 2')).toBeVisible();
      await expect(await preview.findByText('Duckling 3')).toBeVisible();
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const CosignV1: Story = {
  render: Template,
  name: 'type: coSign (cosign v1)',

  args: {
    component: {
      id: 'wekruya',
      type: 'coSign',
      key: 'coSign',
      label: 'A cosign v1',
      authPlugin: 'digid',
    },
    builderInfo: {
      title: 'Co-sign (old)',
      icon: 'id-card-o',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('A cosign v1');
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Hidden')).not.toBeChecked();

    // ensure that changing fields in the edit form properly update the preview
    await step('Change authPlugin', async () => {
      canvas.getByLabelText('Authentication method').focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        const eHerkenningOption = canvas.getByText('eHerkenning, provides: kvk');
        await expect(eHerkenningOption).toBeVisible();
        await userEvent.click(eHerkenningOption);
      });
      await waitFor(async () => {
        const previewBtn = preview.getByRole('button', {name: 'Cosign (eherkenning)'});
        await expect(previewBtn).toBeVisible();
      });
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const CosignV2: Story = {
  render: Template,
  name: 'type: cosign (cosign v2)',

  args: {
    component: {
      id: 'wekruya',
      type: 'cosign',
      key: 'cosign',
      label: 'A cosign v2',
      validateOn: 'blur',
    },
    builderInfo: {
      title: 'Cosign',
      icon: 'pen-nib',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('A cosign v2');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aCosignV2');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();
    await expect(canvas.getByLabelText('Hidden')).not.toBeChecked();
    await expect(canvas.queryByLabelText('Placeholder')).not.toBeInTheDocument();

    // ensure that changing fields in the edit form properly update the preview
    await step('Change label', async () => {
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
      await expect(await preview.findByText('Updated preview label')).toBeVisible();

      const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
      await expect(previewInput).toHaveDisplayValue('');
      await expect(previewInput.type).toEqual('email');
    });

    await step('Change key', async () => {
      // Ensure that the manually entered key is kept instead of derived from the label,
      // even when key/label components are not mounted.
      const keyInput = canvas.getByLabelText('Property Name');
      fireEvent.change(keyInput, {target: {value: 'customKey'}});
      await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
      await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
      await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const Password: Story = {
  render: Template,
  name: 'type: password',

  args: {
    component: {
      id: 'wekruya',
      type: 'password',
      validateOn: 'blur',
      key: 'password',
      label: 'A password field',
      validate: {
        required: false,
      },
    },

    builderInfo: {
      title: 'Password Field',
      icon: 'wallet',
      group: 'basic',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText('Label')).toHaveValue('A password field');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aPasswordField');
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
    expect(await preview.findByText('Updated preview label'));

    const previewInput = preview.getByLabelText<HTMLInputElement>('Updated preview label');
    await expect(previewInput).toHaveDisplayValue('');
    await expect(previewInput.type).toEqual('password');

    // Ensure that the manually entered key is kept instead of derived from the label,
    // even when key/label components are not mounted.
    const keyInput = canvas.getByLabelText('Property Name');
    fireEvent.change(keyInput, {target: {value: 'customKey'}});
    await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
    await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
    await userEvent.clear(canvas.getByLabelText('Label'));
    await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
    await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');

    // check that toggling the 'multiple' checkbox properly updates the preview.
    // We use fireEvent because firefox borks on userEvent.click, see:
    // https://github.com/testing-library/user-event/issues/1149
    fireEvent.click(canvas.getByLabelText<HTMLInputElement>('Multiple values'));
    await userEvent.click(preview.getByRole('button', {name: 'Add another'}));
    // await expect(preview.getByTestId('input-customKey[0]')).toHaveDisplayValue('');
    // test for the default value inputs -> these don't have accessible labels/names :(
    const addButtons = canvas.getAllByRole('button', {name: 'Add another'});
    await userEvent.click(addButtons[0]);

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalled();
  },
};

// FIXME: this component is bad for accesibility :(
export const Signature: Story = {
  render: Template,
  name: 'type: signature',

  args: {
    component: {
      id: 'wekruya',
      type: 'signature',
      key: 'signature',
      label: 'A signature',
      footer: '',
    },

    builderInfo: {
      title: 'Signature',
      icon: 'pencil',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('A signature');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aSignature');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();
    await expect(canvas.getByLabelText('Hidden')).not.toBeChecked();
    await expect(canvas.queryByLabelText('Placeholder')).not.toBeInTheDocument();

    // ensure that changing fields in the edit form properly update the preview
    await step('Change label', async () => {
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
      await expect(await preview.findByText('Updated preview label')).toBeVisible();
    });

    await step('Change key', async () => {
      // Ensure that the manually entered key is kept instead of derived from the label,
      // even when key/label components are not mounted.
      const keyInput = canvas.getByLabelText('Property Name');
      fireEvent.change(keyInput, {target: {value: 'customKey'}});
      await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
      await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
      await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const LeafletMap: Story = {
  render: Template,
  name: 'type: map',

  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map',
    },

    builderInfo: {
      title: 'Map',
      icon: 'map',
      group: 'advanced',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);
    const preview = within(canvas.getByTestId('componentPreview'));

    await expect(canvas.getByLabelText('Label')).toHaveValue('A map');
    await waitFor(async () => {
      await expect(canvas.getByLabelText('Property Name')).toHaveValue('aMap');
    });
    await expect(canvas.getByLabelText('Description')).toHaveValue('');
    await expect(canvas.getByLabelText('Tooltip')).toHaveValue('');
    await expect(canvas.getByLabelText('Show in summary')).toBeChecked();
    await expect(canvas.getByLabelText('Show in email')).not.toBeChecked();
    await expect(canvas.getByLabelText('Show in PDF')).toBeChecked();
    await expect(canvas.getByLabelText('Hidden')).not.toBeChecked();
    await expect(canvas.queryByLabelText('Default value')).not.toBeInTheDocument();
    await expect(canvas.queryByLabelText('Placeholder')).not.toBeInTheDocument();

    // ensure that changing fields in the edit form properly update the preview
    await step('Change label', async () => {
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Updated preview label');
      await expect(await preview.findByText('Updated preview label')).toBeVisible();
    });

    await step('Change key', async () => {
      // Ensure that the manually entered key is kept instead of derived from the label,
      // even when key/label components are not mounted.
      const keyInput = canvas.getByLabelText('Property Name');
      fireEvent.change(keyInput, {target: {value: 'customKey'}});
      await userEvent.click(canvas.getByRole('tab', {name: 'Advanced'}));
      await userEvent.click(canvas.getByRole('tab', {name: 'Basic'}));
      await userEvent.clear(canvas.getByLabelText('Label'));
      await userEvent.type(canvas.getByLabelText('Label'), 'Other label', {delay: 50});
      await expect(canvas.getByLabelText('Property Name')).toHaveDisplayValue('customKey');
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalled();
    });
  },
};

export const Content: Story = {
  render: Template,
  name: 'type: content',

  args: {
    component: {
      id: 'wekruya',
      type: 'content',
      key: 'content',
      html: '<p>Hello storybook</p>',
    },

    builderInfo: {
      title: 'Content',
      icon: 'html5',
      group: 'layout',
      weight: 10,
      schema: {},
    },
  },

  play: async ({canvasElement, step, args}) => {
    const canvas = within(canvasElement);

    // Testing this seems to be impossible because of the lack of support for contentEditable
    // divs :(
    // await step('Edit content', async () => {
    //   await userEvent.type(...);
    // });

    await step('Set custom class', async () => {
      const searchInput = canvas.getByLabelText('CSS class');
      searchInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      const warningOption = await canvas.findByText('Warning');
      await userEvent.click(warningOption);
    });

    await step('Submit form', async () => {
      await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
      expect(args.onSubmit).toHaveBeenCalledWith({
        id: 'wekruya',
        type: 'content',
        label: '',
        html: '<p>Hello storybook</p>',
        openForms: {
          translations: {
            nl: {
              html: '<p>Hello storybook</p>',
            },
          },
        },
        key: 'content',
        hidden: false,
        showInSummary: false,
        showInEmail: false,
        showInPDF: true,
        customClass: 'warning',
        conditional: {
          eq: '',
          show: undefined,
          when: '',
        },
      } satisfies ContentComponentSchema);
    });
  },
};
