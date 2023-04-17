import withFormik from '@bbbtech/storybook-formik';
import {expect} from '@storybook/jest';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import {userEvent, waitFor, within} from '@storybook/testing-library';

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
} as ComponentMeta<typeof RegistrationAttributeSelect>;

const Template: ComponentStory<typeof RegistrationAttributeSelect> = () => (
  <RegistrationAttributeSelect />
);

export const Default = Template.bind({});
Default.play = async ({canvasElement}) => {
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
};
