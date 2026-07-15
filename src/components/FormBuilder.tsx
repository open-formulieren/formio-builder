import type {AnyComponentSchema, JSONValue} from '@open-formulieren/types';
import {Formik} from 'formik';

import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

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
  // TODO: this initial values extraction is questionable, but scheduled for replacement
  // later on. We should ideally use the extractInitialValues implementation from the
  // formio renderer.
  const initialValues = components.reduce<Record<string, JSONValue | {}>>((carry, component) => {
    const entry = getRegistryEntry(component.type);
    const {key} = component;
    // FIXME: this is wrong for non-string based component tyeps (file, addressNL,
    // customerProfile,...). We need to use the formio-renderer single source of truth
    // for this information.
    const {defaultValue = ''} = entry;

    const isMultiple = hasOwnProperty(component, 'multiple') ? component.multiple : false;
    const componentDefaultValue = hasOwnProperty(component, 'defaultValue')
      ? component.defaultValue
      : defaultValue;

    const previewDefaultValue = isMultiple
      ? componentDefaultValue ?? []
      : componentDefaultValue ?? defaultValue;

    carry[key] = previewDefaultValue;
    return carry;
  }, {});

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
