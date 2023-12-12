import userEvent from '@testing-library/user-event';

import ComponentEditForm from '@/components/ComponentEditForm';
import {contextRender, screen} from '@/test-utils';

describe('Manual values: must have at least one non-empty value', () => {
  const component = {
    id: 'wqimsadk',
    type: 'select',
    key: 'select',
    label: 'A select field',
    openForms: {
      dataSrc: 'manual',
      translations: {},
    },
    values: [{value: '', label: ''}],
    defaultValue: '',
  };
  const builderInfo = {
    title: 'Select',
    icon: 'th-list',
    group: 'basic',
    weight: 70,
    schema: {},
  };

  test('Option values and labels are required fields', async () => {
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
});
