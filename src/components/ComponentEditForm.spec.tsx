import userEvent from '@testing-library/user-event';

import {default as FieldSet} from '@/registry/fieldset';
import {contextRender, screen} from '@/tests/test-utils';

import ComponentEditForm from './ComponentEditForm';

test('Mutating components after save does not mutate default values', async () => {
  const user = userEvent.setup();
  expect(FieldSet.edit.defaultValues.components).toEqual([]);
  let savedComponent: any;

  contextRender(
    <ComponentEditForm
      isNew
      component={{
        type: 'fieldset',
        key: 'fieldset',
        label: 'Field set',
        components: [],
      }}
      builderInfo={{
        title: 'foo',
        group: 'bar',
        icon: 'baz',
        schema: {},
        weight: 10,
      }}
      onCancel={jest.fn()}
      onRemove={jest.fn()}
      onSubmit={component => (savedComponent = component)}
    />
  );

  await user.click(screen.getByRole('button', {name: 'Save'}));
  expect(savedComponent).not.toBeUndefined();
  expect(savedComponent.type).toBe('fieldset');

  // now mutate the component and check the impact on the default values
  savedComponent.components[0] = null;
  expect(FieldSet.edit.defaultValues.components).toEqual([]);
});
