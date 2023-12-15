import {FileComponentSchema} from '@open-formulieren/types';
import userEvent from '@testing-library/user-event';

import type {BuilderInfo} from '@/components/ComponentEditForm';
import ComponentEditForm from '@/components/ComponentEditForm';
import {contextRender, screen, waitFor} from '@/tests/test-utils';

const BUILDER_INFO: BuilderInfo = {
  title: 'File upload',
  icon: '',
  group: 'file',
  weight: 10,
  schema: {},
};

// beforeAll(() => {
//   jest.useFakeTimers();
// });

// afterAll(() => {
//   jest.useRealTimers();
// });

test('The file component edit form validates the maximum image dimensions', async () => {
  const user = userEvent.setup();
  const component = {
    webcam: false,
    options: {withCredentials: true},
    id: 'kiweljhr',
    storage: 'url',
    url: '',
    type: 'file',
    key: 'file',
    label: 'A file upload',
    file: {
      name: '',
      type: ['image/jpeg'],
      allowedTypesLabels: ['.jpg'],
    },
    filePattern: 'image/jpeg',
    of: {
      image: {
        resize: {
          apply: true,
        },
      },
    },
  } satisfies FileComponentSchema;
  const onSubmit = jest.fn();

  contextRender(
    <ComponentEditForm
      isNew
      component={component}
      builderInfo={BUILDER_INFO}
      onCancel={jest.fn()}
      onRemove={jest.fn()}
      onSubmit={onSubmit}
    />
  );

  // go to File tab
  await waitFor(async () => {
    await user.click(await screen.findByRole('link', {name: 'File'}));
  });

  // enter invalid values
  const maxWidth = await screen.findByLabelText('Maximum width');
  await user.clear(maxWidth);
  // await user.type(maxWidth, '-100');

  // const maxHeight = await screen.findByLabelText('Maximum height');
  // await user.clear(maxHeight);
  // await user.type(maxHeight, '3.14');

  // // submit form and check for the validation errors
  // await user.click(screen.getByRole('button', {name: 'Save'}));
  // expect(onSubmit).not.toHaveBeenCalled();
});
