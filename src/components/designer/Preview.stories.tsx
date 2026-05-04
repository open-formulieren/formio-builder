import type {
  AddressNLComponentSchema,
  BsnComponentSchema,
  CheckboxComponentSchema,
  ChildrenComponentSchema,
  ColumnsComponentSchema,
  ContentComponentSchema,
  CosignV2ComponentSchema,
  CurrencyComponentSchema,
  CustomerProfileComponentSchema,
  DateComponentSchema,
  DateTimeComponentSchema,
  EditGridComponentSchema,
  EmailComponentSchema,
  FieldsetComponentSchema,
  FileComponentSchema,
  IbanComponentSchema,
  LicensePlateComponentSchema,
  NpFamilyMembersComponentSchema,
  NumberComponentSchema,
  PartnersComponentSchema,
  PhoneNumberComponentSchema,
  PostcodeComponentSchema,
  RadioComponentSchema,
  SelectComponentSchema,
  SelectboxesComponentSchema,
  SoftRequiredErrorsComponentSchema,
  TextFieldComponentSchema,
  TextareaComponentSchema,
  TimeComponentSchema,
} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, fireEvent, userEvent, waitFor, within} from 'storybook/test';

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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Textfield preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the textfield Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Textfield preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the textfield Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with textfield', async () => {
      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, 'typing in preview component');
      await expect(regularInput).toHaveDisplayValue('typing in preview component');
    });

    await step('Interaction with hidden textfield', async () => {
      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, 'typing in preview component');
      await expect(hiddenInput).toHaveDisplayValue('typing in preview component');
    });
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
        showCharCount: true,
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
        showCharCount: true,
        description: 'Description only once in hidden state',
        tooltip: 'Description only once in hidden state',
        hidden: true,
      } satisfies TextFieldComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('Textfield multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Textfield multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with textfield multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-textfieldMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      // during typing, we want immediate charcount feedback
      await userEvent.type(input1, 'Foo');
      await expect(wrapper.queryByText('3 characters')).toBeInTheDocument();
      await expect(input1).toHaveDisplayValue('Foo');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(canvas.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(canvas.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden textfield multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-textfieldMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      // during typing, we want immediate charcount feedback
      await userEvent.type(input1, 'Foo');
      await expect(wrapper.queryByText('3 characters')).toBeInTheDocument();
      await expect(input1).toHaveDisplayValue('Foo');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
  },
};

export const Textarea: Story = {
  args: {
    components: [
      {
        type: 'textarea',
        id: 'textarea',
        key: 'textareaPreview',
        label: 'Textarea preview',
        description: 'A preview of the textarea Formio component',
        tooltip: 'A preview of the textarea Formio component',
        defaultValue: 'Default value',
        rows: 3,
        autoExpand: false,
      } satisfies TextareaComponentSchema,
      {
        type: 'textarea',
        id: 'textarea',
        key: 'textareaPreviewHidden',
        label: 'Textarea preview hidden',
        description: 'A preview of the textarea Formio component in hidden state',
        tooltip: 'A preview of the textarea Formio component',
        defaultValue: 'Default value',
        rows: 3,
        autoExpand: false,
        hidden: true,
      } satisfies TextareaComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Textarea preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the textarea Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden textarea to be visible
    const hiddenInput = canvas.getByLabelText('Textarea preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the textarea Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with textarea', async () => {
      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, 'typing in preview component');
      await expect(regularInput).toHaveDisplayValue('typing in preview component');
    });

    await step('Interaction with hidden textarea', async () => {
      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, 'typing in preview component');
      await expect(hiddenInput).toHaveDisplayValue('typing in preview component');
    });
  },
};

export const TextareaMultiple: Story = {
  args: {
    components: [
      {
        type: 'textarea',
        id: 'textarea',
        key: 'textareaMultiplePreview',
        label: 'Textarea multiple preview',
        description: 'Description only once',
        tooltip: 'Description only once',
        rows: 3,
        autoExpand: false,
        multiple: true,
      } satisfies TextareaComponentSchema,
      {
        type: 'textarea',
        id: 'textarea',
        key: 'textareaMultiplePreviewHidden',
        label: 'Textarea multiple preview hidden',
        description: 'Description only once in hidden state',
        tooltip: 'Description only once in hidden state',
        rows: 3,
        autoExpand: false,
        hidden: true,
        multiple: true,
      } satisfies TextareaComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('Textarea multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden textarea to be visible
    const hiddenInputLabel = canvas.getByText('Textarea multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with textarea multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-textareaMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'Foo');
      await expect(input1).toHaveDisplayValue('Foo');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(canvas.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(canvas.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden textarea multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-textareaMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'Foo');
      await expect(input1).toHaveDisplayValue('Foo');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Email preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the email Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Email preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the email Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with email field', async () => {
      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, 'hello@example.com');
      await expect(regularInput).toHaveDisplayValue('hello@example.com');
    });

    await step('Interaction with hidden email field', async () => {
      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, 'hello@example.com');
      await expect(hiddenInput).toHaveDisplayValue('hello@example.com');
    });
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

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Email preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the email Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Email preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the email Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
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
        key: 'emailMultiplePreview',
        label: 'Email multiple preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies EmailComponentSchema,
      {
        type: 'email',
        id: 'emailHidden',
        key: 'emailMultiplePreviewHidden',
        label: 'Email multiple preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies EmailComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('Email multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Email multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with email multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-emailMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'hello@example.com');
      await expect(input1).toHaveDisplayValue('hello@example.com');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden email multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-emailMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'hello@example.com');
      await expect(input1).toHaveDisplayValue('hello@example.com');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Number preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the number Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Number preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the number Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with number', async () => {
      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, '123');
      await expect(regularInput).toHaveDisplayValue('123');
    });

    await step('Interaction with hidden number', async () => {
      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, '123');
      await expect(hiddenInput).toHaveDisplayValue('123');
    });
  },
};

// @TODO replace preview component with variant without input prefix and update test
export const CurrencyField: Story = {
  args: {
    components: [
      {
        type: 'currency',
        id: 'currency',
        key: 'currencyPreview',
        label: 'Currency preview',
        description: 'A preview of the currency Formio component',
        tooltip: 'A preview of the currency Formio component',
        currency: 'EUR',
      } satisfies CurrencyComponentSchema,
      {
        type: 'currency',
        id: 'currencyHidden',
        key: 'currencyPreviewHidden',
        label: 'Currency preview hidden',
        description: 'A preview of the currency Formio component in hidden state',
        tooltip: 'A preview of the currency Formio component in hidden state',
        currency: 'EUR',
        hidden: true,
      } satisfies CurrencyComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Currency preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the currency Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Currency preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the currency Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with currency', async () => {
      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, '123');
      await expect(regularInput).toHaveDisplayValue('123');
    });

    await step('Interaction with hidden currency', async () => {
      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, '123');
      await expect(hiddenInput).toHaveDisplayValue('123');
    });
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

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Date preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the date Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Date preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the date Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
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
        key: 'dateMultiplePreview',
        label: 'Date multiple preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies DateComponentSchema,
      {
        type: 'date',
        id: 'dateHidden',
        key: 'dateMultiplePreviewHidden',
        label: 'Date multiple preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies DateComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('Date multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Date multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with date multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-dateMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden date multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-dateMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
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

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('DateTime preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the datetime Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('DateTime preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the datetime Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
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
        key: 'datetimeMultiplePreview',
        label: 'DateTime multiple preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies DateTimeComponentSchema,
      {
        type: 'datetime',
        id: 'datetimeHidden',
        key: 'datetimeMultiplePreviewHidden',
        label: 'DateTime multiple preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies DateTimeComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('DateTime multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('DateTime multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with datetime multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-datetimeMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden datetime multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-datetimeMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
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

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Time preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the time Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Time preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the time Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
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
        key: 'timeMultiplePreview',
        label: 'Time multiple preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies TimeComponentSchema,
      {
        type: 'time',
        id: 'timeHidden',
        key: 'timeMultiplePreviewHidden',
        label: 'Time multiple preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies TimeComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('Time multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Time multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with time multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-timeMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden time multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-timeMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
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
        defaultValue: '9999 AA',
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
        defaultValue: '9999 AA',
        hidden: true,
        validate: {
          pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
        },
      } satisfies PostcodeComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Postcode preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the postcode Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Postcode preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the postcode Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with postcode', async () => {
      // Expect input to show default value
      await expect(regularInput).toHaveDisplayValue('9999 AA');

      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, '1015 CJ');
      await expect(regularInput).toHaveDisplayValue('1015 CJ');
    });

    await step('Interaction with hidden postcode', async () => {
      // Expect input to show default value
      await expect(hiddenInput).toHaveDisplayValue('9999 AA');

      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, '1015 CJ');
      await expect(hiddenInput).toHaveDisplayValue('1015 CJ');
    });
  },
};

