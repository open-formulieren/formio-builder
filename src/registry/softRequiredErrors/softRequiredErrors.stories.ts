import {SoftRequiredErrorsComponentSchema} from '@open-formulieren/types';
import {Meta, StoryObj} from '@storybook/react';
import {expect, fn, userEvent, waitFor, within} from '@storybook/test';

import ComponentEditForm from '@/components/ComponentEditForm';

export default {
  title: 'Builder components/Soft required errors',
  component: ComponentEditForm,
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'wekruya',
      type: 'softRequiredErrors',
      key: 'softRequiredErrors',
      html: '',
      openForms: {
        translations: {
          nl: {
            html: '<p>Niet alle velden zijn ingevuld.</p>\n{{ missingFields }}',
          },
          en: {
            html: '<p>Not all fields have been filled.</p>\n{{ missingFields }}',
          },
        },
      },
    },
    onCancel: fn(),
    onRemove: fn(),
    onSubmit: fn(),

    builderInfo: {
      title: 'Soft required errors',
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
        expect(canvas.getByText('Niet alle velden zijn ingevuld.')).toBeVisible();
      });

      await userEvent.click(canvas.getByRole('link', {name: 'EN'}));
      await waitFor(() => {
        expect(canvas.getByText('Not all fields have been filled.')).toBeVisible();
      });
    });

    await userEvent.click(canvas.getByRole('button', {name: 'Save'}));
    expect(args.onSubmit).toHaveBeenCalledWith({
      id: 'wekruya',
      type: 'softRequiredErrors',
      label: '',
      html: '<p>Niet alle velden zijn ingevuld.</p>\n{{ missingFields }}',
      openForms: {
        translations: {
          nl: {
            html: '<p>Niet alle velden zijn ingevuld.</p>\n{{ missingFields }}',
          },
          en: {
            html: '<p>Not all fields have been filled.</p>\n{{ missingFields }}',
          },
        },
      },
      key: 'softRequiredErrors',
    } satisfies SoftRequiredErrorsComponentSchema);
  },
};
