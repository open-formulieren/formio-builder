import type {AnyComponentSchema, JSONValue} from '@open-formulieren/types';
import {Formik} from 'formik';

import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import FormDesigner from './designer/FormDesigner';

export interface FormBuilderProps {
  components: AnyComponentSchema[];
}

const FormBuilder: React.FC<FormBuilderProps> = ({components}) => {
  const initialValues = components.reduce<Record<string, JSONValue | {}>>((carry, component) => {
    const entry = getRegistryEntry(component);
    const {key} = component;
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
      <FormDesigner components={components} />
    </Formik>
  );
};

export default FormBuilder;
