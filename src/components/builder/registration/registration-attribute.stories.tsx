import {expect} from '@storybook/jest';
import {Meta, StoryFn, StoryObj} from '@storybook/react';
import {userEvent, waitFor, within} from '@storybook/testing-library';

import {withFormik} from '@/sb-decorators';

import RegistrationAttributeSelect, {RegistrationAttributeOption} from './registration-attribute';

const DEFAULT_REGISTRATION_ATTRIBUTES: RegistrationAttributeOption[] = [
  {id: 'bsn', label: 'BSN'},
  {id: 'firstName', label: 'First name'},
  {id: 'dob', label: 'Date of Birth'},
];

export default {
  title: 'Formio/Builder/Registration/RegistrationAttributeSelect',
  component: RegistrationAttributeSelect,
  decorators: [withFormik],
  parameters: {
    controls: {hideNoControlsWarning: true},
    docs: {
      source: {
        type: 'dynamic',
        excludeDecorators: true,
      },
      // https://github.com/bbbtech/storybook-formik/issues/51#issuecomment-1136668271
      inlineStories: false,
      iframeHeight: 200,
    },
    modal: {noModal: true},
    builder: {enableContext: true, registrationAttributesDelay: 100},
    formik: {initialValues: {registration: {attribute: ''}}},
  },
  args: {
    registrationAttributes: DEFAULT_REGISTRATION_ATTRIBUTES,
  },
} as Meta<typeof RegistrationAttributeSelect>;

type Story = StoryObj<typeof RegistrationAttributeSelect>;

const Template: StoryFn<typeof RegistrationAttributeSelect> = () => <RegistrationAttributeSelect />;

export const Default: Story = {
  render: Template,

  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    const input = await canvas.getByLabelText('Registration attribute');

    // open the dropdown
    await input.focus();
    await userEvent.keyboard('[ArrowDown]');

    await waitFor(async () => {
      await expect(canvas.queryByText('Loading...')).toBeInTheDocument();
    });
    // assert the options are present
    await waitFor(async () => {
      await expect(canvas.queryByText('BSN')).toBeInTheDocument();
      await expect(canvas.queryByText('First name')).toBeInTheDocument();
      await expect(canvas.queryByText('Date of Birth')).toBeInTheDocument();
    });
  },
};
