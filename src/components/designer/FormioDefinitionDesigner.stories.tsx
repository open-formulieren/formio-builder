import type {
  AnyComponentSchema,
  ColumnsComponentSchema,
  EditGridComponentSchema,
  FieldsetComponentSchema,
  SelectComponentSchema,
  TextFieldComponentSchema,
} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {expect, fn, userEvent, waitFor, within} from 'storybook/test';

import {BuilderContextDecorator, overrideWindowConfirm, withFormik} from '@/sb-decorators';

import FormioDefinitionDesigner from './FormioDefinitionDesigner';
import type {FormioDefinitionDesignerProps} from './FormioDefinitionDesigner';

const dragTo = async (source: HTMLElement, target: HTMLElement) => {
  // To drag the dnd elements, we need the actual page coordinates.
  const sourceRect = source.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const sourceX = sourceRect.left + sourceRect.width / 2;
  const sourceY = sourceRect.top + sourceRect.height / 2;

  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  // Start a drag by clicking the left mouse button and moving the mouse on the target.
  await userEvent.pointer([
    {
      keys: '[MouseLeft>]',
      target: source,
      coords: {clientX: sourceX, clientY: sourceY},
    },
    {
      pointerName: 'mouse',
      coords: {clientX: sourceX + 10, clientY: sourceY + 10},
    },
    {
      pointerName: 'mouse',
      target,
      coords: {clientX: targetX, clientY: targetY},
    },
  ]);

  // Wait for the placeholder to be rendered in the dropzone.
  await waitFor(() => {
    expect(within(target).getByTestId('component-placeholder')).toBeInTheDocument();
  });

  // Click the left mouse button again to stop dragging/drop the component.
  await userEvent.pointer([
    {
      keys: '[MouseLeft]',
      target: document.body,
      coords: {clientX: targetX, clientY: targetY},
    },
  ]);
};

/**
 * Mimic a real implementation of the FormioDefinitionDesigner component, where adding
 * new components updates the componentNamespace, ensuring that component keys remain
 * unique.
 */
const StorybookFormioDefinitionDesigner = (props: FormioDefinitionDesignerProps) => {
  const [components, setComponents] = useState<AnyComponentSchema[]>(props.initialComponents);

  return (
    <FormioDefinitionDesigner
      {...props}
      initialComponents={components}
      onChange={(...args) => {
        setComponents(args[0]);
        // Call the original onChange function
        props.onChange(...args);
      }}
    />
  );
};

export default {
  title: 'Form designer/Form designer',
  decorators: [withFormik, BuilderContextDecorator],
  component: FormioDefinitionDesigner,
  render: StorybookFormioDefinitionDesigner,
  parameters: {
    modal: {noModal: true},
    formik: {
      wrapForm: false,
    },
    builder: {
      enableContext: true,
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof FormioDefinitionDesigner>;

type Story = StoryObj<typeof FormioDefinitionDesigner>;

export const Default: Story = {
  args: {
    initialComponents: [],
  },
};

export const WithTextfieldComponents: Story = {
  args: {
    initialComponents: [
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
        id: 'textfield2',
        key: 'textfieldPreview2',
        label: 'A second textfield preview',
        description: 'A preview of the textfield Formio component',
        tooltip: 'A preview of the textfield Formio component',
        defaultValue: 'Default value',
        hidden: false,
        placeholder: 'Sample placeholder',
        showCharCount: true,
      } satisfies TextFieldComponentSchema,
    ],
  },
};

export const AddComponentToDropzone: Story = {
  args: {
    initialComponents: [],
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);
    const basicComponentsList = canvas.getByTestId('component-group--basic');
    const textareaDraggableItem = await within(basicComponentsList).findByRole('button', {
      name: 'Textarea',
    });
    const dropzone = canvas.getByTestId('main-dropzone');

    // As there are no components, a "how to add components" message should be displayed.
    expect(
      within(dropzone).getByText('Drag a component in the form and release the mouse button.')
    ).toBeVisible();

    await dragTo(textareaDraggableItem, dropzone);

    // The edit modal for the textarea component should be opened
    const modal = canvas.getByRole('dialog');
    await waitFor(() => {
      expect(modal).toBeVisible();
    });

    // Save the component
    await userEvent.click(within(modal).getByRole('button', {name: 'Save'}));
    expect(args.onChange).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          key: 'textarea',
          label: 'Textarea',
          type: 'textarea',
        }),
      ],
      expect.objectContaining({
        type: 'created',
        // Storybook has a hard time differentiating multiple similar objects when using
        // `expect.objectContaining`. So let's stick to the poor man's `expect.anything`.
        component: expect.anything(),
      })
    );

    // Wait for the component to be added, and the instructions message to be removed.
    await waitFor(() => {
      expect(within(dropzone).getByTestId('input-textarea')).toBeVisible();

      expect(
        within(dropzone).queryByText('Drag a component in the form and release the mouse button.')
      ).not.toBeInTheDocument();
    });
  },
};