export const PostcodeMultiple: Story = {
  args: {
    components: [
      {
        type: 'postcode',
        id: 'postcode',
        key: 'postcodeMultiplePreview',
        label: 'Postcode multiple preview',
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
        key: 'postcodeMultiplePreviewHidden',
        label: 'Postcode multiple preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
        validate: {
          pattern: '^[1-9][0-9]{3} ?(?!sa|sd|ss|SA|SD|SS)[a-zA-Z]{2}$',
        },
      } satisfies PostcodeComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('Postcode multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Postcode multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with postcode multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-postcodeMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      // during typing, we want immediate charcount feedback
      await userEvent.type(input1, '1015 CJ');
      await expect(input1).toHaveDisplayValue('1015 CJ');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(canvas.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(canvas.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden postcode multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-postcodeMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      // during typing, we want immediate charcount feedback
      await userEvent.type(input1, '1015 CJ');
      await expect(input1).toHaveDisplayValue('1015 CJ');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
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
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Phone number preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the phoneNumber Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Phone number preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the phoneNumber Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with phoneNumber', async () => {
      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, '+316 12345678');
      await expect(regularInput).toHaveDisplayValue('+316 12345678');
    });

    await step('Interaction with hidden phoneNumber', async () => {
      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, '+316 12345678');
      await expect(hiddenInput).toHaveDisplayValue('+316 12345678');
    });
  },
};

