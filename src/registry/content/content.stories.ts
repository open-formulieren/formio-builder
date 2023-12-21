import {ContentComponentSchema} from '@open-formulieren/types';
import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {userEvent, waitFor, within} from '@storybook/testing-library';

import ComponentEditForm from '@/components/ComponentEditForm';
import {BuilderContextDecorator} from '@/sb-decorators';

export default {
  title: 'Builder components/Content',
  component: ComponentEditForm,
  decorators: [BuilderContextDecorator],
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
      label: '',
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
