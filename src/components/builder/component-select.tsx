import type {AnyComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext} from 'react';

import {BuilderContext} from '@/context';
import {isPlaceholder, iterComponents} from '@/formio';
import {getRegistryEntry} from '@/registry';
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
    for (const {component, dataPath} of iterComponents(getFormComponents())) {
      if (isPlaceholder(component)) continue;

      const {holdsData} = getRegistryEntry(component.type);
      if (!holdsData) continue;

      // FIXME: calculate path of the component properly instead of just using the key
      if (('id' in values && component.id === values.id) || component.key === values.key) continue;
      options.push({
        value: dataPath,
        label: `${
          (hasOwnProperty(component, 'label') && component.label) || component.key
        } (${dataPath})`,
      });
    }
  }

  return <Select {...props} valueProperty="value" options={options} />;
}

export default ComponentSelect;
