import type {
  DateComponentSchema,
  DateTimeComponentSchema,
  EmailComponentSchema,
  FileComponentSchema,
  NumberComponentSchema,
  PhoneNumberComponentSchema,
  PostcodeComponentSchema,
  TextFieldComponentSchema,
  TimeComponentSchema,
} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

import Preview from './Preview';

export default {
  title: 'Form designer/Preview',
  component: Preview,
  parameters: {
    modal: {noModal: true},
  },
} as Meta<typeof Preview>;

type Story = StoryObj<typeof Preview>;

export const TextField: Story = {
  args: {
    components: [
      {
        type: 'textfield',
        id: 'textfield',
        key: 'textfieldPreview',
        label: 'Textfield preview',
        description: 'A preview of the textfield Formio component',
        tooltip: 'A preview of the textfield Formio component',
        defaultValue: 'Default value',
        hidden: false,
        placeholder: 'Sample placeholder',
        showCharCount: true,
      } satisfies TextFieldComponentSchema,
      {
        type: 'textfield',
        id: 'textfieldHidden',
        key: 'textfieldPreviewHidden',
        label: 'Textfield preview hidden',
        description: 'A preview of the textfield Formio component in hidden state',
        tooltip: 'A preview of the textfield Formio component in hidden state',
        defaultValue: 'Default value',
        hidden: true,
        placeholder: 'Sample placeholder',
        showCharCount: true,
      } satisfies TextFieldComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Textfield preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Textfield preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const TextFieldMultiple: Story = {
  args: {
    components: [
      {
        type: 'textfield',
        id: 'textfieldMultiple',
        key: 'textfieldMultiplePreview',
        label: 'Textfield multiple preview',
        multiple: true,
        description: 'Description only once',
        tooltip: 'Description only once',
        hidden: false,
      } satisfies TextFieldComponentSchema,
      {
        type: 'textfield',
        id: 'textfieldMultipleHidden',
        key: 'textfieldMultiplePreviewHidden',
        label: 'Textfield multiple preview hidden',
        multiple: true,
        description: 'Description only once',
        tooltip: 'Description only once',
        hidden: true,
      } satisfies TextFieldComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('Textfield multiple preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('Textfield multiple preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const Email: Story = {
  args: {
    components: [
      {
        type: 'email',
        id: 'email',
        key: 'emailPreview',
        label: 'Email preview',
        description: 'A preview of the email Formio component',
        hidden: false,
      } satisfies EmailComponentSchema,
      {
        type: 'email',
        id: 'emailHidden',
        key: 'emailPreviewHidden',
        label: 'Email preview hidden',
        description: 'A preview of the email Formio component in hidden state',
        hidden: true,
      } satisfies EmailComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Email preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Email preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const EmailWithVerification: Story = {
  args: {
    components: [
      {
        type: 'email',
        id: 'email',
        key: 'emailPreview',
        label: 'Email preview',
        description: 'A preview of the email Formio component',
        hidden: false,
        openForms: {
          translations: {},
          requireVerification: true,
        },
      } satisfies EmailComponentSchema,
      {
        type: 'email',
        id: 'emailHidden',
        key: 'emailPreviewHidden',
        label: 'Email preview hidden',
        description: 'A preview of the email Formio component in hidden state',
        hidden: true,
        openForms: {
          translations: {},
          requireVerification: true,
        },
      } satisfies EmailComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Email preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Email preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const EmailMultiple: Story = {
  args: {
    components: [
      {
        type: 'email',
        id: 'email',
        key: 'emailPreview',
        label: 'Email preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies EmailComponentSchema,
      {
        type: 'email',
        id: 'emailHidden',
        key: 'emailPreviewHidden',
        label: 'Email preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies EmailComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('Email preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('Email preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const NumberField: Story = {
  args: {
    components: [
      {
        type: 'number',
        id: 'number',
        key: 'numberPreview',
        label: 'Number preview',
        description: 'A preview of the number Formio component',
        hidden: false,
      } satisfies NumberComponentSchema,
      {
        type: 'number',
        id: 'numberHidden',
        key: 'numberPreviewHidden',
        label: 'Number preview hidden',
        description: 'A preview of the number Formio component in hidden state',
        hidden: true,
      } satisfies NumberComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Number preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Number preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const DateField: Story = {
  args: {
    components: [
      {
        type: 'date',
        id: 'date',
        key: 'datePreview',
        label: 'Date preview',
        description: 'A preview of the date Formio component',
        hidden: false,
      } satisfies DateComponentSchema,
      {
        type: 'date',
        id: 'dateHidden',
        key: 'datePreviewHidden',
        label: 'Date preview hidden',
        description: 'A preview of the date Formio component in hidden state',
        hidden: true,
      } satisfies DateComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Date preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Date preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const DateFieldMultiple: Story = {
  args: {
    components: [
      {
        type: 'date',
        id: 'date',
        key: 'datePreview',
        label: 'Date preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies DateComponentSchema,
      {
        type: 'date',
        id: 'dateHidden',
        key: 'datePreviewHidden',
        label: 'Date preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies DateComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('Date preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('Date preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const DateTimeField: Story = {
  args: {
    components: [
      {
        type: 'datetime',
        id: 'datetime',
        key: 'datetimePreview',
        label: 'DateTime preview',
        description: 'A preview of the datetime Formio component',
        hidden: false,
      } satisfies DateTimeComponentSchema,
      {
        type: 'datetime',
        id: 'datetimeHidden',
        key: 'datetimePreviewHidden',
        label: 'DateTime preview hidden',
        description: 'A preview of the datetime Formio component in hidden state',
        hidden: true,
      } satisfies DateTimeComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('DateTime preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('DateTime preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const DateTimeFieldMultiple: Story = {
  args: {
    components: [
      {
        type: 'datetime',
        id: 'datetime',
        key: 'datetimePreview',
        label: 'DateTime preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies DateTimeComponentSchema,
      {
        type: 'datetime',
        id: 'datetimeHidden',
        key: 'datetimePreviewHidden',
        label: 'DateTime preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies DateTimeComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('DateTime preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('DateTime preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const TimeField: Story = {
  args: {
    components: [
      {
        type: 'time',
        id: 'time',
        key: 'timePreview',
        label: 'Time preview',
        description: 'A preview of the time Formio component',
        hidden: false,
      } satisfies TimeComponentSchema,
      {
        type: 'time',
        id: 'timeHidden',
        key: 'timePreviewHidden',
        label: 'Time preview hidden',
        description: 'A preview of the time Formio component in hidden state',
        hidden: true,
      } satisfies TimeComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Time preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Time preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const TimeFieldMultiple: Story = {
  args: {
    components: [
      {
        type: 'time',
        id: 'time',
        key: 'timePreview',
        label: 'Time preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies TimeComponentSchema,
      {
        type: 'time',
        id: 'timeHiudden',
        key: 'timePreviewHidden',
        label: 'Time preview hidden',
        description: 'Description only once for time component in hidden state',
        hidden: true,
        multiple: true,
      } satisfies TimeComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('Time preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('Time preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const Postcode: Story = {
  args: {
    components: [
      {
        type: 'postcode',
        id: 'postcode',
        key: 'postcodePreview',
        label: 'Postcode preview',
        description: 'A preview of the postcode Formio component',
        hidden: false,
        validate: {
          pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
        },
      } satisfies PostcodeComponentSchema,
      {
        type: 'postcode',
        id: 'postcodeHidden',
        key: 'postcodePreviewHidden',
        label: 'Postcode preview hidden',
        description: 'A preview of the postcode Formio component in hidden state',
        hidden: true,
        validate: {
          pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
        },
      } satisfies PostcodeComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Postcode preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Postcode preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const PostcodeMultiple: Story = {
  args: {
    components: [
      {
        type: 'postcode',
        id: 'postcode',
        key: 'postcodePreview',
        label: 'Postcode preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
        validate: {
          pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
        },
      } satisfies PostcodeComponentSchema,
      {
        type: 'postcode',
        id: 'postcodeHidden',
        key: 'postcodePreviewHidden',
        label: 'Postcode preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
        validate: {
          pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
        },
      } satisfies PostcodeComponentSchema,
    ],
  },
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('Postcode preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('Postcode preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const PhoneNumber: Story = {
  name: 'PhoneNumber',
  args: {
    components: [
      {
        type: 'phoneNumber',
        id: 'phoneNumber',
        key: 'phoneNumber',
        label: 'Phone number preview',
        description: 'A preview of the phoneNumber Formio component',
        hidden: false,
      } satisfies PhoneNumberComponentSchema,
      {
        type: 'phoneNumber',
        id: 'phoneNumberHidden',
        key: 'phoneNumberHidden',
        label: 'Phone number preview hidden',
        description: 'A preview of the phoneNumber Formio component in hidden state',
        hidden: true,
      } satisfies PhoneNumberComponentSchema,
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByLabelText('Phone number preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByLabelText('Phone number preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const PhoneNumberMultiple: Story = {
  name: 'PhoneNumber Multiple',
  args: {
    components: [
      {
        type: 'phoneNumber',
        id: 'phoneNumber',
        key: 'phoneNumberPreview',
        label: 'Phone number preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies PhoneNumberComponentSchema,
      {
        type: 'phoneNumber',
        id: 'phoneNumberHidden',
        key: 'phoneNumberPreviewHidden',
        label: 'Phone number preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies PhoneNumberComponentSchema,
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('Phone number preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('Phone number preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const File: Story = {
  name: 'File upload',
  args: {
    components: [
      {
        type: 'file',
        id: 'file',
        key: 'filePreview',
        label: 'File upload preview',
        file: {
          name: '',
          type: [],
          allowedTypesLabels: [],
        },
        filePattern: '*',
        description: 'A preview of the file Formio component',
        hidden: false,
      } satisfies FileComponentSchema,
      {
        type: 'file',
        id: 'fileHidden',
        key: 'filePreviewHidden',
        label: 'File upload preview hidden',
        file: {
          name: '',
          type: [],
          allowedTypesLabels: [],
        },
        filePattern: '*',
        description: 'A preview of the file Formio component in hidden state',
        hidden: true,
      } satisfies FileComponentSchema,
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const regularInput = canvas.getByText('File upload preview');
    expect(regularInput).toBeVisible();

    // Expect the hidden textfield to be visible and have a descriptive title
    const hiddenInput = canvas.getByText('File upload preview hidden');
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};
//
// export const SelectBoxes: Story = {
//   name: 'Selectboxes: manual values',
//   args: {
//     component: {
//       type: 'selectboxes',
//       id: 'selectboxes',
//       key: 'selectboxesPreview',
//       label: 'Selectboxes preview',
//       description: 'A preview of the selectboxes Formio component',
//       openForms: {
//         dataSrc: 'manual',
//         translations: {},
//       },
//       values: [
//         {
//           value: 'option1',
//           label: 'Option 1',
//         },
//         {
//           value: 'option2',
//           label: 'Option 2',
//         },
//       ],
//       defaultValue: {option1: false, option2: false},
//     } satisfies SelectboxesComponentSchema,
//   },
//
//   play: async ({canvasElement, args}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('Selectboxes preview');
//     await canvas.findByText('A preview of the selectboxes Formio component');
//
//     // check that the input name is set correctly
//     const firstOptionInput = canvas.getByLabelText<HTMLInputElement>('Option 1');
//     // @ts-ignore
//     await expect(firstOptionInput.getAttribute('name').startsWith(args.component.key)).toBe(true);
//
//     // check the toggle state of a checkbox
//     await expect(firstOptionInput).not.toBeChecked();
//     // https://github.com/testing-library/user-event/issues/1149 applies to radio and
//     // checkbox inputs
//     fireEvent.click(canvas.getByText('Option 1'));
//     await expect(firstOptionInput).toBeChecked();
//   },
// };
//
// export const SelectBoxesVariable: Story = {
//   name: 'Selectboxes: variable for values',
//   args: {
//     component: {
//       type: 'selectboxes',
//       id: 'selectboxes',
//       key: 'selectboxesPreview',
//       label: 'Selectboxes preview',
//       description: 'A preview of the selectboxes Formio component',
//       openForms: {
//         dataSrc: 'variable',
//         itemsExpression: {var: 'foo'},
//         translations: {},
//       },
//       values: [],
//       defaultValue: {},
//     } satisfies SelectboxesComponentSchema,
//   },
// };
//
// export const SelectBoxesReferenceLists: Story = {
//   name: 'Selectboxes: reference lists options',
//   args: {
//     component: {
//       type: 'selectboxes',
//       id: 'selectboxes',
//       key: 'selectboxesPreview',
//       label: 'Selectboxes preview',
//       description: 'A preview of the selectboxes Formio component',
//       openForms: {
//         dataSrc: 'referenceLists',
//         code: 'countries',
//         service: 'reference-lists',
//         translations: {},
//       },
//       values: [],
//       defaultValue: {},
//     } satisfies SelectboxesComponentSchema,
//   },
//   parameters: {builder: {enableContext: true}},
// };
//
// export const Radio: Story = {
//   name: 'Radio: manual values',
//   args: {
//     component: {
//       type: 'radio',
//       id: 'radio',
//       key: 'radioPreview',
//       label: 'Radio preview',
//       description: 'A preview of the radio Formio component',
//       openForms: {
//         dataSrc: 'manual',
//         translations: {},
//       },
//       defaultValue: null,
//       values: [
//         {
//           value: 'option1',
//           label: 'Option 1',
//         },
//         {
//           value: 'option2',
//           label: 'Option 2',
//         },
//       ],
//     } satisfies RadioComponentSchema,
//   },
//
//   play: async ({canvasElement, args}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('Radio preview');
//     await canvas.findByText('A preview of the radio Formio component');
//
//     // check that the input name is set correctly
//     const firstOptionInput = canvas.getByLabelText<HTMLInputElement>('Option 1');
//     // @ts-ignore
//     await expect(firstOptionInput.getAttribute('name').startsWith(args.component.key)).toBe(true);
//
//     // check the toggle state of a checkbox
//     await expect(firstOptionInput).not.toBeChecked();
//     // https://github.com/testing-library/user-event/issues/1149 applies to radio and
//     // checkbox inputs
//     fireEvent.click(canvas.getByText('Option 1'));
//     await expect(firstOptionInput).toBeChecked();
//   },
// };
//
// export const RadioVariable: Story = {
//   name: 'Radio: variable for values',
//   args: {
//     component: {
//       type: 'radio',
//       id: 'radio',
//       key: 'radioPreview',
//       label: 'Radio preview',
//       description: 'A preview of the radio Formio component',
//       openForms: {
//         dataSrc: 'variable',
//         itemsExpression: {var: 'foo'},
//         translations: {},
//       },
//       values: [],
//       defaultValue: null,
//     } satisfies RadioComponentSchema,
//   },
// };
//
// export const RadioReferenceLists: Story = {
//   name: 'Radio: reference lists options',
//   args: {
//     component: {
//       type: 'radio',
//       id: 'radio',
//       key: 'radioPreview',
//       label: 'Radio preview',
//       description: 'A preview of the radio Formio component',
//       openForms: {
//         dataSrc: 'referenceLists',
//         code: 'countries',
//         service: 'reference-lists',
//         translations: {},
//       },
//       values: [],
//       defaultValue: null,
//     } satisfies RadioComponentSchema,
//   },
//   parameters: {
//     builder: {enableContext: true},
//   },
// };
//
// /**
//  * A select component with manually specified options. Only a single option may be picked.
//  */
// export const Select: Story = {
//   name: 'Select: manual values',
//   args: {
//     component: {
//       type: 'select',
//       id: 'select',
//       key: 'selectPreview',
//       label: 'Select preview',
//       description: 'A preview of the select Formio component',
//       openForms: {
//         dataSrc: 'manual',
//         translations: {},
//       },
//       data: {
//         values: [
//           {
//             value: 'option1',
//             label: 'Option 1',
//           },
//           {
//             value: 'option2',
//             label: 'Option 2',
//           },
//         ],
//       },
//     } satisfies SelectComponentSchema,
//   },
//
//   play: async ({canvasElement, args}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('Select preview');
//     await canvas.findByText('A preview of the select Formio component');
//
//     // we expect no options to be selected
//     await expect(canvas.queryByText('Option 1')).toBeNull();
//     await expect(canvas.queryByText('Option 2')).toBeNull();
//
//     // opening the dropdown displays the options
//     // @ts-expect-error
//     canvas.getByLabelText(args.component.label).focus();
//     await userEvent.keyboard('[ArrowDown]');
//     await waitFor(async () => {
//       await expect(await canvas.findByText('Option 1')).toBeVisible();
//     });
//     await expect(await canvas.findByText('Option 2')).toBeVisible();
//
//     // selecting an option by clicking it displays it as selected
//     await userEvent.click(canvas.getByText('Option 2'));
//     // wait for the option list to be closed
//     await waitFor(async () => {
//       await expect(canvas.queryByRole('listbox')).toBeNull();
//     });
//     // selected value should still be displayed
//     await expect(await canvas.findByText('Option 2')).toBeVisible();
//   },
// };
//
// /**
//  * A select component with manually specified options. Multiple options may be picked.
//  */
// export const SelectMultiple: Story = {
//   name: 'Select: manual values, multiple',
//   args: {
//     component: {
//       type: 'select',
//       id: 'select',
//       key: 'selectPreview',
//       label: 'Select preview',
//       description: 'A preview of the select Formio component',
//       multiple: true,
//       openForms: {
//         dataSrc: 'manual',
//         translations: {},
//       },
//       data: {
//         values: [
//           {
//             value: 'option1',
//             label: 'Option 1',
//           },
//           {
//             value: 'option2',
//             label: 'Option 2',
//           },
//           {
//             value: 'option3',
//             label: 'Option 3',
//           },
//         ],
//       },
//     } satisfies SelectComponentSchema,
//   },
//
//   play: async ({canvasElement, args}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('Select preview');
//     await canvas.findByText('A preview of the select Formio component');
//
//     // we expect no options to be selected
//     await expect(canvas.queryByText('Option 1')).toBeNull();
//     await expect(canvas.queryByText('Option 2')).toBeNull();
//
//     // opening the dropdown displays the options, select two of them
//     // @ts-expect-error
//     const searchInput = canvas.getByLabelText(args.component.label);
//     searchInput.focus();
//     await userEvent.keyboard('[ArrowDown]');
//     await waitFor(async () => {
//       await userEvent.click(await canvas.findByText('Option 3'));
//     });
//     searchInput.focus();
//     await userEvent.keyboard('[ArrowDown]');
//     await waitFor(async () => {
//       await userEvent.click(await canvas.findByText('Option 1'));
//     });
//     // wait for the option list to be closed
//     await waitFor(async () => {
//       await expect(canvas.queryByRole('listbox')).toBeNull();
//     });
//     // selected values should still be displayed
//     await waitFor(async () => {
//       await expect(await canvas.findByText('Option 1')).toBeVisible();
//     });
//     await waitFor(async () => {
//       await expect(await canvas.findByText('Option 3')).toBeVisible();
//     });
//   },
// };
//
// /**
//  * A select component with an expression to build the option list in the backend.
//  */
// export const SelectVariable: Story = {
//   name: 'Select: variable for values',
//   args: {
//     component: {
//       type: 'select',
//       id: 'select',
//       key: 'selectPreview',
//       label: 'Select preview',
//       description: 'A preview of the select Formio component',
//       openForms: {
//         dataSrc: 'variable',
//         itemsExpression: {var: 'foo'},
//         translations: {},
//       },
//       data: {values: []},
//     } satisfies SelectComponentSchema,
//   },
// };
//
// export const SelectVariableReferenceLists: Story = {
//   name: 'Select: reference lists options',
//   args: {
//     component: {
//       type: 'select',
//       id: 'select',
//       key: 'selectPreview',
//       label: 'Select preview',
//       description: 'A preview of the select Formio component',
//       openForms: {
//         dataSrc: 'referenceLists',
//         code: 'countries',
//         service: 'reference-lists',
//         translations: {},
//       },
//       data: {values: []},
//     } satisfies SelectComponentSchema,
//   },
//   parameters: {
//     builder: {enableContext: true},
//   },
// };
//
// export const BSN: Story = {
//   name: 'BSN',
//   args: {
//     component: {
//       type: 'bsn',
//       id: 'bsn',
//       key: 'bsnPreview',
//       label: 'BSN preview',
//       description: 'A preview of the BSN Formio component',
//       hidden: true, // must be ignored
//     } satisfies BsnComponentSchema,
//   },
//
//   play: async ({canvasElement, args}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('BSN preview');
//     await canvas.findByText('A preview of the BSN Formio component');
//
//     // check that the input name is set correctly
//     const input = canvas.getByLabelText('BSN preview');
//     // @ts-ignore
//     await expect(input.getAttribute('name')).toBe(args.component.key);
//
//     expect(input).toHaveAttribute('placeholder', '_________');
//     await userEvent.type(input, '123456789');
//     expect(input).toHaveDisplayValue('123456789');
//   },
// };
//
// export const BSNMultiple: Story = {
//   name: 'BSN Multiple',
//   args: {
//     component: {
//       type: 'bsn',
//       id: 'bsn',
//       key: 'bsnPreview',
//       label: 'BSN preview',
//       description: 'Description only once',
//       hidden: true, // must be ignored
//       multiple: true,
//     } satisfies BsnComponentSchema,
//   },
//
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that new items can be added
//     await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
//     const input1 = canvas.getByTestId<HTMLInputElement>('input-bsnPreview[0]');
//     await expect(input1).toHaveDisplayValue('');
//     await expect(input1.type).toEqual('text');
//
//     // the description should be rendered only once, even with > 1 inputs
//     await userEvent.click(canvas.getByRole('button', {name: 'Add another'}));
//     const input2 = canvas.getByTestId<HTMLInputElement>('input-bsnPreview[1]');
//     await expect(input2).toHaveDisplayValue('');
//     await expect(canvas.queryAllByText('Description only once')).toHaveLength(1);
//
//     // finally, it should be possible delete rows again
//     const removeButtons = await canvas.findAllByRole('button', {name: 'Remove item'});
//     await expect(removeButtons.length).toBe(2);
//     await userEvent.click(removeButtons[0]);
//     await expect(canvas.getByTestId('input-bsnPreview[0]')).toHaveDisplayValue('');
//     await expect(canvas.queryByTestId('input-bsnPreview[1]')).not.toBeInTheDocument();
//   },
// };
//
// export const NpFamilyMembers: Story = {
//   name: 'Family members',
//   args: {
//     component: {
//       type: 'npFamilyMembers',
//       id: 'npFamilyMembers',
//       key: 'npFamilyMembersPreview',
//       label: 'Family members preview',
//       description: 'A preview of the family members Formio component',
//       hidden: true, // must be ignored
//       includeChildren: true,
//       includePartners: true,
//     },
//   },
//
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('Family members preview');
//     await canvas.findByText('A preview of the family members Formio component');
//
//     // check that the checkboxes are rendered
//     const checkboxes = await canvas.findAllByRole('checkbox');
//     await expect(checkboxes).toHaveLength(2);
//   },
// };
//
// export const AddressNL: Story = {
//   name: 'addressNL',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'addressNL',
//       key: 'address',
//       label: 'A Dutch address',
//       validate: {
//         required: false,
//       },
//       deriveAddress: false,
//       layout: 'singleColumn',
//     } satisfies AddressNLComponentSchema,
//   },
// };
//
// export const Columns: Story = {
//   name: 'Columns',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'columns',
//       key: 'columns',
//       columns: [
//         {
//           size: 4,
//           sizeMobile: 4,
//           components: [],
//         },
//         {
//           size: 4,
//           sizeMobile: 2,
//           components: [],
//         },
//         {
//           size: 4,
//           sizeMobile: 2,
//           components: [],
//         },
//       ],
//     },
//   },
//
//   play: async ({canvasElement, step}) => {
//     const canvas = within(canvasElement);
//
//     await canvas.findByText('Column 1');
//     await canvas.findByText('Column 2');
//     await canvas.findByText('Column 3');
//
//     await step('Switch to mobile preview', async () => {
//       const mobileRadio = canvas.getByText('Mobile');
//       await userEvent.click(mobileRadio);
//     });
//   },
// };
//
// export const FieldSet: Story = {
//   name: 'FieldSet',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'fieldset',
//       key: 'fieldset',
//       label: 'A fieldset preview',
//       hidden: true, // must be ignored
//       hideHeader: false,
//       components: [
//         // we do not display the nested components
//         {
//           id: 'someTextField',
//           key: 'someTextField',
//           type: 'textfield',
//           label: 'Nested text field',
//         },
//       ],
//     } satisfies FieldsetComponentSchema,
//   },
//
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('A fieldset preview');
//     await expect(canvas.queryByText('Nested text field')).toBeNull();
//   },
// };
//
// export const EditGrid: Story = {
//   name: 'EditGrid',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'editgrid',
//       key: 'editgrid',
//       label: 'A repeating group preview',
//       groupLabel: 'Item',
//       hidden: true, // must be ignored
//       disableAddingRemovingRows: false,
//       components: [
//         // we do not display the nested components
//         {
//           id: 'someTextField',
//           key: 'someTextField',
//           type: 'textfield',
//           label: 'Nested text field',
//         },
//       ],
//     } satisfies EditGridComponentSchema,
//   },
//
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('A repeating group preview');
//     await canvas.findByText('Item 1');
//     await canvas.findByText('Item 2');
//     await canvas.findByText('Item 3');
//     await expect(canvas.queryByText('Nested text field')).toBeNull();
//   },
// };
//
// export const CosignV1: Story = {
//   name: 'Cosign v1',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'coSign',
//       key: 'coSign',
//       label: 'A cosign v1 preview',
//       hidden: true, // must be ignored
//       authPlugin: 'digid',
//     },
//   },
//
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('A cosign v1 preview');
//     const previewBtn = canvas.getByRole('button', {name: 'Cosign (digid)'});
//     await waitFor(() => expect(previewBtn).toBeVisible());
//   },
// };
//
// export const CosignV2: Story = {
//   name: 'Cosign v2',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'cosign',
//       key: 'cosign',
//       label: 'A cosign v2 preview',
//       hidden: true, // must be ignored
//     } satisfies CosignV2ComponentSchema,
//   },
//
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await canvas.findByText('A cosign v2 preview');
//     const previewInput = canvas.getByRole<HTMLInputElement>('textbox');
//     await waitFor(() => expect(previewInput).toBeVisible());
//     await expect(previewInput.type).toBe('email');
//   },
// };
//
// export const Signature: Story = {
//   name: 'Signature',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'signature',
//       key: 'signature',
//       label: 'A signature preview',
//       hidden: true, // must be ignored
//       footer: 'Draw above',
//     },
//   },
//
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await waitFor(async () => {
//       await expect(await canvas.findByText('A signature preview')).toBeVisible();
//       await expect(await canvas.findByText('Draw above')).toBeVisible();
//     });
//   },
// };
//
// export const LeafletMap: Story = {
//   name: 'Map',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'map',
//       key: 'map',
//       label: 'A map preview',
//       useConfigDefaultMapSettings: true,
//       hidden: true, // must be ignored
//     },
//   },
//   play: async ({canvasElement}) => {
//     const canvas = within(canvasElement);
//
//     // check that the user-controlled content is visible
//     await waitFor(async () => {
//       await expect(await canvas.findByText('A map preview')).toBeVisible();
//     });
//
//     // the map should be rendered, with zoom controls
//     await expect(await canvas.findByRole('button', {name: 'Zoom in'})).toBeVisible();
//     await expect(await canvas.findByRole('button', {name: 'Zoom out'})).toBeVisible();
//   },
// };
//
// export const Partners: Story = {
//   name: 'Partners',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'partners',
//       key: 'partners',
//       label: 'A partners preview',
//       tooltip: 'An example for the tooltip',
//       description: 'A description for the Partners component',
//     } satisfies PartnersComponentSchema,
//   },
// };
//
// export const Children: Story = {
//   name: 'Children',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'children',
//       key: 'children',
//       label: 'A children preview',
//       enableSelection: false,
//       tooltip: 'An example for the tooltip',
//       description: 'A description for the Children component',
//     } satisfies ChildrenComponentSchema,
//   },
// };
//
// export const Profile: Story = {
//   name: 'Profile',
//   args: {
//     component: {
//       id: 'wekruya',
//       type: 'customerProfile',
//       key: 'customerProfile',
//       label: 'A profile preview',
//       tooltip: 'An example for the tooltip',
//       description: 'A description for the Profile component',
//       digitalAddressTypes: ['email', 'phoneNumber'],
//       confirmationRecipient: false,
//       shouldUpdateCustomerData: true,
//     } satisfies CustomerProfileComponentSchema,
//   },
// };
