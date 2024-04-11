import {SelectComponentSchema} from '@open-formulieren/types';
import userEvent from '@testing-library/user-event';

import ComponentEditForm from '@/components/ComponentEditForm';
import {contextRender, screen, waitFor} from '@/tests/test-utils';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('Switch to multiple sets empty array as default value', async () => {
  const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
  const onSubmit = jest.fn();

  const component = {
    id: 'wqimsadk',
    type: 'select',
    key: 'select',
    label: 'A select field',
    dataSrc: 'values',
    openForms: {
      dataSrc: 'manual',
      translations: {},
    },
    data: {
      values: [{value: 'opt1', label: 'Opt1'}],
    },
    defaultValue: '',
  } satisfies SelectComponentSchema;

  const builderInfo = {
    title: 'Select',
    icon: 'th-list',
    group: 'basic',
    weight: 70,
    schema: {},
  };
  contextRender(
    <ComponentEditForm
      isNew
      component={component}
      builderInfo={builderInfo}
      onCancel={jest.fn()}
      onRemove={jest.fn()}
      onSubmit={onSubmit}
    />
  );

  const multipleInput = screen.getByLabelText('Multiple values');
  await user.click(multipleInput);

  await user.click(screen.getByRole('button', {name: 'Save'}));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });

  const submittedComponent: SelectComponentSchema = onSubmit.mock.calls[0][0];
  expect(submittedComponent.defaultValue).toStrictEqual([]);
});

test('Switch to multiple sets empty array as default value when initial is null', async () => {
  const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
  const onSubmit = jest.fn();

  const component = {
    id: 'wqimsadk',
    type: 'select',
    key: 'select',
    label: 'A select field',
    dataSrc: 'values',
    openForms: {
      dataSrc: 'manual',
      translations: {},
    },
    data: {
      values: [{value: 'opt1', label: 'Opt1'}],
    },
    // @ts-expect-error
    defaultValue: null, // This can be set by Formio
  } satisfies SelectComponentSchema;

  const builderInfo = {
    title: 'Select',
    icon: 'th-list',
    group: 'basic',
    weight: 70,
    schema: {},
  };
  contextRender(
    <ComponentEditForm
      isNew
      component={component}
      builderInfo={builderInfo}
      onCancel={jest.fn()}
      onRemove={jest.fn()}
      onSubmit={onSubmit}
    />
  );

  const multipleInput = screen.getByLabelText('Multiple values');
  await user.click(multipleInput);

  await user.click(screen.getByRole('button', {name: 'Save'}));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });

  const submittedComponent: SelectComponentSchema = onSubmit.mock.calls[0][0];
  expect(submittedComponent.defaultValue).toStrictEqual([]);
});

test('Switch to non multiple sets empty string as default value', async () => {
  const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
  const onSubmit = jest.fn();

  const component = {
    id: 'wqimsadk',
    type: 'select',
    key: 'select',
    label: 'A select field',
    dataSrc: 'values',
    openForms: {
      dataSrc: 'manual',
      translations: {},
    },
    data: {
      values: [{value: 'opt1', label: 'Opt1'}],
    },
    multiple: true,
  } satisfies SelectComponentSchema;

  const builderInfo = {
    title: 'Select',
    icon: 'th-list',
    group: 'basic',
    weight: 70,
    schema: {},
  };
  contextRender(
    <ComponentEditForm
      isNew
      component={component}
      builderInfo={builderInfo}
      onCancel={jest.fn()}
      onRemove={jest.fn()}
      onSubmit={onSubmit}
    />
  );

  const multipleInput = screen.getByLabelText('Multiple values');
  await user.click(multipleInput);

  await user.click(screen.getByRole('button', {name: 'Save'}));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });

  const submittedComponent: SelectComponentSchema = onSubmit.mock.calls[0][0];
  expect(submittedComponent.defaultValue).toBe('');
});
