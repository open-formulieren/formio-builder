import userEvent from '@testing-library/user-event';
import {Formik} from 'formik';

import {act, contextRender, screen} from '@/tests/test-utils';

import RegistrationAttributeSelect, {RegistrationAttributeOption} from './registration-attribute';

const REGISTRATION_ATTRIBUTES: RegistrationAttributeOption[] = [
  {id: 'bsn', label: 'BSN'},
  {id: 'firstName', label: 'First name'},
  {id: 'dob', label: 'Date of Birth'},
];

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('Available registration attributes are retrieved via context', async () => {
  const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

  contextRender(
    <Formik onSubmit={jest.fn()} initialValues={{registration: {attribute: ''}}}>
      <RegistrationAttributeSelect />
    </Formik>,
    {
      enableContext: true,
      locale: 'en',
      builderOptions: {
        registrationAttributes: REGISTRATION_ATTRIBUTES,
        registrationAttributesDelay: 100,
      },
    }
  );

  // open the dropdown
  const input = await screen.findByLabelText('Registration attribute');
  await act(async () => {
    input.focus();
    await user.keyboard('[ArrowDown]');
  });

  // options are loaded async, while doing network IO the loading state is displayed
  expect(await screen.findByText('Loading...')).toBeVisible();

  // once resolved, the options are visible and the loading state is no longer
  expect(await screen.findByText('BSN')).toBeVisible();
  expect(await screen.findByText('First name')).toBeVisible();
  expect(await screen.findByText('Date of Birth')).toBeVisible();
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});
