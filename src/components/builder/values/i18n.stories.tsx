import {Option} from '@open-formulieren/types';
import {Meta, StoryObj} from '@storybook/react';
import {expect, within} from '@storybook/test';

import {withFormik} from '@/../.storybook/decorators';
import {Component} from '@/components/formio';

import ValuesTranslations from './i18n';

const ValuesTranslationsComponent = ValuesTranslations<{
  values: Option[];
}>;

export default {
  title: 'Formio/Builder/Values/Translations',
  component: ValuesTranslationsComponent,
  render: args => (
    <Component type="datagrid">
      <table className="table table-bordered">
        <ValuesTranslationsComponent {...args} />
      </table>
    </Component>
  ),
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {
      initialValues: {
        values: [
          {
            value: 'mediahaven',
            label: 'Mediahaven',
            openForms: {
              translations: {
                nl: {
                  label: 'Mediahaven (NL)',
                },
              },
            },
          },
          {
            value: 'keizersgracht',
            label: 'Keizersgracht',
            openForms: {
              translations: {
                nl: {
                  label: '',
                },
              },
            },
          },
        ],
      },
    },
  },
  args: {
    name: 'values',
  },
  argTypes: {
    name: {table: {disable: true}},
  },
  tags: ['autodocs'],
} as Meta<typeof ValuesTranslationsComponent>;

type Story = StoryObj<typeof ValuesTranslationsComponent>;

export const Default: Story = {
  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Check that translations are displayed', async () => {
      const translation1 = canvas.getByLabelText('Translation for option with value "mediahaven"');
      expect(translation1).toHaveDisplayValue('Mediahaven (NL)');
      const translation2 = canvas.getByLabelText(
        'Translation for option with value "keizersgracht"'
      );
      expect(translation2).toHaveDisplayValue('');
    });

    await step('Check order of options matches order of definition', async () => {
      const allRows = canvas.getAllByRole('row');
      const firstLabel = canvas.getByRole('cell', {name: 'Mediahaven'});
      const secondLabel = canvas.getByRole('cell', {name: 'Keizersgracht'});
      expect(firstLabel).toBeVisible();
      expect(secondLabel).toBeVisible();

      const firstOptionRow = firstLabel.closest('tr') as HTMLTableRowElement;
      const secondOptionRow = secondLabel.closest('tr') as HTMLTableRowElement;
      expect(allRows.indexOf(firstOptionRow)).toBeLessThan(allRows.indexOf(secondOptionRow));
    });
  },
};