export const PhoneNumberMultiple: Story = {
  name: 'PhoneNumber Multiple',
  args: {
    components: [
      {
        type: 'phoneNumber',
        id: 'phoneNumber',
        key: 'phoneNumberMultiplePreview',
        label: 'Phone number multiple preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies PhoneNumberComponentSchema,
      {
        type: 'phoneNumber',
        id: 'phoneNumberHidden',
        key: 'phoneNumberMultiplePreviewHidden',
        label: 'Phone number multiple preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies PhoneNumberComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('Phone number multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Phone number multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with phoneNumber multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-phoneNumberMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, '+316 12345678');
      await expect(input1).toHaveDisplayValue('+316 12345678');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(canvas.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(canvas.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden phoneNumber multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-phoneNumberMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, '+316 12345678');
      await expect(input1).toHaveDisplayValue('+316 12345678');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
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
  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    expect(canvas.getByText('File upload preview')).toBeVisible();
    expect(canvas.getByText('A preview of the file Formio component')).toBeVisible();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('File upload preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(
      canvas.getByText('A preview of the file Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const Checkbox: Story = {
  args: {
    components: [
      {
        type: 'checkbox',
        id: 'checkbox',
        key: 'checkboxPreview',
        label: 'Checkbox preview',
        description: 'A preview of the checkbox Formio component',
        tooltip: 'A preview of the checkbox Formio component',
      } satisfies CheckboxComponentSchema,
      {
        type: 'checkbox',
        id: 'checkboxHidden',
        key: 'checkboxPreviewHidden',
        label: 'Checkbox preview hidden',
        description: 'A preview of the checkbox Formio component in hidden state',
        tooltip: 'A preview of the checkbox Formio component in hidden state',
        hidden: true,
      } satisfies CheckboxComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Checkbox preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the checkbox Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden checkbox to be visible
    const hiddenInput = canvas.getByLabelText('Checkbox preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the checkbox Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with checkbox', async () => {
      await expect(regularInput).not.toBeChecked();
      await fireEvent.click(regularInput);
      await expect(regularInput).toBeChecked();
    });

    await step('Interaction with hidden checkbox', async () => {
      await expect(hiddenInput).not.toBeChecked();
      await fireEvent.click(hiddenInput);
      await expect(hiddenInput).toBeChecked();
    });
  },
};

export const SelectBoxes: Story = {
  name: 'Selectboxes: manual values',
  args: {
    components: [
      {
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
      {
        type: 'selectboxes',
        id: 'selectboxesHidden',
        key: 'selectboxesPreviewHidden',
        label: 'Selectboxes preview hidden',
        description: 'A preview of the selectboxes Formio component in hidden state',
        hidden: true,
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
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = await canvas.findByText('Selectboxes preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('A preview of the selectboxes Formio component')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Selectboxes preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(
      canvas.getByText('A preview of the selectboxes Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with selectboxes', async () => {
      const wrapper = within(inputWrapper as HTMLElement);

      // check that the input name is set correctly
      const firstOptionInput = wrapper.getByLabelText<HTMLInputElement>('Option 1');

      // check the toggle state of a checkbox
      await expect(firstOptionInput).not.toBeChecked();
      await fireEvent.click(wrapper.getByText('Option 1'));
      await expect(firstOptionInput).toBeChecked();
    });

    await step('Interaction with hidden selectboxes', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);

      // check that the input name is set correctly
      const firstOptionInput = wrapper.getByLabelText<HTMLInputElement>('Option 1');

      // check the toggle state of a checkbox
      await expect(firstOptionInput).not.toBeChecked();
      await fireEvent.click(wrapper.getByText('Option 1'));
      await expect(firstOptionInput).toBeChecked();
    });
  },
};

export const SelectBoxesVariable: Story = {
  name: 'Selectboxes: variable for values',
  args: {
    components: [
      {
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
        values: [],
        defaultValue: {},
      } satisfies SelectboxesComponentSchema,
      {
        type: 'selectboxes',
        id: 'selectboxesHidden',
        key: 'selectboxesPreviewHidden',
        label: 'Selectboxes preview hidden',
        description: 'A preview of the selectboxes Formio component in hidden state',
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'foo'},
          translations: {},
        },
        values: [],
        defaultValue: {},
        hidden: true,
      } satisfies SelectboxesComponentSchema,
    ],
  },
};

export const SelectBoxesReferenceLists: Story = {
  name: 'Selectboxes: reference lists options',
  args: {
    components: [
      {
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
        values: [],
        defaultValue: {},
      } satisfies SelectboxesComponentSchema,
      {
        type: 'selectboxes',
        id: 'selectboxes',
        key: 'selectboxesPreviewHidden',
        label: 'Selectboxes preview hidden',
        description: 'A preview of the selectboxes Formio component in hidden state',
        openForms: {
          dataSrc: 'referenceLists',
          code: 'countries',
          service: 'reference-lists',
          translations: {},
        },
        values: [],
        defaultValue: {},
        hidden: true,
      } satisfies SelectboxesComponentSchema,
    ],
  },
  parameters: {builder: {enableContext: true}},
};

export const Radio: Story = {
  name: 'Radio: manual values',
  args: {
    components: [
      {
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
      {
        type: 'radio',
        id: 'radioHidden',
        key: 'radioPreviewHidden',
        label: 'Radio preview hidden',
        description: 'A preview of the radio Formio component in hidden state',
        hidden: true,
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
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = await canvas.findByText('Radio preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('A preview of the radio Formio component')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Radio preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(
      canvas.getByText('A preview of the radio Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with radio', async () => {
      const wrapper = within(inputWrapper as HTMLElement);

      // check that the input name is set correctly
      const firstOptionInput = wrapper.getByLabelText<HTMLInputElement>('Option 1');

      // check the toggle state of a checkbox
      await expect(firstOptionInput).not.toBeChecked();
      await fireEvent.click(wrapper.getByText('Option 1'));
      await expect(firstOptionInput).toBeChecked();
    });

    await step('Interaction with hidden radio', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);

      // check that the input name is set correctly
      const firstOptionInput = wrapper.getByLabelText<HTMLInputElement>('Option 1');

      // check the toggle state of a checkbox
      await expect(firstOptionInput).not.toBeChecked();
      await fireEvent.click(wrapper.getByText('Option 1'));
      await expect(firstOptionInput).toBeChecked();
    });
  },
};

export const RadioVariable: Story = {
  name: 'Radio: variable for values',
  args: {
    components: [
      {
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
        values: [],
        defaultValue: null,
      } satisfies RadioComponentSchema,
      {
        type: 'radio',
        id: 'radio',
        key: 'radioPreviewHidden',
        label: 'Radio preview hidden',
        description: 'A preview of the radio Formio component in hidden state',
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'foo'},
          translations: {},
        },
        values: [],
        defaultValue: null,
        hidden: true,
      } satisfies RadioComponentSchema,
    ],
  },
};

export const RadioReferenceLists: Story = {
  name: 'Radio: reference lists options',
  args: {
    components: [
      {
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
        values: [],
        defaultValue: null,
      } satisfies RadioComponentSchema,
      {
        type: 'radio',
        id: 'radio',
        key: 'radioPreviewHidden',
        label: 'Radio preview hidden',
        description: 'A preview of the radio Formio component in hidden state',
        openForms: {
          dataSrc: 'referenceLists',
          code: 'countries',
          service: 'reference-lists',
          translations: {},
        },
        values: [],
        defaultValue: null,
        hidden: true,
      } satisfies RadioComponentSchema,
    ],
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
    components: [
      {
        type: 'select',
        id: 'select',
        key: 'selectPreview',
        label: 'Select preview',
        description: 'A preview of the select Formio component',
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
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
      {
        type: 'select',
        id: 'selectHidden',
        key: 'selectPreviewHidden',
        label: 'Select preview hidden',
        description: 'A preview of the select Formio component in hidden state',
        hidden: true,
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
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
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Select preview');
    const regularInputWrapper = regularInput.closest('[data-testid="designerPreview"]');
    expect(regularInput).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(canvas.getByText('A preview of the select Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Select preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the select Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with select', async () => {
      const wrapper = within(regularInputWrapper as HTMLElement);

      // we expect no options to be selected
      await expect(wrapper.queryByText('Option 1')).toBeNull();
      await expect(wrapper.queryByText('Option 2')).toBeNull();

      // opening the dropdown displays the options
      regularInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await expect(await wrapper.findByText('Option 1')).toBeVisible();
      });
      await expect(await wrapper.findByText('Option 2')).toBeVisible();

      // selecting an option by clicking it displays it as selected
      await userEvent.click(wrapper.getByText('Option 2'));
      // wait for the option list to be closed
      await waitFor(async () => {
        await expect(wrapper.queryByRole('listbox')).toBeNull();
      });
      // selected value should still be displayed
      await expect(await wrapper.findByText('Option 2')).toBeVisible();
    });

    await step('Interaction with hidden select', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);

      // we expect no options to be selected
      await expect(wrapper.queryByText('Option 1')).toBeNull();
      await expect(wrapper.queryByText('Option 2')).toBeNull();

      // opening the dropdown displays the options
      hiddenInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await expect(await wrapper.findByText('Option 1')).toBeVisible();
      });
      await expect(await wrapper.findByText('Option 2')).toBeVisible();

      // selecting an option by clicking it displays it as selected
      await userEvent.click(wrapper.getByText('Option 2'));
      // wait for the option list to be closed
      await waitFor(async () => {
        await expect(wrapper.queryByRole('listbox')).toBeNull();
      });
      // selected value should still be displayed
      await expect(await wrapper.findByText('Option 2')).toBeVisible();
    });
  },
};

/**
 * A select component with manually specified options. Multiple options may be picked.
 */
export const SelectMultiple: Story = {
  name: 'Select: manual values, multiple',
  args: {
    components: [
      {
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
      {
        type: 'select',
        id: 'selectHidden',
        key: 'selectPreviewHidden',
        label: 'Select preview hidden',
        description: 'A preview of the select Formio component in hidden state',
        multiple: true,
        hidden: true,
        openForms: {
          dataSrc: 'manual',
          translations: {},
        },
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
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('Select preview');
    const regularInputWrapper = regularInput.closest('[data-testid="designerPreview"]');
    expect(regularInput).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(canvas.getByText('A preview of the select Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('Select preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the select Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with select', async () => {
      const wrapper = within(regularInputWrapper as HTMLElement);

      // we expect no options to be selected
      await expect(wrapper.queryByText('Option 1')).toBeNull();
      await expect(wrapper.queryByText('Option 3')).toBeNull();

      // opening the dropdown displays the options
      regularInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await userEvent.click(await wrapper.findByText('Option 3'));
      });
      regularInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await userEvent.click(await wrapper.findByText('Option 1'));
      });

      // wait for the option list to be closed
      await waitFor(async () => {
        await expect(wrapper.queryByRole('listbox')).toBeNull();
      });
      // selected value should still be displayed
      await expect(await wrapper.findByText('Option 1')).toBeVisible();
      await expect(await wrapper.findByText('Option 3')).toBeVisible();
    });

    await step('Interaction with hidden select', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);

      // we expect no options to be selected
      await expect(wrapper.queryByText('Option 1')).toBeNull();
      await expect(wrapper.queryByText('Option 3')).toBeNull();

      // opening the dropdown displays the options
      hiddenInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await userEvent.click(await wrapper.findByText('Option 3'));
      });
      hiddenInput.focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await userEvent.click(await wrapper.findByText('Option 1'));
      });

      // wait for the option list to be closed
      await waitFor(async () => {
        await expect(wrapper.queryByRole('listbox')).toBeNull();
      });
      // selected value should still be displayed
      await expect(await wrapper.findByText('Option 1')).toBeVisible();
      await expect(await wrapper.findByText('Option 3')).toBeVisible();
    });
  },
};

/**
 * A select component with an expression to build the option list in the backend.
 */
export const SelectVariable: Story = {
  name: 'Select: variable for values',
  args: {
    components: [
      {
        type: 'select',
        id: 'select',
        key: 'selectPreview',
        label: 'Select preview',
        description: 'A preview of the select Formio component',
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'foo'},
          translations: {},
        },
        data: {values: []},
      } satisfies SelectComponentSchema,
      {
        type: 'select',
        id: 'select',
        key: 'selectPreviewHidden',
        label: 'Select preview hidden',
        description: 'A preview of the select Formio component in hidden state',
        openForms: {
          dataSrc: 'variable',
          itemsExpression: {var: 'foo'},
          translations: {},
        },
        data: {values: []},
        hidden: true,
      } satisfies SelectComponentSchema,
    ],
  },
};

export const SelectVariableReferenceLists: Story = {
  name: 'Select: reference lists options',
  args: {
    components: [
      {
        type: 'select',
        id: 'select',
        key: 'selectPreview',
        label: 'Select preview',
        description: 'A preview of the select Formio component',
        openForms: {
          dataSrc: 'referenceLists',
          code: 'countries',
          service: 'reference-lists',
          translations: {},
        },
        data: {values: []},
      } satisfies SelectComponentSchema,
      {
        type: 'select',
        id: 'select',
        key: 'selectPreviewHidden',
        label: 'Select preview hidden',
        description: 'A preview of the select Formio component in hidden state',
        openForms: {
          dataSrc: 'referenceLists',
          code: 'countries',
          service: 'reference-lists',
          translations: {},
        },
        data: {values: []},
        hidden: true,
      } satisfies SelectComponentSchema,
    ],
  },
  parameters: {
    builder: {enableContext: true},
  },
};

