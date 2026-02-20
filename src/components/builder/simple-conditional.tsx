import {AnyComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {Utils as FormioUtils} from 'formiojs';
import type {ConditionalOptions} from 'formiojs';
import {useContext, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import usePrevious from 'react-use/esm/usePrevious';

import {TextField} from '@/components/formio/textfield';
import {BuilderContext} from '@/context';
import {getRegistryEntry} from '@/registry';
import {ComparisonValueProps} from '@/registry/types';
import {hasOwnProperty} from '@/types';

import {Panel, Select} from '../formio';
import ComponentSelect from './component-select';

export interface SimpleConditional {
  conditional?: Omit<ConditionalOptions, 'json'>;
}

export const ComparisonValueInput: React.FC = () => {
  const {getFormComponents} = useContext(BuilderContext);
  const {values, setFieldValue} = useFormikContext<SimpleConditional>();

  const componentKey = values?.conditional?.when;
  const chosenComponent: AnyComponentSchema = componentKey
    ? FormioUtils.getComponent(getFormComponents(), componentKey, false)
    : null;
  const previousWhen = usePrevious(componentKey);

  useEffect(() => {
    const conditional = values?.conditional;
    if (conditional?.when === '' && conditional?.eq !== '') {
      setFieldValue('conditional.eq', '');
      return;
    }

    if (previousWhen !== undefined && previousWhen !== conditional?.when) {
      setFieldValue('conditional.eq', '');
    }
  }, [values, setFieldValue]);

  if (!chosenComponent) return null;

  const registryEntry = getRegistryEntry(chosenComponent);
  const {comparisonValue} = registryEntry;
  const InputComponent = comparisonValue || TextField;

  const props: ComparisonValueProps = {
    name: 'conditional.eq',
    label: (
      <FormattedMessage
        description="Component property 'conditional.eq' label"
        defaultMessage="Has the value"
      />
    ),
  };

  if (hasOwnProperty(chosenComponent, 'multiple')) {
    props.multiple = chosenComponent.multiple as boolean;
  }

  return <InputComponent {...props} />;
};

const SimpleConditional: React.FC = () => {
  const {formMode} = useContext(BuilderContext);

  return formMode === 'appointment' ? null : (
    <Panel
      title={
        <FormattedMessage
          description="Simple conditional panel title"
          defaultMessage="Simple conditional"
        />
      }
    >
      <Select
        name="conditional.show"
        label={
          <FormattedMessage
            description="Component property 'conditional.show' label"
            defaultMessage="This component should display"
          />
        }
        options={[
          {value: true, label: 'True'},
          {value: false, label: 'False'},
        ]}
        isClearable
      />
      <ComponentSelect
        name="conditional.when"
        label={
          <FormattedMessage
            description="Component property 'conditional.when' label"
            defaultMessage="When the form component"
          />
        }
        isClearable
      />
      <ComparisonValueInput />
    </Panel>
  );
};

export default SimpleConditional;