export const ComponentInColumns: Story = {
  args: {
    initialComponents: [
      {
        id: 'wekruya',
        type: 'columns',
        key: 'columns',
        columns: [
          {
            size: 6,
            sizeMobile: 4,
            components: [
              {
                id: 'textfield',
                type: 'textfield',
                key: 'textfield',
                label: 'Textfield',
              } satisfies TextFieldComponentSchema,
            ],
          },
          {
            size: 6,
            sizeMobile: 4,
            components: [],
          },
        ],
      } satisfies ColumnsComponentSchema,
    ],
  },
};

export const ComponentInFieldset: Story = {
  args: {
    initialComponents: [
      {
        id: 'fieldset',
        key: 'fieldset',
        type: 'fieldset',
        label: 'Fieldset',
        hideHeader: false,
        components: [
          {
            id: 'textfield',
            type: 'textfield',
            key: 'textfield',
            label: 'Textfield',
          } satisfies TextFieldComponentSchema,
        ],
      } satisfies FieldsetComponentSchema,
    ],
  },
};

export const ComponentInEditgrid: Story = {
  args: {
    initialComponents: [
      {
        id: 'wekruya',
        type: 'editgrid',
        key: 'editgrid',
        label: 'Repeating group',
        groupLabel: 'Item',
        disableAddingRemovingRows: false,
        components: [
          {
            id: 'textfield',
            type: 'textfield',
            key: 'textfield',
            label: 'Textfield',
          } satisfies TextFieldComponentSchema,
        ],
      } satisfies EditGridComponentSchema,
    ],
  },
};

export const EditComponent: Story = {
  args: {
    initialComponents: [
      {
        id: 'textfield',
        key: 'textfield',
        type: 'textfield',
        label: 'Textfield',
      } satisfies TextFieldComponentSchema,
    ],
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const textfieldComponent = canvas.getByTestId('sortable-item-textfield');
    expect(textfieldComponent).toBeVisible();

    // Start editing the textfield component
    within(textfieldComponent).getByLabelText('Textfield').focus();
    await userEvent.click(within(textfieldComponent).getByRole('button', {name: 'Edit component'}));

    const modal = canvas.getByRole('dialog');
    await waitFor(() => {
      expect(modal).toBeVisible();
    });

    const labelField = within(modal).getByLabelText('Label');
    await userEvent.clear(labelField);
    await userEvent.type(labelField, 'Some cool textfield label');

    await userEvent.click(within(modal).getByRole('button', {name: 'Save'}));

    // The onChange should have been called with the updated components
    expect(args.onChange).toHaveBeenCalledWith(
      [
        expect.objectContaining({
          id: 'textfield',
          key: 'textfield',
          type: 'textfield',
          label: 'Some cool textfield label',
        }),
      ],
      expect.objectContaining({
        type: 'updated',
        // Storybook has a hard time differentiating multiple similar objects when using
        // `expect.objectContaining`. So let's stick to the poor man's `expect.anything`.
        component: expect.anything(),
        originalComponent: expect.anything(),
      })
    );

    expect(canvas.getByText('Some cool textfield label')).toBeVisible();
  },
};

export const DeleteComponent: Story = {
  args: {
    initialComponents: [
      {
        id: 'textfield',
        key: 'textfield',
        type: 'textfield',
        label: 'Textfield',
      } satisfies TextFieldComponentSchema,
      {
        id: 'select',
        key: 'select',
        type: 'select',
        label: 'Select',
        openForms: {
          dataSrc: 'manual',
        },
        data: {
          values: [
            {
              label: 'Option 1',
              value: '1',
            },
          ],
        },
      } satisfies SelectComponentSchema,
    ],
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const selectComponent = canvas.getByTestId('sortable-item-select');
    expect(selectComponent).toBeVisible();

    // Delete the select component
    within(selectComponent).getByLabelText('Select').focus();
    await userEvent.click(within(selectComponent).getByRole('button', {name: 'Delete component'}));

    // The onChange should have been called with the updated components
    expect(args.onChange).toHaveBeenCalledWith(
      [
        {
          id: 'textfield',
          key: 'textfield',
          type: 'textfield',
          label: 'Textfield',
        },
      ],
      {
        type: 'deleted',
        component: expect.objectContaining({
          id: 'select',
          key: 'select',
          type: 'select',
          label: 'Select',
        }),
      }
    );
  },
};

export const DeleteNestedComponent: Story = {
  args: {
    initialComponents: [
      {
        id: 'editgrid',
        key: 'editgrid',
        type: 'editgrid',
        label: 'Editgrid',
        groupLabel: 'item',
        disableAddingRemovingRows: false,
        components: [
          {
            id: 'textfield',
            key: 'textfield',
            type: 'textfield',
            label: 'Textfield',
          } satisfies TextFieldComponentSchema,
        ],
      } satisfies EditGridComponentSchema,
    ],
  },

  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const textfieldComponent = canvas.getByTestId('sortable-item-textfield');
    expect(textfieldComponent).toBeVisible();

    // Delete the textfield component
    within(textfieldComponent).getByLabelText('Textfield').focus();
    await userEvent.click(
      within(textfieldComponent).getByRole('button', {name: 'Delete component'})
    );

    // The onChange should have been called with the updated components
    expect(args.onChange).toHaveBeenCalledWith(
      [
        {
          id: 'editgrid',
          key: 'editgrid',
          type: 'editgrid',
          label: 'Editgrid',
          groupLabel: 'item',
          disableAddingRemovingRows: false,
          components: [],
        } satisfies EditGridComponentSchema,
      ],
      {
        type: 'deleted',
        component: {
          id: 'textfield',
          key: 'textfield',
          type: 'textfield',
          label: 'Textfield',
        },
      }
    );
  },
};

