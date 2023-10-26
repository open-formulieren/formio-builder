import {expect} from '@storybook/jest';
import {Meta, StoryObj} from '@storybook/react';
import {fireEvent, userEvent, waitFor, within} from '@storybook/testing-library';

import {BuilderContextDecorator, withFormik} from '@/sb-decorators';

import RegistrationTabFields from './registration-tab';

export default {
  title: 'Builder components/File upload',
  component: RegistrationTabFields,
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

export const RegistrationTab: Story = {
  name: 'Registration tab',

  play: async ({canvasElement, step}) => {
    const canvas = within(canvasElement);
  },
};
