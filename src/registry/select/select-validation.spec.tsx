import {SelectComponentSchema} from '@open-formulieren/types';
import userEvent from '@testing-library/user-event';

import ComponentEditForm from '@/components/ComponentEditForm';
import {contextRender, screen} from '@/tests/test-utils';

test('Option values and labels are required fields', async () => {
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
      values: [{value: '', label: ''}],
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
      onSubmit={jest.fn()}
    />
  );

  const labelInput = screen.getByLabelText('Option label');
  await userEvent.type(labelInput, 'Foo');
  await userEvent.clear(labelInput);
  await userEvent.keyboard('[Tab]');
  await expect(await screen.findByText('The option label is a required field.')).toBeVisible();
  await expect(await screen.findByText('The option value is a required field.')).toBeVisible();
});
