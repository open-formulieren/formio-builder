import {Option} from '@open-formulieren/types/lib/formio/common';
import {Meta, StoryObj} from '@storybook/react';

import {withFormik} from '@/../.storybook/decorators';
import {Component} from '@/components/formio';

import ValuesTranslations from './i18n';

const ValuesTranslationsComponent = ValuesTranslations<{
  values: Option[];
}>;

export default {
  title: 'Formio/Builder/ValuesTable/Translations',
  component: ValuesTranslationsComponent,
  render: args => (
    <Component type="datagrid">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th style={{width: '20%'}}>Location</th>
            <th style={{width: '35%'}}>Value</th>
            <th style={{borderTop: 'none'}}>Translations</th>
          </tr>
        </thead>
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

export const Default: Story = {};
