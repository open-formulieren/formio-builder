import {EditFormDefinition, EditFormProps} from '.';

/**
 * Form to configure a Formio 'textfield' type component.
 */
const TextField: EditFormDefinition<EditFormProps> = () => {
  return <>TextField!</>;
};

TextField.defaultValues = {
  defaultValue: '',
};

export default TextField;
