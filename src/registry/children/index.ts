import {ChildrenComponentSchema} from '@open-formulieren/types';

import {RegistryEntry} from '../types';
import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: {
    panel: Preview,
    // @TODO add designer preview
    // The current admin uses different previews for panel and designer. Check if we can
    // simplify this and use 1 preview variant.
  },
  defaultValue: [],
} satisfies RegistryEntry<ChildrenComponentSchema>;