export const BSN: Story = {
  name: 'BSN',
  args: {
    components: [
      {
        type: 'bsn',
        id: 'bsn',
        key: 'bsnPreview',
        label: 'BSN preview',
        description: 'A preview of the BSN Formio component',
        hidden: false,
      } satisfies BsnComponentSchema,
      {
        type: 'bsn',
        id: 'bsnHidden',
        key: 'bsnPreviewHidden',
        label: 'BSN preview hidden',
        description: 'A preview of the BSN Formio component in hidden state',
        hidden: true,
      } satisfies BsnComponentSchema,
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('BSN preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the BSN Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('BSN preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(canvas.getByText('A preview of the BSN Formio component in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with BSN', async () => {
      // check that user can type into the fields
      expect(regularInput).toHaveAttribute('placeholder', '_________');
      await userEvent.type(regularInput, '111222333');
      await expect(regularInput).toHaveDisplayValue('111222333');
    });

    await step('Interaction with hidden BSN', async () => {
      // check that user can type into the fields
      expect(hiddenInput).toHaveAttribute('placeholder', '_________');
      await userEvent.type(hiddenInput, '111222333');
      await expect(hiddenInput).toHaveDisplayValue('111222333');
    });
  },
};

export const BSNMultiple: Story = {
  name: 'BSN Multiple',
  args: {
    components: [
      {
        type: 'bsn',
        id: 'bsn',
        key: 'bsnMultiplePreview',
        label: 'BSN multiple preview',
        description: 'Description only once',
        hidden: false,
        multiple: true,
      } satisfies BsnComponentSchema,
      {
        type: 'bsn',
        id: 'bsnHidden',
        key: 'bsnMultiplePreviewHidden',
        label: 'BSN multiple preview hidden',
        description: 'Description only once in hidden state',
        hidden: true,
        multiple: true,
      } satisfies BsnComponentSchema,
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('BSN multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('BSN multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with BSN multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-bsnMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, '111222333');
      await expect(input1).toHaveDisplayValue('111222333');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(canvas.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(canvas.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden BSN multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-bsnMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, '111222333');
      await expect(input1).toHaveDisplayValue('111222333');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
  },
};

export const IBAN: Story = {
  name: 'IBAN',
  args: {
    components: [
      {
        type: 'iban',
        id: 'iban',
        key: 'ibanPreview',
        label: 'IBAN preview',
        description: 'A preview of the iban Formio component',
        tooltip: 'A preview of the iban Formio component',
      } satisfies IbanComponentSchema,
      {
        type: 'iban',
        id: 'iban',
        key: 'ibanPreviewHiden',
        label: 'IBAN preview hidden',
        description: 'A preview of the iban Formio component in hidden state',
        tooltip: 'A preview of the iban Formio component in hidden state',
        hidden: true,
      } satisfies IbanComponentSchema,
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('IBAN preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the iban Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('IBAN preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the iban Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with IBAN', async () => {
      // check that user can type into the fields
      await userEvent.type(regularInput, 'NL02ABNA0123456789');
      await expect(regularInput).toHaveDisplayValue('NL02ABNA0123456789');
    });

    await step('Interaction with hidden IBAN', async () => {
      // check that user can type into the fields
      await userEvent.type(hiddenInput, 'NL02ABNA0123456789');
      await expect(hiddenInput).toHaveDisplayValue('NL02ABNA0123456789');
    });
  },
};

export const IBANMultiple: Story = {
  name: 'IBAN Multiple',
  args: {
    components: [
      {
        type: 'iban',
        id: 'iban',
        key: 'ibanMultiplePreview',
        label: 'IBAN multiple preview',
        description: 'Description only once',
        tooltip: 'A preview of the iban Formio component',
        multiple: true,
      } satisfies IbanComponentSchema,
      {
        type: 'iban',
        id: 'iban',
        key: 'ibanMultiplePreviewHidden',
        label: 'IBAN multiple preview hidden',
        description: 'Description only once in hidden state',
        tooltip: 'A preview of the iban Formio component in hidden state',
        hidden: true,
        multiple: true,
      } satisfies IbanComponentSchema,
    ],
  },

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInputLabel = canvas.getByText('IBAN multiple preview');
    const regularInputWrapper = regularInputLabel.closest('[data-testid="designerPreview"]');
    expect(regularInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();

    // Expect the label, input description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('IBAN multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with IBAN multiple', async () => {
      const wrapper = within(regularInputWrapper as HTMLElement);
      const subfieldTestId = 'input-ibanMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'NL02ABNA0123456789');
      await expect(input1).toHaveDisplayValue('NL02ABNA0123456789');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(canvas.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(canvas.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden IBAN multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-ibanMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'NL02ABNA0123456789');
      await expect(input1).toHaveDisplayValue('NL02ABNA0123456789');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
  },
};

export const NpFamilyMembers: Story = {
  name: 'Family members',
  args: {
    components: [
      {
        type: 'npFamilyMembers',
        id: 'npFamilyMembers',
        key: 'npFamilyMembersPreview',
        label: 'Family members preview',
        description: 'A preview of the family members Formio component',
        includeChildren: true,
        includePartners: true,
      } satisfies NpFamilyMembersComponentSchema,
      {
        type: 'npFamilyMembers',
        id: 'npFamilyMembersHidden',
        key: 'npFamilyMembersPreviewHidden',
        label: 'Family members preview hidden',
        description: 'A preview of the family members Formio component in hidden state',
        hidden: true,
        includeChildren: true,
        includePartners: true,
      } satisfies NpFamilyMembersComponentSchema,
    ],
  },

  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Expect label, checkboxes and description to be shown
    const regularInputLabel = canvas.getByText('Family members preview');
    const regularInputWrapper = regularInputLabel.closest('[data-testid="designerPreview"]');

    expect(regularInputLabel).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(canvas.getByText('A preview of the family members Formio component')).toBeVisible();

    // check that the checkboxes are rendered
    const wrapper = within(regularInputWrapper as HTMLElement);
    const checkboxes = wrapper.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Family members preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(
      canvas.getByText('A preview of the family members Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const AddressNL: Story = {
  name: 'addressNL: single column',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'addressNL',
        key: 'address',
        label: 'AddressNL preview',
        description: 'A preview of the addressNL Formio component',
        tooltip: 'A preview of the addressNL Formio component',
        validate: {
          required: false,
        },
        deriveAddress: false,
        layout: 'singleColumn',
      } satisfies AddressNLComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'addressNL',
        key: 'addressHidden',
        label: 'AddressNL preview hidden',
        description: 'A preview of the addressNL Formio component in hidden state',
        tooltip: 'A preview of the addressNL Formio component in hidden state',
        validate: {
          required: false,
        },
        hidden: true,
        deriveAddress: false,
        layout: 'singleColumn',
      } satisfies AddressNLComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label to be shown
    const regularInputLabel = canvas.getByText('AddressNL preview');
    const regularInputWrapper = regularInputLabel.closest('[data-testid="designerPreview"]');
    expect(regularInputLabel).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(canvas.getByText('A preview of the addressNL Formio component')).toBeVisible();

    // Expect the label of the hidden addressNL to be visible
    const hiddenInputLabel = canvas.getByText('AddressNL preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputLabel).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(
      canvas.getByText('A preview of the addressNL Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with addressNL component', async () => {
      const wrapper = within(regularInputWrapper as HTMLElement);
      const postcode = wrapper.getByLabelText('Postcode');
      const houseNumber = wrapper.getByLabelText('House number');
      const houseLetterAddition = wrapper.getByLabelText('House letter addition');
      const houseNumberAddition = wrapper.getByLabelText('House number addition');

      // Assert initial state
      expect(postcode).toHaveDisplayValue('');
      expect(postcode).toHaveAttribute('placeholder', '____ __');
      expect(houseNumber).toHaveDisplayValue('');
      expect(houseLetterAddition).toHaveDisplayValue('');
      expect(houseLetterAddition).toHaveAttribute('placeholder', '_');
      expect(houseNumberAddition).toHaveDisplayValue('');

      // Interact
      await userEvent.type(postcode, '1234 AB');
      await userEvent.type(houseNumber, '11');
      await userEvent.type(houseLetterAddition, 'R');
      await userEvent.type(houseNumberAddition, 'H2B');

      // New values
      expect(postcode).toHaveDisplayValue('1234 AB');
      expect(houseNumber).toHaveDisplayValue('11');
      expect(houseLetterAddition).toHaveDisplayValue('R');
      expect(houseNumberAddition).toHaveDisplayValue('H2B');
    });

    await step('Interaction with hidden addressNL component', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const postcode = wrapper.getByLabelText('Postcode');
      const houseNumber = wrapper.getByLabelText('House number');
      const houseLetterAddition = wrapper.getByLabelText('House letter addition');
      const houseNumberAddition = wrapper.getByLabelText('House number addition');

      // Assert initial state
      expect(postcode).toHaveDisplayValue('');
      expect(postcode).toHaveAttribute('placeholder', '____ __');
      expect(houseNumber).toHaveDisplayValue('');
      expect(houseLetterAddition).toHaveDisplayValue('');
      expect(houseLetterAddition).toHaveAttribute('placeholder', '_');
      expect(houseNumberAddition).toHaveDisplayValue('');

      // Interact
      await userEvent.type(postcode, '1234 AB');
      await userEvent.type(houseNumber, '11');
      await userEvent.type(houseLetterAddition, 'R');
      await userEvent.type(houseNumberAddition, 'H2B');

      // New values
      expect(postcode).toHaveDisplayValue('1234 AB');
      expect(houseNumber).toHaveDisplayValue('11');
      expect(houseLetterAddition).toHaveDisplayValue('R');
      expect(houseNumberAddition).toHaveDisplayValue('H2B');
    });
  },
};

export const AddressNLDoubleColumn: Story = {
  name: 'addressNL: double column',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'addressNL',
        key: 'address',
        label: 'AddressNL double column preview',
        validate: {
          required: false,
        },
        deriveAddress: false,
        layout: 'doubleColumn',
      } satisfies AddressNLComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'addressNL',
        key: 'addressHidden',
        label: 'AddressNL double column preview hidden',
        validate: {
          required: false,
        },
        hidden: true,
        deriveAddress: false,
        layout: 'doubleColumn',
      } satisfies AddressNLComponentSchema,
    ],
  },
};

export const AddressNLSingleColumnWithDerived: Story = {
  name: 'addressNL: single column, derived address',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'addressNL',
        key: 'address',
        label: 'AddressNL single column with derived address preview',
        validate: {
          required: false,
        },
        deriveAddress: true,
        layout: 'singleColumn',
      } satisfies AddressNLComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'addressNL',
        key: 'addressHidden',
        label: 'AddressNL single column with derived address preview hidden',
        validate: {
          required: false,
        },
        hidden: true,
        deriveAddress: true,
        layout: 'singleColumn',
      } satisfies AddressNLComponentSchema,
    ],
  },
};

