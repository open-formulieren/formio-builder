import type {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

import {withFormik} from '@/../.storybook/decorators';
import {Component} from '@/components/formio';

import FAQItemsTranslations from './i18n';

export default {
  title: 'Formio/Builder/FAQ items/Translations',
  component: FAQItemsTranslations,
  render: () => (
    <Component type="datagrid">
      <table className="table table-bordered">
        <FAQItemsTranslations />
      </table>
    </Component>
  ),
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {
      initialValues: {
        faqItems: [
          {
            id: '38380023-853d-451d-8d9d-fc8c71c4ffc2',
            label: 'Should I fill this in?',
            content: 'Yes you should',
            openForms: {
              translations: {
                nl: {
                  label: 'Moet ik dit invullen?',
                  content: 'Ja dat moet',
                },
                en: {
                  label: 'Should I fill this in?',
                  content: 'Yes you should',
                },
              },
            },
          },
          {
            id: 'cd50ec95-a747-471d-91c7-67979032fd7c',
            label: "I've XYZ, should I fill this in?",
            content: 'Add XYZ',
            openForms: {
              translations: {
                en: {
                  label: "I've XYZ, should I fill this in?",
                  content: 'Add XYZ',
                },
              },
            },
          },
        ],
      },
    },
  },
  argTypes: {
    name: {table: {disable: true}},
  },
  tags: ['autodocs'],
} as Meta<typeof FAQItemsTranslations>;

type Story = StoryObj<typeof FAQItemsTranslations>;

export const Default: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Check that translations are displayed', async () => {
      const translation1 = canvas.getByLabelText(
        'Translation for label with value "Should I fill this in?"'
      );
      expect(translation1).toHaveDisplayValue('Moet ik dit invullen?');
      const translation2 = canvas.getByLabelText(
        'Translation for label with value "I\'ve XYZ, should I fill this in?"'
      );
      expect(translation2).toHaveDisplayValue('');
    });

    await step('Check order of options matches order of definition', async () => {
      const allRows = canvas.getAllByRole('row');
      const firstLabel = canvas.getByRole('cell', {name: 'FAQ item 0 label'});
      const secondLabel = canvas.getByRole('cell', {name: 'FAQ item 1 label'});
      expect(firstLabel).toBeVisible();
      expect(secondLabel).toBeVisible();

      const firstOptionRow = firstLabel.closest('tr') as HTMLTableRowElement;
      const secondOptionRow = secondLabel.closest('tr') as HTMLTableRowElement;
      expect(allRows.indexOf(firstOptionRow)).toBeLessThan(allRows.indexOf(secondOptionRow));
    });
  },
};
