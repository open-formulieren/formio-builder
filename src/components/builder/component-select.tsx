import {useFormikContext} from 'formik';
import {ExtendedComponentSchema, Utils as FormioUtils} from 'formiojs';
import {useContext} from 'react';

import {BuilderContext} from 'context';

import {Select} from '../formio';
import {SelectProps} from '../formio/select';

interface ComponentOption {
  value: string;
  label: string;
}

export type ComponentSelectProps = SelectProps<ComponentOption, false> & {
  options?: ComponentOption[];
};

function ComponentSelect(props: Omit<ComponentSelectProps, 'valueProperty'>) {
  const {getFormComponents} = useContext(BuilderContext);
  const {values} = useFormikContext<ExtendedComponentSchema>();

  // Get all the components in the form from Formio
  const options = props.options || [];
  if (!props.options) {
    FormioUtils.eachComponent(
      getFormComponents(),
      (component: ExtendedComponentSchema, path: string) => {
        // FIXME: calculate path of the component properly instead of just using the key
        if (('id' in values && component.id === values.id) || path === values.key) return;
        options.push({
          value: path,
          label: `${component.label || component.key} (${path})`,
        });
      }
    );
  }

  return <Select {...props} valueProperty="value" options={options} />;
}

export default ComponentSelect;
