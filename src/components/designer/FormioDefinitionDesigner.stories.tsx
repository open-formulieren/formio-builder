import type {AnyComponentSchema, TextFieldComponentSchema} from '@open-formulieren/types';
import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';
import {expect, userEvent, waitFor, within} from 'storybook/test';

import {DesignerContext} from '@/context';
import {DesignerContextDecorator, withFormik} from '@/sb-decorators';

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
  const [namespace, setNamespace] = useState<AnyComponentSchema[]>(props.components.flat(1));

  return (
    <DesignerContext.Provider
      value={{
        componentNamespace: namespace,
      }}
    >
      <FormioDefinitionDesigner
        {...props}
        onChange={components => setNamespace(components.flat(1))}
      />
    </DesignerContext.Provider>
  );
};

export default {
  title: 'Form designer/Form designer',
  decorators: [withFormik, DesignerContextDecorator],
  component: FormioDefinitionDesigner,
  render: StorybookFormioDefinitionDesigner,
  parameters: {
    modal: {noModal: true},
  },
} satisfies Meta<typeof FormioDefinitionDesigner>;

type Story = StoryObj<typeof FormioDefinitionDesigner>;

export const Default: Story = {
  args: {
    components: [],
  },
};

export const WithTextfieldComponents: Story = {
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
    components: [],
  },
  play: async ({canvasElement}) => {
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

    // The textarea component should be added to the dropzone
    expect(within(dropzone).getByTestId('input-Textarea'));
    // As the dropzone isn't empty anymore, the instructions message should be gone.
    expect(
      within(dropzone).queryByText('Drag a component in the form and release the mouse button.')
    ).not.toBeInTheDocument();
  },
};