export const DeleteComponentWithChildren: Story = {
  decorators: [overrideWindowConfirm],
  args: {
    initialComponents: [
      {
        id: 'editgrid',
        key: 'editgrid',
        type: 'editgrid',
        label: 'Editgrid',
        groupLabel: 'item',
        disableAddingRemovingRows: false,
        components: [
          {
            id: 'textfield',
            key: 'textfield',
            type: 'textfield',
            label: 'Textfield',
          } satisfies TextFieldComponentSchema,
        ],
      } satisfies EditGridComponentSchema,
    ],
  },
  parameters: {
    windowConfirm: fn(),
  },
  play: async ({canvasElement, args, parameters}) => {
    const canvas = within(canvasElement);

    const editgridComponent = canvas.getByTestId('sortable-item-editgrid');
    expect(editgridComponent).toBeVisible();

    // Delete the editgrid component
    within(editgridComponent).getByLabelText('Textfield').focus();
    await userEvent.click(
      within(editgridComponent).getAllByRole('button', {name: 'Delete component'})[0]
    );

    // The window.confirm should have been called
    expect(parameters.windowConfirm).toHaveBeenCalled();

    // The onChange should have been called with the updated components
    expect(args.onChange).toHaveBeenCalledWith([], {
      type: 'deleted',
      component: expect.objectContaining({
        id: 'editgrid',
        key: 'editgrid',
        type: 'editgrid',
        label: 'Editgrid',
      }),
    });
  },
};

export const DeleteComponentFromEditModal: Story = {
  args: {
    initialComponents: [
      {
        id: 'textfield',
        key: 'textfield',
        type: 'textfield',
        label: 'Textfield',
      } satisfies TextFieldComponentSchema,
    ],
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement);

    const textfieldComponent = canvas.getByTestId('sortable-item-textfield');
    expect(textfieldComponent).toBeVisible();

    // Start editing the textfield component
    within(textfieldComponent).getByLabelText('Textfield').focus();
    await userEvent.click(within(textfieldComponent).getByRole('button', {name: 'Edit component'}));

    const modal = canvas.getByRole('dialog');
    await waitFor(() => {
      expect(modal).toBeVisible();
    });

    await userEvent.click(within(modal).getByRole('button', {name: 'Remove'}));

    // The onChange should have been called with the updated components
    expect(args.onChange).toHaveBeenCalledWith([], {
      type: 'deleted',
      component: {
        id: 'textfield',
        key: 'textfield',
        type: 'textfield',
        label: 'Textfield',
      },
    });

    expect(
      canvas.getByText('Drag a component in the form and release the mouse button.')
    ).toBeVisible();
  },
};

export const DeleteComponentWithChildrenFromEditModal: Story = {
  decorators: [overrideWindowConfirm],
  args: {
    initialComponents: [
      {
        id: 'editgrid',
        key: 'editgrid',
        type: 'editgrid',
        label: 'Editgrid',
        groupLabel: 'item',
        disableAddingRemovingRows: false,
        components: [
          {
            id: 'textfield',
            key: 'textfield',
            type: 'textfield',
            label: 'Textfield',
          } satisfies TextFieldComponentSchema,
        ],
      } satisfies EditGridComponentSchema,
    ],
  },
  parameters: {
    windowConfirm: fn(),
  },
  play: async ({canvasElement, args, parameters}) => {
    const canvas = within(canvasElement);

    const editgridComponent = canvas.getByTestId('sortable-item-editgrid');
    expect(editgridComponent).toBeVisible();

    // Start editing the editgrid component
    within(editgridComponent).getByLabelText('Textfield').focus();
    await userEvent.click(
      within(editgridComponent).getAllByRole('button', {name: 'Edit component'})[0]
    );

    const modal = canvas.getByRole('dialog');
    await waitFor(() => {
      expect(modal).toBeVisible();
    });

    await userEvent.click(within(modal).getByRole('button', {name: 'Remove'}));

    // The window.confirm should have been called
    expect(parameters.windowConfirm).toHaveBeenCalled();

    // The onChange should have been called with the updated components
    expect(args.onChange).toHaveBeenCalledWith([], {
      type: 'deleted',
      component: expect.objectContaining({
        id: 'editgrid',
        key: 'editgrid',
        type: 'editgrid',
        label: 'Editgrid',
      }),
    });

    expect(
      canvas.getByText('Drag a component in the form and release the mouse button.')
    ).toBeVisible();
  },
};
