import {FieldsetComponentSchema} from '@open-formulieren/types';
import userEvent from '@testing-library/user-event';

import {contextRender, screen} from '@/tests/test-utils';

import ComponentEditForm from './ComponentEditForm';

test('Mutating components after save does not mutate default values', async () => {
  // Circular import
  const {default: FieldSet} = await import('@/registry/fieldset');

  const user = userEvent.setup();
  expect(FieldSet.edit.defaultValues.components).toEqual([]);
  let savedComponent: any;

  contextRender(
    <ComponentEditForm
      isNew
      component={
        {
          id: 'fieldset',
          type: 'fieldset',
          key: 'fieldset',
          label: 'Field set',
          components: [],
          hideHeader: false,
        } satisfies FieldsetComponentSchema
      }
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
