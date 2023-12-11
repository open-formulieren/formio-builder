import EditForm from './edit';
import validationSchema from './edit-validation';
import Preview from './preview';

export default {
  edit: EditForm,
  editSchema: validationSchema,
  preview: Preview,
  // component does not have a submission value but acts as a marker
  defaultValue: undefined,
};
