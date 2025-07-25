import {
  AddressNLComponentSchema,
  BsnComponentSchema,
  ChildrenComponentSchema,
  CosignV2ComponentSchema,
  EditGridComponentSchema,
  FieldsetComponentSchema,
  FileComponentSchema,
  PartnersComponentSchema,
  PhoneNumberComponentSchema,
  PostcodeComponentSchema,
  RadioComponentSchema,
  SelectComponentSchema,
  SelectboxesComponentSchema,
  TimeComponentSchema,
} from '@open-formulieren/types';
import {Meta, StoryObj} from '@storybook/react';
import {expect, fireEvent, fn, userEvent, waitFor, within} from '@storybook/test';

import ComponentPreview from './ComponentPreview';

export default {
  title: 'Edit form/ComponentPreview',
  component: ComponentPreview,
  args: {
    onComponentChange: fn(),
  },
} as Meta<typeof ComponentPreview>;

type Story = StoryObj<typeof ComponentPreview>;

export const TextField: Story = {
  args: {
    component: {
      type: 'textfield',
      id: 'textfield',
      key: 'textfieldPreview',
      label: 'Textfield preview',
      description: 'A preview of the textfield Formio component',
      hidden: true, // must be ignored
      placeholder: 'Sample placeholder',
      showCharCount: true,
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Textfield preview');
    await canvas.findByText('A preview of the textfield Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Textfield preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // check that user can type into the field
    await userEvent.type(input, 'typing in preview component');
    await expect(input).toHaveDisplayValue('typing in preview component');
  },
};

export const TextFieldMultiple: Story = {
  parameters: {
    formik: {
      initialValues: {
        textfieldMultiplePreview: [],
      },
    },
  },

  args: {
    component: {
      type: 'textfield',
      id: 'textfieldMultiple',
      key: 'textfieldMultiplePreview',
      label: 'Textfield multiple preview',
      multiple: true,
      description: 'Description only once',
      showCharCount: true,
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = await canvas.getByTestId('input-textfieldMultiplePreview[0]');
    await expect(input1).toHaveDisplayValue('');
    // during typing, we want immediate charcount feedback
    await userEvent.type(input1, 'Foo');
    await expect(canvas.queryByText('3 characters')).toBeInTheDocument();
    await expect(input1).toHaveDisplayValue('Foo');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId('input-textfieldMultiplePreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-textfieldMultiplePreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-textfieldMultiplePreview[1]')).not.toBeInTheDocument();
  },
};

export const Email: Story = {
  args: {
    component: {
      type: 'email',
      id: 'email',
      key: 'emailPreview',
      label: 'Email preview',
      description: 'A preview of the email Formio component',
      hidden: true, // must be ignored
      validateOn: 'blur',
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Email preview');
    await canvas.findByText('A preview of the email Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Email preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // check that user can type into the field
    await userEvent.type(input, 'hello@example.com');
    await expect(input).toHaveDisplayValue('hello@example.com');
  },
};

export const EmailWithVerification: Story = {
  args: {
    component: {
      type: 'email',
      id: 'email',
      key: 'emailPreview',
      label: 'Email preview',
      description: 'A preview of the email Formio component',
      hidden: true, // must be ignored
      validateOn: 'blur',
      openForms: {
        translations: {},
        requireVerification: true,
      },
    },
  },
};

export const EmailMultiple: Story = {
  args: {
    component: {
      type: 'email',
      id: 'email',
      key: 'emailPreview',
      label: 'Email preview',
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
      validateOn: 'blur',
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = await canvas.getByTestId<HTMLInputElement>('input-emailPreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('email');
    // during typing, we want immediate charcount feedback
    await userEvent.type(input1, 'hello@example.com');
    await expect(input1).toHaveDisplayValue('hello@example.com');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-emailPreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-emailPreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-emailPreview[1]')).not.toBeInTheDocument();
  },
};

export const NumberField: Story = {
  args: {
    component: {
      type: 'number',
      id: 'number',
      key: 'numberPreview',
      label: 'Number preview',
      description: 'A preview of the number Formio component',
      hidden: true, // must be ignored
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Number preview');
    await canvas.findByText('A preview of the number Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Number preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // check that user can type into the field
    await userEvent.type(input, '-3.14');
    await expect(input).toHaveDisplayValue('-3.14');
  },
};

export const DateField: Story = {
  args: {
    component: {
      type: 'date',
      id: 'date',
      key: 'datePreview',
      label: 'Date preview',
      description: 'A preview of the date Formio component',
      hidden: true, // must be ignored
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Date preview');
    await canvas.findByText('A preview of the date Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Date preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // typing into native date inputs is not reliable, so no such checks here
  },
};

export const DateFieldMultiple: Story = {
  args: {
    component: {
      type: 'date',
      id: 'date',
      key: 'datePreview',
      label: 'Date preview',
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-datePreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('date');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-datePreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-datePreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-datePreview[1]')).not.toBeInTheDocument();
  },
};

export const DateTimeField: Story = {
  args: {
    component: {
      type: 'datetime',
      id: 'datetime',
      key: 'datetimePreview',
      label: 'DateTime preview',
      description: 'A preview of the datetime Formio component',
      hidden: true, // must be ignored
    },
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('DateTime preview');
    await canvas.findByText('A preview of the datetime Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('DateTime preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // typing into native datetime inputs is not reliable, so no such checks here
  },
};

export const DateTimeFieldMultiple: Story = {
  args: {
    component: {
      type: 'datetime',
      id: 'datetime',
      key: 'datetimePreview',
      label: 'DateTime preview',
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-datetimePreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('datetime-local');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-datetimePreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-datetimePreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-datetimePreview[1]')).not.toBeInTheDocument();
  },
};

export const TimeField: Story = {
  args: {
    component: {
      type: 'time',
      id: 'time',
      key: 'timePreview',
      label: 'Time preview',
      inputType: 'text',
      format: 'HH:mm',
      validateOn: 'blur',
      description: 'A preview of the time Formio component',
      hidden: true, // must be ignored
    } satisfies TimeComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Time preview');
    await canvas.findByText('A preview of the time Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Time preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    // typing into native time inputs is not reliable, so no such checks here
  },
};

export const TimeFieldMultiple: Story = {
  args: {
    component: {
      type: 'time',
      id: 'time',
      key: 'timePreview',
      label: 'Time preview',
      inputType: 'text',
      format: 'HH:mm',
      validateOn: 'blur',
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
    } satisfies TimeComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-timePreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('time');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-timePreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-timePreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-timePreview[1]')).not.toBeInTheDocument();
  },
};

export const Postcode: Story = {
  name: 'Postcode (deprecated)',
  args: {
    component: {
      type: 'postcode',
      id: 'postcode',
      key: 'postcodePreview',
      label: 'Postcode preview',
      description: 'A preview of the postcode Formio component',
      hidden: true, // must be ignored
      inputMask: '9999 AA',
      validate: {
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
      validateOn: 'blur',
    } satisfies PostcodeComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Postcode preview');
    await canvas.findByText('A preview of the postcode Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Postcode preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    expect(input).toHaveAttribute('placeholder', '____ __');
    await userEvent.type(input, '1015 CJ');
    expect(input).toHaveDisplayValue('1015 CJ');
  },
};

export const PostcodeMultiple: Story = {
  name: 'Postcode (deprecated) Multiple',
  args: {
    component: {
      type: 'postcode',
      id: 'postcode',
      key: 'postcodePreview',
      label: 'Postcode preview',
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
      inputMask: '9999 AA',
      validate: {
        pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
      },
      validateOn: 'blur',
    } satisfies PostcodeComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-postcodePreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('text');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-postcodePreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-postcodePreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-postcodePreview[1]')).not.toBeInTheDocument();
  },
};

export const PhoneNumber: Story = {
  name: 'PhoneNumber',
  args: {
    component: {
      type: 'phoneNumber',
      id: 'phoneNumber',
      key: 'phoneNumber',
      label: 'Phone number preview',
      inputMask: null,
      description: 'A preview of the phoneNumber Formio component',
      hidden: true, // must be ignored
    } satisfies PhoneNumberComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Phone number preview');
    await canvas.findByText('A preview of the phoneNumber Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('Phone number preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    await userEvent.type(input, '+316 12345678');
    expect(input).toHaveDisplayValue('+316 12345678');
  },
};

export const PhoneNumberMultiple: Story = {
  name: 'PhoneNumber Multiple',
  args: {
    component: {
      type: 'phoneNumber',
      id: 'phoneNumber',
      key: 'phoneNumberPreview',
      label: 'Phone number preview',
      inputMask: null,
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
    } satisfies PhoneNumberComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-phoneNumberPreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('text');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-phoneNumberPreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-phoneNumberPreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-phoneNumberPreview[1]')).not.toBeInTheDocument();
  },
};

export const File: Story = {
  name: 'File upload',
  args: {
    component: {
      type: 'file',
      id: 'file',
      key: 'filePreview',
      label: 'File upload preview',
      webcam: false,
      options: {withCredentials: true},
      storage: 'url',
      url: '',
      file: {
        name: '',
        type: [],
        allowedTypesLabels: [],
      },
      filePattern: '*',
      description: 'A preview of the file Formio component',
    } satisfies FileComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('File upload preview');
    await canvas.findByText('A preview of the file Formio component');
  },
};

export const SelectBoxes: Story = {
  name: 'Selectboxes: manual values',
  args: {
    component: {
      type: 'selectboxes',
      id: 'selectboxes',
      key: 'selectboxesPreview',
      label: 'Selectboxes preview',
      description: 'A preview of the selectboxes Formio component',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      values: [
        {
          value: 'option1',
          label: 'Option 1',
        },
        {
          value: 'option2',
          label: 'Option 2',
        },
      ],
      defaultValue: {option1: false, option2: false},
    } satisfies SelectboxesComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Selectboxes preview');
    await canvas.findByText('A preview of the selectboxes Formio component');

    // check that the input name is set correctly
    const firstOptionInput = canvas.getByLabelText<HTMLInputElement>('Option 1');
    // @ts-ignore
    await expect(firstOptionInput.getAttribute('name').startsWith(args.component.key)).toBe(true);

    // check the toggle state of a checkbox
    await expect(firstOptionInput).not.toBeChecked();
    // https://github.com/testing-library/user-event/issues/1149 applies to radio and
    // checkbox inputs
    fireEvent.click(canvas.getByText('Option 1'));
    await expect(firstOptionInput).toBeChecked();
  },
};

export const SelectBoxesVariable: Story = {
  name: 'Selectboxes: variable for values',
  args: {
    component: {
      type: 'selectboxes',
      id: 'selectboxes',
      key: 'selectboxesPreview',
      label: 'Selectboxes preview',
      description: 'A preview of the selectboxes Formio component',
      openForms: {
        dataSrc: 'variable',
        itemsExpression: {var: 'foo'},
        translations: {},
      },
      defaultValue: {},
    } satisfies SelectboxesComponentSchema,
  },
};

export const SelectBoxesReferenceLists: Story = {
  name: 'Selectboxes: reference lists options',
  args: {
    component: {
      type: 'selectboxes',
      id: 'selectboxes',
      key: 'selectboxesPreview',
      label: 'Selectboxes preview',
      description: 'A preview of the selectboxes Formio component',
      openForms: {
        dataSrc: 'referenceLists',
        code: 'countries',
        service: 'reference-lists',
        translations: {},
      },
      defaultValue: {},
    } satisfies SelectboxesComponentSchema,
  },
  parameters: {builder: {enableContext: true}},
};

export const Radio: Story = {
  name: 'Radio: manual values',
  args: {
    component: {
      type: 'radio',
      id: 'radio',
      key: 'radioPreview',
      label: 'Radio preview',
      description: 'A preview of the radio Formio component',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      defaultValue: null,
      values: [
        {
          value: 'option1',
          label: 'Option 1',
        },
        {
          value: 'option2',
          label: 'Option 2',
        },
      ],
    } satisfies RadioComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Radio preview');
    await canvas.findByText('A preview of the radio Formio component');

    // check that the input name is set correctly
    const firstOptionInput = canvas.getByLabelText<HTMLInputElement>('Option 1');
    // @ts-ignore
    await expect(firstOptionInput.getAttribute('name').startsWith(args.component.key)).toBe(true);

    // check the toggle state of a checkbox
    await expect(firstOptionInput).not.toBeChecked();
    // https://github.com/testing-library/user-event/issues/1149 applies to radio and
    // checkbox inputs
    fireEvent.click(canvas.getByText('Option 1'));
    await expect(firstOptionInput).toBeChecked();
  },
};

export const RadioVariable: Story = {
  name: 'Radio: variable for values',
  args: {
    component: {
      type: 'radio',
      id: 'radio',
      key: 'radioPreview',
      label: 'Radio preview',
      description: 'A preview of the radio Formio component',
      openForms: {
        dataSrc: 'variable',
        itemsExpression: {var: 'foo'},
        translations: {},
      },
      defaultValue: null,
    } satisfies RadioComponentSchema,
  },
};

export const RadioReferenceLists: Story = {
  name: 'Radio: reference lists options',
  args: {
    component: {
      type: 'radio',
      id: 'radio',
      key: 'radioPreview',
      label: 'Radio preview',
      description: 'A preview of the radio Formio component',
      openForms: {
        dataSrc: 'referenceLists',
        code: 'countries',
        service: 'reference-lists',
        translations: {},
      },
      defaultValue: null,
    } satisfies RadioComponentSchema,
  },
  parameters: {
    builder: {enableContext: true},
  },
};

/**
 * A select component with manually specified options. Only a single option may be picked.
 */
export const Select: Story = {
  name: 'Select: manual values',
  args: {
    component: {
      type: 'select',
      id: 'select',
      key: 'selectPreview',
      label: 'Select preview',
      description: 'A preview of the select Formio component',
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      dataSrc: 'values',
      dataType: 'string',
      data: {
        values: [
          {
            value: 'option1',
            label: 'Option 1',
          },
          {
            value: 'option2',
            label: 'Option 2',
          },
        ],
      },
    } satisfies SelectComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Select preview');
    await canvas.findByText('A preview of the select Formio component');

    // we expect no options to be selected
    await expect(canvas.queryByText('Option 1')).toBeNull();
    await expect(canvas.queryByText('Option 2')).toBeNull();

    // opening the dropdown displays the options
    // @ts-expect-error
    canvas.getByLabelText(args.component.label).focus();
    await userEvent.keyboard('[ArrowDown]');
    await waitFor(async () => {
      await expect(await canvas.findByText('Option 1')).toBeVisible();
    });
    await expect(await canvas.findByText('Option 2')).toBeVisible();

    // selecting an option by clicking it displays it as selected
    await userEvent.click(canvas.getByText('Option 2'));
    // wait for the option list to be closed
    await waitFor(async () => {
      await expect(canvas.queryByRole('listbox')).toBeNull();
    });
    // selected value should still be displayed
    await expect(await canvas.findByText('Option 2')).toBeVisible();
  },
};

/**
 * A select component with manually specified options. Multiple options may be picked.
 */
export const SelectMultiple: Story = {
  name: 'Select: manual values, multiple',
  args: {
    component: {
      type: 'select',
      id: 'select',
      key: 'selectPreview',
      label: 'Select preview',
      description: 'A preview of the select Formio component',
      multiple: true,
      openForms: {
        dataSrc: 'manual',
        translations: {},
      },
      dataSrc: 'values',
      dataType: 'string',
      data: {
        values: [
          {
            value: 'option1',
            label: 'Option 1',
          },
          {
            value: 'option2',
            label: 'Option 2',
          },
          {
            value: 'option3',
            label: 'Option 3',
          },
        ],
      },
    } satisfies SelectComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Select preview');
    await canvas.findByText('A preview of the select Formio component');

    // we expect no options to be selected
    await expect(canvas.queryByText('Option 1')).toBeNull();
    await expect(canvas.queryByText('Option 2')).toBeNull();

    // opening the dropdown displays the options, select two of them
    // @ts-expect-error
    const searchInput = canvas.getByLabelText(args.component.label);
    searchInput.focus();
    await userEvent.keyboard('[ArrowDown]');
    await waitFor(async () => {
      await userEvent.click(await canvas.findByText('Option 3'));
    });
    searchInput.focus();
    await userEvent.keyboard('[ArrowDown]');
    await waitFor(async () => {
      await userEvent.click(await canvas.findByText('Option 1'));
    });
    // wait for the option list to be closed
    await waitFor(async () => {
      await expect(canvas.queryByRole('listbox')).toBeNull();
    });
    // selected values should still be displayed
    await waitFor(async () => {
      await expect(await canvas.findByText('Option 1')).toBeVisible();
    });
    await waitFor(async () => {
      await expect(await canvas.findByText('Option 3')).toBeVisible();
    });
  },
};

/**
 * A select component with an expression to build the option list in the backend.
 */
export const SelectVariable: Story = {
  name: 'Select: variable for values',
  args: {
    component: {
      type: 'select',
      id: 'select',
      key: 'selectPreview',
      label: 'Select preview',
      description: 'A preview of the select Formio component',
      dataSrc: 'values',
      dataType: 'string',
      openForms: {
        dataSrc: 'variable',
        itemsExpression: {var: 'foo'},
        translations: {},
      },
    } satisfies SelectComponentSchema,
  },
};

export const SelectVariableReferenceLists: Story = {
  name: 'Select: reference lists options',
  args: {
    component: {
      type: 'select',
      id: 'select',
      key: 'selectPreview',
      label: 'Select preview',
      description: 'A preview of the select Formio component',
      dataSrc: 'values',
      dataType: 'string',
      openForms: {
        dataSrc: 'referenceLists',
        code: 'countries',
        service: 'reference-lists',
        translations: {},
      },
    } satisfies SelectComponentSchema,
  },
  parameters: {
    builder: {enableContext: true},
  },
};

export const BSN: Story = {
  name: 'BSN',
  args: {
    component: {
      type: 'bsn',
      id: 'bsn',
      key: 'bsnPreview',
      label: 'BSN preview',
      description: 'A preview of the BSN Formio component',
      hidden: true, // must be ignored
      inputMask: '999999999',
      validateOn: 'blur',
    } satisfies BsnComponentSchema,
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('BSN preview');
    await canvas.findByText('A preview of the BSN Formio component');

    // check that the input name is set correctly
    const input = canvas.getByLabelText('BSN preview');
    // @ts-ignore
    await expect(input.getAttribute('name')).toBe(args.component.key);

    expect(input).toHaveAttribute('placeholder', '_________');
    await userEvent.type(input, '123456789');
    expect(input).toHaveDisplayValue('123456789');
  },
};

export const BSNMultiple: Story = {
  name: 'BSN Multiple',
  args: {
    component: {
      type: 'bsn',
      id: 'bsn',
      key: 'bsnPreview',
      label: 'BSN preview',
      description: 'Description only once',
      hidden: true, // must be ignored
      multiple: true,
      inputMask: '999999999',
      validateOn: 'blur',
    } satisfies BsnComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that new items can be added
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input1 = canvas.getByTestId<HTMLInputElement>('input-bsnPreview[0]');
    await expect(input1).toHaveDisplayValue('');
    await expect(input1.type).toEqual('text');

    // the description should be rendered only once, even with > 1 inputs
    await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
    const input2 = canvas.getByTestId<HTMLInputElement>('input-bsnPreview[1]');
    await expect(input2).toHaveDisplayValue('');
    await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);

    // finally, it should be possible delete rows again
    const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
    await expect(removeButtons.length).toBe(2);
    await userEvent.click(removeButtons[0]);
    await expect(canvas.getByTestId('input-bsnPreview[0]')).toHaveDisplayValue('');
    await expect(canvas.queryByTestId('input-bsnPreview[1]')).not.toBeInTheDocument();
  },
};

export const NpFamilyMembers: Story = {
  name: 'Family members',
  args: {
    component: {
      type: 'npFamilyMembers',
      id: 'npFamilyMembers',
      key: 'npFamilyMembersPreview',
      label: 'Family members preview',
      description: 'A preview of the family members Formio component',
      hidden: true, // must be ignored
      includeChildren: true,
      includePartners: true,
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Family members preview');
    await canvas.findByText('A preview of the family members Formio component');

    // check that the checkboxes are rendered
    const checkboxes = await canvas.findAllByRole('checkbox');
    await expect(checkboxes).toHaveLength(2);
  },
};

export const ProductPrice: Story = {
  name: 'Product price',
  args: {
    component: {
      type: 'productPrice',
      id: 'productPrice',
      key: 'productPricePreview',
      label: 'Product price preview',
      description: 'A preview of the product price Formio component',
      hidden: true, // must be ignored
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('Product price preview');
    await canvas.findByText('A preview of the product price Formio component');

    // check that the radio buttons are rendered
    await canvas.findByText('option 1: € 10,99');
    await canvas.findByText('option 2: € 15,99');
  },
};

export const AddressNL: Story = {
  name: 'addressNL',
  args: {
    component: {
      id: 'wekruya',
      type: 'addressNL',
      key: 'address',
      label: 'A Dutch address',
      validate: {
        required: false,
      },
      deriveAddress: false,
      layout: 'singleColumn',
      defaultValue: {
        postcode: '',
        houseNumber: '',
        houseLetter: '',
        houseNumberAddition: '',
        city: '',
        streetName: '',
        secretStreetCity: '',
        autoPopulated: false,
      },
    } satisfies AddressNLComponentSchema,
  },
};

export const Columns: Story = {
  name: 'Columns',
  args: {
    component: {
      id: 'wekruya',
      type: 'columns',
      key: 'columns',
      columns: [
        {
          size: 4,
          sizeMobile: 4,
          components: [],
        },
        {
          size: 4,
          sizeMobile: 2,
          components: [],
        },
        {
          size: 4,
          sizeMobile: 2,
          components: [],
        },
      ],
    },
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Column 1');
    await canvas.findByText('Column 2');
    await canvas.findByText('Column 3');

    await step('Switch to mobile preview', async () => {
      const mobileRadio = canvas.getByText('Mobile');
      await userEvent.click(mobileRadio);
    });
  },
};

export const FieldSet: Story = {
  name: 'FieldSet',
  args: {
    component: {
      id: 'wekruya',
      type: 'fieldset',
      key: 'fieldset',
      label: 'A fieldset preview',
      hidden: true, // must be ignored
      hideHeader: false,
      components: [
        // we do not display the nested components
        {
          id: 'someTextField',
          key: 'someTextField',
          type: 'textfield',
          label: 'Nested text field',
        },
      ],
    } satisfies FieldsetComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('A fieldset preview');
    await expect(canvas.queryByText('Nested text field')).toBeNull();
  },
};

export const EditGrid: Story = {
  name: 'EditGrid',
  args: {
    component: {
      id: 'wekruya',
      type: 'editgrid',
      key: 'editgrid',
      label: 'A repeating group preview',
      groupLabel: 'Item',
      hidden: true, // must be ignored
      disableAddingRemovingRows: false,
      components: [
        // we do not display the nested components
        {
          id: 'someTextField',
          key: 'someTextField',
          type: 'textfield',
          label: 'Nested text field',
        },
      ],
    } satisfies EditGridComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('A repeating group preview');
    await canvas.findByText('Item 1');
    await canvas.findByText('Item 2');
    await canvas.findByText('Item 3');
    await expect(canvas.queryByText('Nested text field')).toBeNull();
  },
};

export const CosignV1: Story = {
  name: 'Cosign v1',
  args: {
    component: {
      id: 'wekruya',
      type: 'coSign',
      key: 'coSign',
      label: 'A cosign v1 preview',
      hidden: true, // must be ignored
      authPlugin: 'digid',
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('A cosign v1 preview');
    const previewBtn = canvas.getByRole('button', {name: 'Cosign (digid)'});
    await waitFor(() => expect(previewBtn).toBeVisible());
  },
};

export const CosignV2: Story = {
  name: 'Cosign v2',
  args: {
    component: {
      id: 'wekruya',
      type: 'cosign',
      key: 'cosign',
      label: 'A cosign v2 preview',
      hidden: true, // must be ignored
      validateOn: 'blur',
    } satisfies CosignV2ComponentSchema,
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await canvas.findByText('A cosign v2 preview');
    const previewInput = canvas.getByRole<HTMLInputElement>('textbox');
    await waitFor(() => expect(previewInput).toBeVisible());
    await expect(previewInput.type).toBe('email');
  },
};

export const Signature: Story = {
  name: 'Signature',
  args: {
    component: {
      id: 'wekruya',
      type: 'signature',
      key: 'signature',
      label: 'A signature preview',
      hidden: true, // must be ignored
      footer: 'Draw above',
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await waitFor(async () => {
      await expect(await canvas.findByText('A signature preview')).toBeVisible();
      await expect(await canvas.findByText('Draw above')).toBeVisible();
    });
  },
};

export const LeafletMap: Story = {
  name: 'Map',
  args: {
    component: {
      id: 'wekruya',
      type: 'map',
      key: 'map',
      label: 'A map preview',
      hidden: true, // must be ignored
    },
  },

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // check that the user-controlled content is visible
    await waitFor(async () => {
      await expect(await canvas.findByText('A map preview')).toBeVisible();
    });

    // the map should be rendered, with zoom controls
    await expect(await canvas.findByRole('button', {name: 'Zoom in'})).toBeVisible();
    await expect(await canvas.findByRole('button', {name: 'Zoom out'})).toBeVisible();
  },
};

export const Partners: Story = {
  name: 'Partners',
  args: {
    component: {
      id: 'wekruya',
      type: 'partners',
      key: 'partners',
      label: 'A partners preview',
      tooltip: 'An example for the tooltip',
      description: 'A description for the Partners component',
      defaultValue: [],
    } satisfies PartnersComponentSchema,
  },
};

export const Children: Story = {
  name: 'Children',
  args: {
    component: {
      id: 'wekruya',
      type: 'children',
      key: 'children',
      label: 'A children preview',
      enableSelection: false,
      tooltip: 'An example for the tooltip',
      description: 'A description for the Children component',
      defaultValue: [],
    } satisfies ChildrenComponentSchema,
  },
};
