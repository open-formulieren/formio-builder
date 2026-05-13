import type {AnyComponentSchema, JSONValue} from '@open-formulieren/types';
import {Formik} from 'formik';

import type {ComponentGroup, PresetComponentDefinition} from '@/components/designer/types';
import {DesignerContext} from '@/context';
import {getRegistryEntry} from '@/registry';
import {hasOwnProperty} from '@/types';

import FormioDefinitionDesigner from './designer/FormioDefinitionDesigner';

export interface FormBuilderProps {
  /**
   * The components that are edited in the form builder.
   */
  components: AnyComponentSchema[];
  /**
   * The regular component groups that are shown in the form builder components list.
   */
  groups: ComponentGroup[];
  /**
   * Custom-defined component presets that are shown in the form builder components list.
   */
  presets: PresetComponentDefinition[];
}

const FormBuilder: React.FC<FormBuilderProps> = ({components, presets, groups}) => {
  const initialValues = components.reduce<Record<string, JSONValue | {}>>((carry, component) => {
    const entry = getRegistryEntry(component.type);
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
    <DesignerContext.Provider value={{groups, presets}}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={() => {
          throw new Error("Can't submit preview form");
        }}
      >
        <FormioDefinitionDesigner components={components} />
      </Formik>
    </DesignerContext.Provider>
  );
};

export default FormBuilder;
