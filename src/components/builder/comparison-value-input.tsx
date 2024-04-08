import {useFormikContext} from 'formik';
import {ExtendedComponentSchema, Utils as FormioUtils} from 'formiojs';
import {useContext, useEffect, useState} from 'react';
import usePrevious from 'react-use/esm/usePrevious';

import {BuilderContext} from '@/context';
import {getRegistryEntry} from '@/registry';
import Fallback from '@/registry/fallback';
import {comparisonValueComponentProps} from '@/registry/types';

export interface simpleConditional {
  conditional: {
    eq: string;
    when: string;
    show: null | boolean;
  };
}

export const ComparisonValueInput: React.FC = () => {
  const {getFormComponents} = useContext(BuilderContext);
  const {values, setFieldValue} = useFormikContext<simpleConditional>();

  const [chosenComponent, setChosenComponent] = useState<ExtendedComponentSchema | null>(null);
  const previousWhen = usePrevious(values.conditional.when);

  useEffect(() => {
    const conditional = values.conditional;
    if (conditional?.when === '' && conditional?.eq !== '') {
      setFieldValue('conditional.eq', '');
      setChosenComponent(null);
      return;
    }

    if (previousWhen !== conditional?.when) {
      setFieldValue('conditional.eq', '');
    }

    const component: ExtendedComponentSchema = FormioUtils.getComponent(
      getFormComponents(),
      conditional.when,
      false
    );

    setChosenComponent(component);
  }, [values, setFieldValue]);

  if (!chosenComponent) return null;

  const registryEntry = getRegistryEntry(chosenComponent);
  const {comparisonValueComponent} = registryEntry;
  const ComparisonValueInputComponent =
    comparisonValueComponent || Fallback.comparisonValueComponent;

  const props: comparisonValueComponentProps = {};
  if (chosenComponent.hasOwnProperty('multiple')) props.multiple = chosenComponent.multiple;

  return <ComparisonValueInputComponent {...props} />;
};

export default ComparisonValueInput;
