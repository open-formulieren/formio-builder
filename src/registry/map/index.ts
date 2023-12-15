// a hack - this library has side effects because it patches L from leaflet.
import 'proj4leaflet';

import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  defaultValue: undefined,
};
