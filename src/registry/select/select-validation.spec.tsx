import {SelectComponentSchema} from '@open-formulieren/types';
import {expect, within} from '@storybook/test';
import userEvent from '@testing-library/user-event';

import ComponentEditForm from '@/components/ComponentEditForm';
import {act, contextRender, screen} from '@/tests/test-utils';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('Option values and labels are required fields', async () => {
  const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
  const component: SelectComponentSchema = {
    id: 'wqimsadk',
    type: 'select',
    key: 'select',
    label: 'A select field',
    dataSrc: 'values',
    dataType: 'string',
    openForms: {
      dataSrc: 'manual',
      translations: {},
    },
    data: {
      values: [{value: '', label: ''}],
    },
    defaultValue: '',
  };

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
      onSubmit={jest.fn()}
    />
  );

  const labelInput = screen.getByLabelText('Option label');
  await user.type(labelInput, 'Foo');
  await user.clear(labelInput);
  await user.keyboard('[Tab]');
  expect(await screen.findByText('The option label is a required field.')).toBeVisible();
  expect(await screen.findByText('The option value is a required field.')).toBeVisible();
});

test('There is always at least one option', async () => {
  const onSubmit = jest.fn();
  const component: SelectComponentSchema = {
    id: 'wqimsadk',
    type: 'select',
    key: 'select',
    label: 'A select field',
    dataSrc: 'values',
    dataType: 'string',
    openForms: {
      dataSrc: 'manual',
      translations: {},
    },
    data: {
      values: [],
    },
    defaultValue: '',
  };

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

  // wait for first value to be added
  const firstValueLabel = await screen.findByTestId('input-data.values[0].label');
  expect(firstValueLabel).toBeVisible();
});

test('All translations are optional', async () => {
  const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});
  const onSubmit = jest.fn();
  const component: SelectComponentSchema = {
    id: 'wqimsadk',
    type: 'select',
    key: 'select',
    label: 'A select field',
    dataSrc: 'values',
    dataType: 'string',
    openForms: {
      dataSrc: 'manual',
      translations: {},
    },
    data: {
      values: [],
    },
    defaultValue: '',
  };

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

  await user.click(screen.getByRole('tab', {name: 'Translations'}));
  const editForm = within(screen.getByTestId('componentEditForm'));

  // Check that all translations can be filled
  const inputs = editForm.getAllByRole('textbox');
  for (let input of inputs) {
    await user.type(input, 'manualTranslation');
    expect(input).toHaveValue('manualTranslation');
    await user.clear(input);
    expect(input).toHaveValue('');
  }

  await act(async () => {
    // Removing focus from the last input
    await user.click(screen.getByRole('tab', {name: 'Translations'}));
  });

  // Check that none of the inputs have a Required error message
  expect(editForm.queryByText('Required')).toBeNull();
});