export const AddressNLDoubleColumnWithDerived: Story = {
  name: 'addressNL: double column, derived address',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'addressNL',
        key: 'address',
        label: 'AddressNL double column with derived address preview',
        validate: {
          required: false,
        },
        deriveAddress: true,
        layout: 'doubleColumn',
      } satisfies AddressNLComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'addressNL',
        key: 'addressHidden',
        label: 'AddressNL double column with derived address preview hidden',
        validate: {
          required: false,
        },
        hidden: true,
        deriveAddress: true,
        layout: 'doubleColumn',
      } satisfies AddressNLComponentSchema,
    ],
  },
};

export const LicensePlate: Story = {
  name: 'License plate',
  args: {
    components: [
      {
        type: 'licenseplate',
        id: 'licenseplate',
        key: 'licenseplatePreview',
        label: 'License plate preview',
        description: 'A preview of the licenseplate Formio component',
        tooltip: 'A preview of the licenseplate Formio component',
        validate: {
          pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
        },
      } satisfies LicensePlateComponentSchema,
      {
        type: 'licenseplate',
        id: 'licenseplate',
        key: 'licenseplatePreviewHidden',
        label: 'License plate preview hidden',
        description: 'A preview of the licenseplate Formio component in hidden state',
        tooltip: 'A preview of the licenseplate Formio component in hidden state',
        validate: {
          pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
        },
        hidden: true,
      } satisfies LicensePlateComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label, input and description to be shown
    const regularInput = canvas.getByLabelText('License plate preview');
    expect(regularInput).toBeVisible();
    expect(canvas.getByText('A preview of the licenseplate Formio component')).toBeVisible();

    // Expect the label, input and description of the hidden component to be visible
    const hiddenInput = canvas.getByLabelText('License plate preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(
      canvas.getByText('A preview of the licenseplate Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with licenseplate', async () => {
      // check that user can type into the fields
      await userEvent.clear(regularInput);
      await userEvent.type(regularInput, 'A-123-BC');
      await expect(regularInput).toHaveDisplayValue('A-123-BC');
    });

    await step('Interaction with hidden licenseplate', async () => {
      // check that user can type into the fields
      await userEvent.clear(hiddenInput);
      await userEvent.type(hiddenInput, 'A-123-BC');
      await expect(hiddenInput).toHaveDisplayValue('A-123-BC');
    });
  },
};

export const LicensePlateMultiple: Story = {
  name: 'License plate Multiple',
  args: {
    components: [
      {
        type: 'licenseplate',
        id: 'licenseplate',
        key: 'licenseplateMultiplePreview',
        label: 'License plate multiple preview',
        description: 'Description only once',
        tooltip: 'A preview of the licenseplate Formio component',
        validate: {
          pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
        },
        multiple: true,
      } satisfies LicensePlateComponentSchema,
      {
        type: 'licenseplate',
        id: 'licenseplate',
        key: 'licenseplateMultiplePreviewHidden',
        label: 'License plate multiple preview hidden',
        description: 'Description only once in hidden state',
        tooltip: 'A preview of the licenseplate Formio component',
        validate: {
          pattern: '^[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}\\-[a-zA-Z0-9]{1,3}$',
        },
        multiple: true,
        hidden: true,
      } satisfies LicensePlateComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label and description to be shown
    const inputLabel = canvas.getByText('License plate multiple preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');
    expect(inputLabel).toBeVisible();
    expect(canvas.getByText('Description only once')).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label and description of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('License plate multiple preview hidden');
    expect(hiddenInputLabel).toBeVisible();
    expect(canvas.getByText('Description only once in hidden state')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with licenseplate multiple', async () => {
      const wrapper = within(inputWrapper as HTMLElement);
      const subfieldTestId = 'input-licenseplateMultiplePreview';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'A-123-BC');
      await expect(input1).toHaveDisplayValue('A-123-BC');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(canvas.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(canvas.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });

    await step('Interaction with hidden licenseplate multiple', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const subfieldTestId = 'input-licenseplateMultiplePreviewHidden';

      // check that new items can be added
      const addButton = wrapper.getByRole('button', {name: 'Add another'});

      await userEvent.click(addButton);
      const input1 = await wrapper.getByTestId(`${subfieldTestId}[0]`);
      await expect(input1).toHaveDisplayValue('');
      await userEvent.type(input1, 'A-123-BC');
      await expect(input1).toHaveDisplayValue('A-123-BC');

      // the description should be rendered only once, even with > 1 inputs
      await userEvent.click(addButton);
      const input2 = wrapper.getByTestId(`${subfieldTestId}[1]`);
      await expect(input2).toHaveDisplayValue('');
      await expect(wrapper.queryAllByText('Description only once in hidden state')).toHaveLength(1);

      // finally, it should be possible delete rows again
      const removeButtons = await wrapper.findAllByRole('button', {name: 'Remove item'});
      await expect(removeButtons.length).toBe(2);
      await userEvent.click(removeButtons[0]);
      await expect(wrapper.getByTestId(`${subfieldTestId}[0]`)).toHaveDisplayValue('');
      await expect(wrapper.queryByTestId(`${subfieldTestId}[1]`)).not.toBeInTheDocument();
    });
  },
};

// @TODO implement preview component and play
export const Content: Story = {
  name: 'Content',
  args: {
    components: [
      {
        id: 'content',
        type: 'content',
        key: 'content',
        html: 'Custom content',
      } satisfies ContentComponentSchema,
      {
        id: 'contentHidden',
        type: 'content',
        key: 'contentHidden',
        html: 'Custom content in hidden state',
      } satisfies ContentComponentSchema,
    ],
  },
};

// @TODO implement preview component and play
export const SoftRequiredErrors: Story = {
  name: 'Soft required errors',
  args: {
    components: [
      {
        id: 'softRequiredErrors',
        type: 'softRequiredErrors',
        key: 'softRequiredErrorsPreview',
        html: '<p><strong>You have not filled out all required fields</strong></p>',
      } satisfies SoftRequiredErrorsComponentSchema,
    ],
  },
};

// @TODO implement preview component and play
export const Columns: Story = {
  name: 'Columns',
  args: {
    components: [
      {
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
      } satisfies ColumnsComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'columns',
        key: 'columnsHidden',
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
      } satisfies ColumnsComponentSchema,
    ],
  },
};

export const FieldSet: Story = {
  name: 'Fieldset: Empty',
  args: {
    components: [
      {
        id: 'fieldset',
        key: 'fieldset',
        type: 'fieldset',
        label: 'Fieldset preview',
        tooltip: 'Fieldset tooltip',
        hideHeader: false,
        components: [],
      } satisfies FieldsetComponentSchema,
      {
        id: 'fieldsetHidden',
        key: 'fieldsetHidden',
        type: 'fieldset',
        label: 'Fieldset preview hidden',
        tooltip: 'Fieldset tooltip',
        hidden: true,
        hideHeader: false,
        components: [],
      } satisfies FieldsetComponentSchema,
    ],
  },
  play: ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label to be shown
    const inputLabel = canvas.getByText('Fieldset preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');

    expect(inputLabel).toBeVisible();
    expect(inputWrapper).toBeInTheDocument();

    // Expect the label of the hidden component to be visible
    const hiddenInputLabel = canvas.getByText('Fieldset preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');

    expect(hiddenInputLabel).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    step('Validate fieldset component', () => {
      const wrapper = within(inputWrapper as HTMLElement);

      expect(
        wrapper.getByText('Drag a component in the form and release the mouse button')
      ).toBeVisible();
    });

    step('Validate hidden fieldset component', () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);

      expect(
        wrapper.getByText('Drag a component in the form and release the mouse button')
      ).toBeVisible();
    });
  },
};

