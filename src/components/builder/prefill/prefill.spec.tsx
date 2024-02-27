import userEvent from '@testing-library/user-event';
import {Form, Formik} from 'formik';

import {contextRender, screen} from '@/tests/test-utils';

import {PrefillConfiguration} from '.';

test('Clearing the prefill plugin', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();

  contextRender(
    <Formik
      initialValues={{prefill: {plugin: 'plugin-1', attribute: '', identifierRole: 'main'}}}
      onSubmit={onSubmit}
    >
      <Form>
        <PrefillConfiguration />
        <button type="submit">Submit</button>
      </Form>
    </Formik>,
    {}
  );

  const input = screen.getByLabelText('Plugin');

  await user.click(input);
  expect(await screen.findByRole('option', {name: 'Plugin 1'})).toBeVisible();

  // find and click the clear button, which is terribe for accessibility :/
  const container = input.closest('.formio-builder-select');
  const clearIcon = container!.querySelector(
    '.formio-builder-select__clear-indicator'
  ) as HTMLDivElement;
  await user.click(clearIcon);

  // submit the form and check the submitted values
  await user.click(screen.getByRole('button', {name: 'Submit'}));
  expect(onSubmit).toHaveBeenCalled();
  const values = onSubmit.mock.calls[0][0];
  expect(values).toEqual({
    prefill: {
      plugin: '',
      attribute: '',
      identifierRole: 'main',
    },
  });
});
