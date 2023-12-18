import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';

import ComponentEditForm from '@/components/ComponentEditForm';
import {BuilderContextDecorator} from '@/sb-decorators';

export default {
  title: 'Builder components/File upload/Validations',
  component: ComponentEditForm,
  decorators: [BuilderContextDecorator],
  parameters: {
    builder: {enableContext: true},
  },
  args: {
    isNew: true,
    component: {
      id: 'kiweljhr',
      storage: 'url',
      url: '',
      type: 'file',
      key: 'file',
      label: 'A file upload',
      file: {
        name: '',
        type: [],
        allowedTypesLabels: [],
      },
      filePattern: '',
    },
    builderInfo: {
      title: 'File upload',
      icon: '',
      group: 'file',
      weight: 10,
      schema: {},
    },
  },
} as Meta<typeof ComponentEditForm>;

type Story = StoryObj<typeof ComponentEditForm>;

export const ResizeOptions: Story = {
  name: 'resize options',

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await step('Configure image file types', async () => {
      await userEvent.click(canvas.getByRole('link', {name: 'File'}));
      canvas.getByLabelText('File types').focus();
      await userEvent.keyboard('[ArrowDown]');
      await userEvent.click(await canvas.findByText('.jpg'));
      const enableResize = await canvas.findByLabelText('Resize image');
      fireEvent.click(enableResize);
    });

    await step('Enter invalid dimension values', async () => {
      const maxWidth = await canvas.findByLabelText('Maximum width');
      await userEvent.clear(maxWidth);
      await userEvent.type(maxWidth, '-100');

      const maxHeight = await canvas.findByLabelText('Maximum height');
      await userEvent.clear(maxHeight);
      await userEvent.type(maxHeight, '3.14');

      await userEvent.keyboard('[Tab]');

      await waitFor(async () => {
        expect(await canvas.findByText('Number must be greater than 0')).toBeVisible();
        expect(await canvas.findByText('Expected integer, received float')).toBeVisible();
      });
    });
  },
};

export const MaxNumberOfFiles: Story = {
  name: 'validate maxNumberOfFiles',

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('link', {name: 'File'}));
    await userEvent.type(canvas.getByLabelText('Maximum number of files'), '0');
    await userEvent.keyboard('[Tab]');

    await waitFor(async () => {
      expect(await canvas.findByText('Number must be greater than 0')).toBeVisible();
    });
  },
};

export const MaxFileSize: Story = {
  name: 'validate fileMaxSize',

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const doSubmit = async () => {
      const btn = canvas.getByRole('button', {name: 'Save'});
      await userEvent.click(btn);
    };

    await userEvent.click(canvas.getByRole('link', {name: 'File'}));
    const fileSize = canvas.getByLabelText('Maximum file size');

    await step('Negative file size', async () => {
      await userEvent.clear(fileSize);
      await userEvent.type(fileSize, '-10MB');

      await doSubmit();

      await waitFor(() => {
        expect(
          canvas.getByText('Specify a positive, non-zero file size without decimals, e.g. 10MB.')
        ).toBeVisible();
      });
    });

    await step('Decimal file size (period)', async () => {
      await userEvent.clear(fileSize);
      await userEvent.type(fileSize, '10.5MB');

      await doSubmit();

      await waitFor(() => {
        expect(
          canvas.getByText('Specify a positive, non-zero file size without decimals, e.g. 10MB.')
        ).toBeVisible();
      });
    });

    await step('Decimal file size (comma)', async () => {
      await userEvent.clear(fileSize);
      await userEvent.type(fileSize, '10,5 MB');

      await doSubmit();

      await waitFor(() => {
        expect(
          canvas.getByText('Specify a positive, non-zero file size without decimals, e.g. 10MB.')
        ).toBeVisible();
      });
    });
  },
};

export const ValidMaxFileSize: Story = {
  name: 'valid fileMaxSize variants',

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('link', {name: 'File'}));
    const fileSize = canvas.getByLabelText('Maximum file size');

    await step('Whitespace between value and unit', async () => {
      await userEvent.clear(fileSize);
      await userEvent.type(fileSize, '15    mb');
      await userEvent.keyboard('[Tab]');
      await waitFor(async () => {
        expect(
          canvas.queryByText('Specify a positive, non-zero file size without decimals, e.g. 10MB.')
        ).not.toBeInTheDocument();
      });
    });

    await step('Accept non-MB values', async () => {
      await userEvent.clear(fileSize);
      await userEvent.type(fileSize, '200 KB');
      await userEvent.keyboard('[Tab]');
      await waitFor(async () => {
        expect(
          canvas.queryByText('Specify a positive, non-zero file size without decimals, e.g. 10MB.')
        ).not.toBeInTheDocument();
      });
    });
  },
};

export const ValidateMaxFileSizeAgainstServerValue: Story = {
  name: 'validate fileMaxSize against serverUploadLimit',

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('link', {name: 'File'}));
    const fileSize = canvas.getByLabelText('Maximum file size');

    await userEvent.clear(fileSize);
    await userEvent.type(fileSize, '100MB');
    await userEvent.keyboard('[Tab]');
    await waitFor(async () => {
      expect(
        await canvas.findByText(
          'Specify a file size less than or equal to the server upload limit.'
        )
      ).toBeVisible();
    });
  },
};