export const FieldSetWithComponents: Story = {
  name: 'Fieldset: With components',
  args: {
    components: [
      {
        id: 'fieldset',
        key: 'fieldset',
        type: 'fieldset',
        label: 'Fieldset preview',
        hideHeader: false,
        components: [
          {
            id: 'someTextField',
            key: 'someTextField',
            type: 'textfield',
            label: 'Nested text field',
            description: 'Description of nested text field',
            tooltip: 'Tooltip of nested text field',
          } satisfies TextFieldComponentSchema,
          {
            id: 'someTextField1',
            key: 'someTextField1',
            type: 'textfield',
            label: 'Another nested text field',
            description: 'Description of another nested text field',
            tooltip: 'Tooltip of nested text field',
          } satisfies TextFieldComponentSchema,
          {
            id: 'someTextField2',
            key: 'someTextField2',
            type: 'textfield',
            label: 'Hidden nested text field',
            description: 'Description of hidden nested text field',
            tooltip: 'Tooltip of nested text field',
            hidden: true,
          } satisfies TextFieldComponentSchema,
        ],
      } satisfies FieldsetComponentSchema,
      {
        id: 'wekruyaHidden',
        key: 'fieldsetHidden',
        type: 'fieldset',
        label: 'Fieldset preview hidden',
        hidden: true,
        hideHeader: false,
        components: [
          {
            id: 'someTextField3',
            key: 'someTextField3',
            type: 'textfield',
            label: 'Nested text field',
            description: 'Description of nested text field',
            tooltip: 'Tooltip of nested text field',
          } satisfies TextFieldComponentSchema,
          {
            id: 'someTextField4',
            key: 'someTextField4',
            type: 'textfield',
            label: 'Another nested text field',
            description: 'Description of another nested text field',
            tooltip: 'Tooltip of nested text field',
          } satisfies TextFieldComponentSchema,
          {
            id: 'someTextField5',
            key: 'someTextField5',
            type: 'textfield',
            label: 'Hidden nested text field',
            description: 'Description of hidden nested text field',
            tooltip: 'Tooltip of nested text field',
            hidden: true,
          } satisfies TextFieldComponentSchema,
        ],
      } satisfies FieldsetComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const inputLabel = canvas.getByText('Fieldset preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');

    const hiddenInputLabel = canvas.getByText('Fieldset preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with fieldset component', async () => {
      const wrapper = within(inputWrapper as HTMLElement);

      // The 'empty' message should not be displayed when there are nested components
      expect(
        wrapper.queryByText('Drag a component in the form and release the mouse button')
      ).not.toBeInTheDocument();

      const input1 = wrapper.getByLabelText('Nested text field');
      const input2 = wrapper.getByLabelText('Another nested text field');
      const hiddenInput = wrapper.getByLabelText('Hidden nested text field');
      const inputDecription1 = wrapper.getByText('Description of nested text field');
      const inputDecription2 = wrapper.getByText('Description of another nested text field');
      const hiddenInputDecription = wrapper.getByText('Description of hidden nested text field');
      const nestedHiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');

      // All nested inputs and descriptions are visible
      expect(input1).toBeVisible();
      expect(input2).toBeVisible();
      expect(hiddenInput).toBeVisible();
      expect(inputDecription1).toBeVisible();
      expect(inputDecription2).toBeVisible();
      expect(hiddenInputDecription).toBeVisible();

      // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
      expect(nestedHiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

      // Assert initial state
      expect(input1).toHaveDisplayValue('');
      expect(input2).toHaveDisplayValue('');
      expect(hiddenInput).toHaveDisplayValue('');

      // Interact
      await userEvent.type(input1, 'input value');
      await userEvent.type(input2, 'another example value');
      await userEvent.type(hiddenInput, 'psssttt, im hiding');

      // New values
      expect(input1).toHaveDisplayValue('input value');
      expect(input2).toHaveDisplayValue('another example value');
      expect(hiddenInput).toHaveDisplayValue('psssttt, im hiding');
    });

    await step('Interaction with hidden fieldset component', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);

      // The 'empty' message should not be displayed when there are nested components
      expect(
        wrapper.queryByText('Drag a component in the form and release the mouse button')
      ).not.toBeInTheDocument();

      const input1 = wrapper.getByLabelText('Nested text field');
      const input2 = wrapper.getByLabelText('Another nested text field');
      const hiddenInput = wrapper.getByLabelText('Hidden nested text field');
      const inputDecription1 = wrapper.getByText('Description of nested text field');
      const inputDecription2 = wrapper.getByText('Description of another nested text field');
      const hiddenInputDecription = wrapper.getByText('Description of hidden nested text field');
      const nestedHiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');

      // All nested inputs and descriptions are visible
      expect(input1).toBeVisible();
      expect(input2).toBeVisible();
      expect(hiddenInput).toBeVisible();
      expect(inputDecription1).toBeVisible();
      expect(inputDecription2).toBeVisible();
      expect(hiddenInputDecription).toBeVisible();

      // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
      expect(nestedHiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

      // Assert initial state
      expect(input1).toHaveDisplayValue('');
      expect(input2).toHaveDisplayValue('');
      expect(hiddenInput).toHaveDisplayValue('');

      // Interact
      await userEvent.type(input1, 'input value');
      await userEvent.type(input2, 'another example value');
      await userEvent.type(hiddenInput, 'psssttt, im hiding');

      // New values
      expect(input1).toHaveDisplayValue('input value');
      expect(input2).toHaveDisplayValue('another example value');
      expect(hiddenInput).toHaveDisplayValue('psssttt, im hiding');
    });
  },
};

export const FieldSetWithNestedComponents: Story = {
  name: 'Fieldset: With nested components',
  args: {
    components: [
      {
        id: 'fieldset',
        key: 'fieldset',
        type: 'fieldset',
        label: 'Fieldset preview',
        hideHeader: false,
        components: [
          {
            id: 'fieldset1',
            key: 'fieldset1',
            type: 'fieldset',
            label: 'Nested fieldset preview',
            hideHeader: false,
            components: [
              {
                id: 'someTextField',
                key: 'someTextField',
                type: 'textfield',
                label: 'Deep nested text field',
                description: 'Description of nested text field',
                tooltip: 'Tooltip of nested text field',
              } satisfies TextFieldComponentSchema,
            ],
          } satisfies FieldsetComponentSchema,
        ],
      } satisfies FieldsetComponentSchema,
      {
        id: 'fieldsetHidden',
        key: 'fieldsetHidden',
        type: 'fieldset',
        label: 'Fieldset preview hidden',
        hidden: true,
        hideHeader: false,
        components: [
          {
            id: 'fieldsetHidden1',
            key: 'fieldsetHidden1',
            type: 'fieldset',
            label: 'Nested fieldset preview',
            hideHeader: false,
            components: [
              {
                id: 'someTextField1',
                key: 'someTextField1',
                type: 'textfield',
                label: 'Deep nested text field',
                description: 'Description of nested text field',
                tooltip: 'Tooltip of nested text field',
              } satisfies TextFieldComponentSchema,
            ],
          } satisfies FieldsetComponentSchema,
        ],
      } satisfies FieldsetComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const inputLabel = canvas.getByText('Fieldset preview');
    const inputWrapper = inputLabel.closest('[data-testid="designerPreview"]');

    const hiddenInputLabel = canvas.getByText('Fieldset preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with fieldset component', async () => {
      const wrapper = within(inputWrapper as HTMLElement);

      // The 'empty' message should not be displayed when there are nested components
      expect(
        wrapper.queryByText('Drag a component in the form and release the mouse button')
      ).not.toBeInTheDocument();

      const nestedFieldset = wrapper.getByText('Nested fieldset preview');
      const nestedFieldsetWrapper = nestedFieldset.closest('[data-testid="designerPreview"]');

      expect(nestedFieldset).toBeVisible();
      expect(nestedFieldsetWrapper).toBeInTheDocument();

      // The deeply nested input is fully visible and accessible
      const nestedWrapper = within(nestedFieldsetWrapper as HTMLElement);
      const deepNestedInput = nestedWrapper.getByLabelText('Deep nested text field');
      const deepNestedInputDescription = nestedWrapper.getByText(
        'Description of nested text field'
      );
      expect(deepNestedInput).toBeVisible();
      expect(deepNestedInputDescription).toBeVisible();

      expect(deepNestedInput).toHaveDisplayValue('');
      await userEvent.type(deepNestedInput, 'something cool');
      expect(deepNestedInput).toHaveDisplayValue('something cool');
    });

    await step('Interaction with hidden fieldset component', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);

      // The 'empty' message should not be displayed when there are nested components
      expect(
        wrapper.queryByText('Drag a component in the form and release the mouse button')
      ).not.toBeInTheDocument();

      const nestedFieldset = wrapper.getByText('Nested fieldset preview');
      const nestedFieldsetWrapper = nestedFieldset.closest('[data-testid="designerPreview"]');

      expect(nestedFieldset).toBeVisible();
      expect(nestedFieldsetWrapper).toBeInTheDocument();

      // The deeply nested input is fully visible and accessible
      const nestedWrapper = within(nestedFieldsetWrapper as HTMLElement);
      const deepNestedInput = nestedWrapper.getByLabelText('Deep nested text field');
      const deepNestedInputDescription = nestedWrapper.getByText(
        'Description of nested text field'
      );
      expect(deepNestedInput).toBeVisible();
      expect(deepNestedInputDescription).toBeVisible();

      expect(deepNestedInput).toHaveDisplayValue('');
      await userEvent.type(deepNestedInput, 'something cool');
      expect(deepNestedInput).toHaveDisplayValue('something cool');
    });
  },
};

