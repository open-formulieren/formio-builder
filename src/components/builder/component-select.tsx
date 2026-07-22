import type {AnyComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext} from 'react';

import {iterComponents} from '@/components/designer/dragDrop/utils/components';
import {BuilderContext} from '@/context';
import {hasOwnProperty} from '@/types';

import {Select} from '../formio';
import type {SelectProps} from '../formio/select';

interface ComponentOption {
  value: string;
  label: string;
}

export type ComponentSelectProps = SelectProps<ComponentOption, false> & {
  options?: ComponentOption[];
};

function ComponentSelect(props: Omit<ComponentSelectProps, 'valueProperty'>) {
  const {getFormComponents} = useContext(BuilderContext);
  const {values} = useFormikContext<AnyComponentSchema>();

  // Get all the components in the form from Formio
  const options = props.options || [];
  if (!props.options) {
    for (const {component, path, holdsData} of iterComponents(getFormComponents())) {
      if (!holdsData) continue;

      // FIXME: calculate path of the component properly instead of just using the key
      if (('id' in values && component.id === values.id) || path === values.key) return;
      options.push({
        value: path,
        label: `${
          (hasOwnProperty(component, 'label') && component.label) || component.key
        } (${path})`,
      });
    }
  }

  return <Select {...props} valueProperty="value" options={options} />;
}

export default ComponentSelect;
