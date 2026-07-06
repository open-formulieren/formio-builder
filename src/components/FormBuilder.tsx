import {getRegistryEntry} from '@open-formulieren/formio-renderer';
import {extractInitialValues} from '@open-formulieren/formio-renderer/values.js';
import type {AnyComponentSchema} from '@open-formulieren/types';
import {Formik} from 'formik';

import FormioDefinitionDesigner from './designer/FormioDefinitionDesigner';

export interface FormBuilderProps {
  /**
   * The components that are edited in the form builder.
   */
  components: AnyComponentSchema[];
  /**
   * A collection of all components in the form, created by flattening the form
   * definitions. Used when creating component keys to validate complete uniqueness.
   */
  componentNamespace: AnyComponentSchema[];
  onChange: (components: AnyComponentSchema[]) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({components, componentNamespace, onChange}) => {
  const initialValues = extractInitialValues(components, getRegistryEntry);

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={() => {
        throw new Error("Can't submit preview form");
      }}
    >
      <FormioDefinitionDesigner
        components={components}
        componentNamespace={componentNamespace}
        onChange={onChange}
      />
    </Formik>
  );
};

export default FormBuilder;