// @TODO implement preview component and play
export const EditGrid: Story = {
  name: 'EditGrid',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'editgrid',
        key: 'editgrid',
        label: 'A repeating group preview',
        groupLabel: 'Item',
        disableAddingRemovingRows: false,
        components: [
          {
            id: 'someTextField',
            key: 'someTextField',
            type: 'textfield',
            label: 'Nested text field',
          },
        ],
      } satisfies EditGridComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'editgrid',
        key: 'editgridHidden',
        label: 'A repeating group preview hidden',
        groupLabel: 'Item',
        hidden: true,
        disableAddingRemovingRows: false,
        components: [
          {
            id: 'someTextField',
            key: 'someTextField',
            type: 'textfield',
            label: 'Nested text field',
          },
        ],
      } satisfies EditGridComponentSchema,
    ],
  },
};

export const CosignV1: Story = {
  name: 'Cosign v1',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'coSign',
        key: 'coSign',
        label: 'A cosign v1 preview',
        authPlugin: 'digid',
      },
      {
        id: 'wekruyaHidden',
        type: 'coSign',
        key: 'coSignHidden',
        label: 'A cosign v1 preview hidden',
        hidden: true,
        authPlugin: 'digid',
      },
    ],
  },

  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Expect label and button to be shown
    const regularInputLabel = canvas.getByText('A cosign v1 preview');
    const regularInputWrapper = regularInputLabel.closest('[data-testid="designerPreview"]');
    const regularInputContainer = within(regularInputWrapper as HTMLElement);

    expect(regularInputLabel).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(regularInputContainer.getByRole('button', {name: 'Cosign (digid)'})).toBeVisible();

    // Expect the label and button of the hidden cosign v1 to be visible
    const hiddenInputLabel = canvas.getByText('A cosign v1 preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    const hiddenInputContainer = within(hiddenInputWrapper as HTMLElement);

    expect(hiddenInputLabel).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputContainer.getByRole('button', {name: 'Cosign (digid)'})).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const CosignV2: Story = {
  name: 'Cosign v2',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'cosign',
        key: 'cosign',
        label: 'A cosign v2 preview',
      } satisfies CosignV2ComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'cosign',
        key: 'cosignHidden',
        label: 'A cosign v2 preview hidden',
        hidden: true,
      } satisfies CosignV2ComponentSchema,
    ],
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Expect label and input to be shown
    const regularInput = canvas.getByLabelText('A cosign v2 preview');
    expect(regularInput).toBeVisible();
    expect(regularInput).toHaveAttribute('type', 'email');

    // Expect the label and input of the hidden cosign v2 to be visible
    const hiddenInput = canvas.getByLabelText('A cosign v2 preview hidden');
    expect(hiddenInput).toBeVisible();
    expect(hiddenInput).toHaveAttribute('type', 'email');

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    const hiddenInputWrapper = hiddenInput.closest('[data-testid="designerPreview"]');
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

