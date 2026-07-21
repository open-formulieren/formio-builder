import type {AnyComponentSchema} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useContext, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import {usePrevious} from 'react-use';

import {findComponent} from '@/components/designer/dragDrop/utils/components';
import {TextField} from '@/components/formio/textfield';
import {BuilderContext} from '@/context';
import {getRegistryEntry} from '@/registry';
import type {ComparisonValueProps} from '@/registry/types';
import {hasOwnProperty} from '@/types';

import {Panel, Select} from '../formio';
import ComponentSelect from './component-select';

// Copied from formiojs/types/components/schema.d.ts
interface ConditionalOptions {
  /** If the field should show if the condition is true */
  show?: boolean;
  /** The field API key that it should compare its value against to determine if the condition is triggered. */
  when?: string;
  /** The value that should be checked against the comparison component */
  eq?: string;
  /** The JSON Logic to determine if this component is conditionally available.
   * Fyi: http://jsonlogic.com/
   */
  json?: object;
}

export interface SimpleConditional {
  conditional?: Omit<ConditionalOptions, 'json'>;
}

export const ComparisonValueInput: React.FC = () => {
  const {getFormComponents} = useContext(BuilderContext);
  const {values, setFieldValue} = useFormikContext<SimpleConditional>();

  const componentKey = values?.conditional?.when;
  const chosenComponent: AnyComponentSchema | null = componentKey
    ? findComponent(getFormComponents(), componentKey)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, setFieldValue]);

  if (!chosenComponent) return null;

  const registryEntry = getRegistryEntry(chosenComponent.type);
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
  const {formType} = useContext(BuilderContext);

  return formType === 'appointment' ? null : (
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
