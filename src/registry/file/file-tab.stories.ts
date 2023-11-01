import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';

import {BuilderContextDecorator, withFormik} from '@/sb-decorators';

import FileTabFields from './file-tab';

export default {
  title: 'Builder components/File upload',
  component: FileTabFields,
  decorators: [withFormik, BuilderContextDecorator],
  parameters: {
    formik: {
      initialValues: {
        id: 'wekruya',
        type: 'file',
        key: 'file',
        label: 'A file field',
        storage: 'url',
        url: '',
        file: {
          name: '',
          type: [],
          allowedTypesLabels: [],
        },
        filePattern: '*',
        useConfigFiletypes: false,
        of: {
          image: {
            resize: {
              apply: false,
              width: 2000,
              height: 2000,
            },
          },
        },
        fileMaxSize: '10MB',
        maxNumberOfFiles: null,
        validate: {
          required: false,
        },
      },
    },
    modal: {noModal: true},
    builder: {enableContext: true},
  },
  args: {},
} as Meta<typeof FileTabFields>;

type Story = StoryObj<typeof FileTabFields>;

export const ImageResizeOptionsShown: Story = {
  name: 'Files tab - show image resize options',

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('No resize controls initially visible', () => {
      expect(canvas.queryByLabelText('Resize image')).not.toBeInTheDocument();
      expect(canvas.queryByLabelText('Maximum width')).not.toBeInTheDocument();
      expect(canvas.queryByLabelText('Maximum height')).not.toBeInTheDocument();
    });

    await step('Select image file types displays controls', async () => {
      canvas.getByLabelText('File types').focus();
      await userEvent.keyboard('[ArrowDown]');
      await waitFor(async () => {
        await expect(canvas.queryByText('.png')).toBeVisible();
      });
      await userEvent.click(canvas.getByText('.png'));
      expect(canvas.queryByLabelText('Resize image')).toBeVisible();
      expect(canvas.queryByLabelText('Resize image')).not.toBeChecked();
      expect(canvas.queryByLabelText('Maximum width')).not.toBeInTheDocument();
      expect(canvas.queryByLabelText('Maximum height')).not.toBeInTheDocument();
    });

    await step('Enabling image resizing displays dimension controls', async () => {
      fireEvent.click(canvas.getByLabelText('Resize image'));

      expect(canvas.queryByLabelText('Maximum width')).toBeVisible();
      expect(canvas.queryByLabelText('Maximum width')).toHaveDisplayValue('2000');
      expect(canvas.queryByLabelText('Maximum height')).toBeVisible();
      expect(canvas.queryByLabelText('Maximum height')).toHaveDisplayValue('2000');
    });
  },
};