export const Signature: Story = {
  name: 'Signature',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'signature',
        key: 'signature',
        label: 'A signature preview',
        footer: 'Draw above',
      },
      {
        id: 'wekruyaHidden',
        type: 'signature',
        key: 'signatureHidden',
        label: 'A signature preview hidden',
        hidden: true,
        footer: 'Draw above',
      },
    ],
  },

  play: ({canvasElement}) => {
    const canvas = within(canvasElement);

    // Expect label and drawing zone to be shown
    const regularInputLabel = canvas.getByText('A signature preview');
    const regularInputWrapper = regularInputLabel.closest('[data-testid="designerPreview"]');
    const regularInputContainer = within(regularInputWrapper as HTMLElement);

    expect(regularInputLabel).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(regularInputContainer.getByText('Draw above')).toBeVisible();

    // Expect the label and drawing zone of the hidden signature component to be visible
    const hiddenInputLabel = canvas.getByText('A signature preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    const hiddenInputContainer = within(hiddenInputWrapper as HTMLElement);

    expect(hiddenInputLabel).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(hiddenInputContainer.getByText('Draw above')).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');
  },
};

// @TODO implement preview component and play
export const LeafletMap: Story = {
  name: 'Map',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'map',
        key: 'map',
        label: 'A map preview',
        useConfigDefaultMapSettings: true,
      },
      {
        id: 'wekruyaHidden',
        type: 'map',
        key: 'mapHidden',
        label: 'A map preview hidden',
        useConfigDefaultMapSettings: true,
        hidden: true, // must be ignored
      },
    ],
  },
};

export const Partners: Story = {
  name: 'Partners',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'partners',
        key: 'partners',
        label: 'Partners preview',
        tooltip: 'An example for the tooltip',
        description: 'A preview of the partners Formio component',
      } satisfies PartnersComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'partners',
        key: 'partnersHidden',
        label: 'Partners preview hidden',
        tooltip: 'An example for the tooltip',
        description: 'A preview of the partners Formio component in hidden state',
        hidden: true,
      } satisfies PartnersComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label to be shown
    const regularInputLabel = canvas.getByText('Partners preview');
    const regularInputWrapper = regularInputLabel.closest('[data-testid="designerPreview"]');
    expect(regularInputLabel).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(canvas.getByText('A preview of the partners Formio component')).toBeVisible();

    // Expect the label of the hidden partners to be visible
    const hiddenInputLabel = canvas.getByText('Partners preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputLabel).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(
      canvas.getByText('A preview of the partners Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with partners component', async () => {
      const wrapper = within(regularInputWrapper as HTMLElement);
      const bsn = wrapper.getByLabelText('BSN');
      const initials = wrapper.getByLabelText('Initials');
      const affixes = wrapper.getByLabelText('Affixes');
      const lastname = wrapper.getByLabelText('Lastname');
      const dateOfBirth = wrapper.getByLabelText('Date of birth');

      // All fields are visible
      expect(bsn).toBeVisible();
      expect(initials).toBeVisible();
      expect(affixes).toBeVisible();
      expect(lastname).toBeVisible();
      expect(dateOfBirth).toBeVisible();

      // All fields are disabled
      expect(bsn).toBeDisabled();
      expect(initials).toBeDisabled();
      expect(affixes).toBeDisabled();
      expect(lastname).toBeDisabled();
      expect(dateOfBirth).toBeDisabled();
    });

    await step('Interaction with hidden partners component', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const bsn = wrapper.getByLabelText('BSN');
      const initials = wrapper.getByLabelText('Initials');
      const affixes = wrapper.getByLabelText('Affixes');
      const lastname = wrapper.getByLabelText('Lastname');
      const dateOfBirth = wrapper.getByLabelText('Date of birth');

      // All fields are visible
      expect(bsn).toBeVisible();
      expect(initials).toBeVisible();
      expect(affixes).toBeVisible();
      expect(lastname).toBeVisible();
      expect(dateOfBirth).toBeVisible();

      // All fields are disabled
      expect(bsn).toBeDisabled();
      expect(initials).toBeDisabled();
      expect(affixes).toBeDisabled();
      expect(lastname).toBeDisabled();
      expect(dateOfBirth).toBeDisabled();
    });
  },
};

// @TODO implement preview component and play
export const Children: Story = {
  name: 'Children',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'children',
        key: 'children',
        label: 'A children preview',
        enableSelection: false,
        tooltip: 'An example for the tooltip',
        description: 'A preview of the children Formio component',
      } satisfies ChildrenComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'children',
        key: 'childrenHidden',
        label: 'A children preview hidden',
        enableSelection: false,
        tooltip: 'An example for the tooltip',
        description: 'A preview of the children Formio component in hidden state',
        hidden: true,
      } satisfies ChildrenComponentSchema,
    ],
  },
};

export const Profile: Story = {
  name: 'Profile',
  args: {
    components: [
      {
        id: 'wekruya',
        type: 'customerProfile',
        key: 'customerProfile',
        label: 'Profile preview',
        tooltip: 'An example for the tooltip',
        description: 'A preview of the customerProfile Formio component',
        digitalAddressTypes: ['email', 'phoneNumber'],
        confirmationRecipient: false,
        shouldUpdateCustomerData: true,
      } satisfies CustomerProfileComponentSchema,
      {
        id: 'wekruyaHidden',
        type: 'customerProfile',
        key: 'customerProfileHidden',
        label: 'Profile preview hidden',
        tooltip: 'An example for the tooltip',
        description: 'A preview of the customerProfile Formio component in hidden state',
        digitalAddressTypes: ['email', 'phoneNumber'],
        confirmationRecipient: false,
        shouldUpdateCustomerData: true,
        hidden: true,
      } satisfies CustomerProfileComponentSchema,
    ],
  },
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    // Expect label to be shown
    const regularInputLabel = canvas.getByText('Profile preview');
    const regularInputWrapper = regularInputLabel.closest('[data-testid="designerPreview"]');
    expect(regularInputLabel).toBeVisible();
    expect(regularInputWrapper).toBeInTheDocument();
    expect(canvas.getByText('A preview of the customerProfile Formio component')).toBeVisible();

    // Expect the label of the hidden profile to be visible
    const hiddenInputLabel = canvas.getByText('Profile preview hidden');
    const hiddenInputWrapper = hiddenInputLabel.closest('[data-testid="designerPreview"]');
    expect(hiddenInputLabel).toBeVisible();
    expect(hiddenInputWrapper).toBeInTheDocument();
    expect(
      canvas.getByText('A preview of the customerProfile Formio component in hidden state')
    ).toBeVisible();

    // Expect the wrapper of the hidden component to have a descriptive "is hidden" title
    expect(hiddenInputWrapper).toHaveAttribute('title', 'Hidden component');

    await step('Interaction with profile component', async () => {
      const wrapper = within(regularInputWrapper as HTMLElement);
      const email = wrapper.getByLabelText('Email');
      const phoneNumber = wrapper.getByLabelText('Phone number');

      expect(email).toBeVisible();
      expect(email).toHaveDisplayValue('');
      expect(email).toHaveAttribute('type', 'email');
      await userEvent.type(email, 'test@mail.com');
      expect(email).toHaveDisplayValue('test@mail.com');

      expect(phoneNumber).toBeVisible();
      expect(phoneNumber).toHaveDisplayValue('');
      expect(phoneNumber).toHaveAttribute('type', 'tel');
      await userEvent.type(phoneNumber, '06 12345678');
      expect(phoneNumber).toHaveDisplayValue('06 12345678');
    });

    await step('Interaction with hidden profile component', async () => {
      const wrapper = within(hiddenInputWrapper as HTMLElement);
      const email = wrapper.getByLabelText('Email');
      const phoneNumber = wrapper.getByLabelText('Phone number');

      expect(email).toBeVisible();
      expect(email).toHaveDisplayValue('');
      expect(email).toHaveAttribute('type', 'email');
      await userEvent.type(email, 'test@mail.com');
      expect(email).toHaveDisplayValue('test@mail.com');

      expect(phoneNumber).toBeVisible();
      expect(phoneNumber).toHaveDisplayValue('');
      expect(phoneNumber).toHaveAttribute('type', 'tel');
      await userEvent.type(phoneNumber, '06 12345678');
      expect(phoneNumber).toHaveDisplayValue('06 12345678');
    });
  },
};
