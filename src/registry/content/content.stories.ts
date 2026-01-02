import {ContentComponentSchema} from '@open-formulieren/types';
import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';

export default {
  title: 'Builder components/Content',
  component: ComponentEditForm,
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'content',
      key: 'content',
      html: '',
      openForms: {
        translations: {
          nl: {
            html: '<p>Nederlandse inhoud</p>',
          },
          en: {
            html: '<p>English content</p>',
          },
        },
      },
    },
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),

    builderInfo: {
      title: 'Content',
      icon: 'html5',
      group: 'layout',
      weight: 10,
      schema: {},
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const MultipleLanguages: Story = {
  play: async ({canvasElement, args, step}) => {
    const canvas = within(canvasElement);

    await step('Inspect content translations', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'NL'}));
      await waitFor(() => {
        expect(canvas.getByText('Nederlandse inhoud')).toBeVisible();
      });

      await userEvent.click(canvas.getByRole('link', {name: 'EN'}));
      await waitFor(() => {
        expect(canvas.getByText('English content')).toBeVisible();
      });
    });

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalledWith({
      id: 'wekruya',
      type: 'content',
      html: '<p>Nederlandse inhoud</p>',
      openForms: {
        translations: {
          nl: {
            html: '<p>Nederlandse inhoud</p>',
          },
          en: {
            html: '<p>English content</p>',
          },
        },
      },
      key: 'content',
      hidden: false,
      showInSummary: false,
      showInEmail: false,
      showInPDF: true,
      customClass: '',
      conditional: {
        eq: '',
        show: undefined,
        when: '',
      },
    } satisfies ContentComponentSchema);
  },
};
