import {ColumnsComponentSchema} from '@open-formulieren/types';
import userEvent from '@testing-library/user-event';

import ComponentEditForm from '@/components/ComponentEditForm';
import {waitFor} from '@/tests/test-utils';
import {contextRender, fireEvent, screen} from '@/tests/test-utils';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('(Added) column width sliders configure the width', async () => {
  const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
  const onSubmit = jest.fn();

  contextRender(
    <ComponentEditForm
      isNew
      component={{
        id: 'wekruya',
        type: 'columns',
        key: 'columns',
        columns: [],
      }}
      builderInfo={{title: 'Columns', icon: 'columns', group: 'layout', weight: 10, schema: {}}}
      onCancel={jest.fn()}
      onRemove={jest.fn()}
      onSubmit={onSubmit}
    />
  );

  // add a column
  await user.click(screen.getByRole('button', {name: 'Add column'}));
  // sadly not supported yet in testing-library
  // https://github.com/testing-library/user-event/issues/871
  const sliders = await screen.findAllByRole('slider', {
    name: 'Column size, value between 1 and 12.',
  });
  expect(sliders).toHaveLength(3);

  expect(sliders[0]).toHaveDisplayValue('6');
  expect(sliders[1]).toHaveDisplayValue('6');
  expect(sliders[2]).toHaveDisplayValue('6');

  // set column 1 width to 3
  fireEvent.change(sliders[0], {target: {value: 3}});
  expect(sliders[0]).toHaveDisplayValue('3');
  // set column 2 width to 2
  fireEvent.change(sliders[1], {target: {value: 2}});
  expect(sliders[1]).toHaveDisplayValue('2');
  // set column 3 width to 7
  fireEvent.change(sliders[2], {target: {value: 7}});
  expect(sliders[2]).toHaveDisplayValue('7');

  // check that the columns are configured in the submission data
  await user.click(screen.getByRole('button', {name: 'Save'}));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });

  const submittedComponent: ColumnsComponentSchema = onSubmit.mock.calls[0][0];
  expect(submittedComponent.columns).toHaveLength(3);
  expect(submittedComponent.columns[0].size).toBe(3);
  expect(submittedComponent.columns[1].size).toBe(2);
  expect(submittedComponent.columns[2].size).toBe(7);
});
