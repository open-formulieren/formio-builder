import {Meta, StoryObj} from '@storybook/react-vite';
import {expect, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import ItemsExpression from './items-expression';

export default {
  title: 'Formio/Builder/Values/ItemsExpression',
  component: ItemsExpression,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    modal: {noModal: true},
    formik: {
      initialValues: {
        openForms: {
          itemsExpression: {var: 'someVar'},
        },
      },
    },
  },
  args: {
    name: 'values',
  },
  argTypes: {
    name: {control: {disable: true}},
  },
  tags: ['autodocs'],
} as Meta<typeof ItemsExpression>;

type Story = StoryObj<typeof ItemsExpression>;

export const Default: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    const stringified = JSON.stringify({var: 'someVar'}, null, 2);
    expect(canvas.getByRole('textbox')).toHaveDisplayValue(stringified);
  },
};
