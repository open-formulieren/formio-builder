import {Meta, StoryObj} from '@storybook/react-webpack5';
import {expect, userEvent, within} from 'storybook/test';

import {withFormik} from '@/sb-decorators';

import RegistrationTabFields from './registration-tab';

export default {
  title: 'Builder components/File upload',
  component: RegistrationTabFields,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: {
        id: 'wekruya',
        type: 'file',
        key: 'file',
        label: 'A file field',
        storage: 'url',
        url: '',
        registration: {
          informatieobjecttype: '',
          bronorganisatie: '',
          docVertrouwelijkheidaanduiding: '',
          titel: '',
        },
      },
    },
    modal: {noModal: true},
    builder: {enableContext: true},
  },
  args: {},
} as Meta<typeof RegistrationTabFields>;

type Story = StoryObj<typeof RegistrationTabFields>;

export const DocumentTypes: Story = {
  name: 'Registration tab - document types',

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const documentTypeSelect = canvas.getByLabelText('Information object type');
    documentTypeSelect.focus();
    await userEvent.keyboard('[ArrowDown]');

    await step('Option group labels', async () => {
      expect(await canvas.findByText('VTH (RSIN: 000000000)', {exact: true})).toBeVisible();
      expect(canvas.getByText('Open Zaak > VTH (RSIN: 000000000)', {exact: true})).toBeVisible();
      expect(canvas.getByText('Open Zaak > Test catalogus name', {exact: true})).toBeVisible();
    });

    await step('Option labels', async () => {
      expect(canvas.queryAllByText('Vergunning')).toHaveLength(2);
      expect(canvas.queryAllByText('Ontheffing')).toHaveLength(1);
      expect(canvas.queryAllByText('Aanvraag')).toHaveLength(1);
    });
  },
};

export const ConfidentialityLevels: Story = {
  name: 'Registration tab - confidentiality levels',

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);

    const documentTypeSelect = canvas.getByLabelText('Confidentiality level');
    documentTypeSelect.focus();
    await userEvent.keyboard('[ArrowDown]');

    await step('Option labels', async () => {
      expect(canvas.queryByText('Openbaar')).toBeVisible();
      expect(canvas.queryByText('Beperkt openbaar')).toBeVisible();
      expect(canvas.queryByText('Zaakvertrouwelijk')).toBeVisible();
      // there are more, but the backend provides this list via the context mechanism.
    });
  },
};
