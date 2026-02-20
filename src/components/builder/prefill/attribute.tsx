import {useField, useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';
import usePrevious from 'react-use/esm/usePrevious';

import Select from '@/components/formio/select';
import {BuilderContext} from '@/context';

import {ComponentWithPrefill, PrefillAttributeOption} from './types';

function isAttributeOptions(
  options: PrefillAttributeOption[] | undefined
): options is PrefillAttributeOption[] {
  return options !== undefined;
}

/**
 * Fetch the available validator plugins and display them in a multiselect.
 *
 * This requires an async function `getPrefillAttributes` to be provided to the
 * BuilderContext which is responsible for retrieving the list of available plugins.
 *
 * If a fetch error occurs, it is thrown during rendering - you should provide your
 * own error boundary to catch this.
 */
const PrefillAttributeSelect: React.FC = () => {
  const fieldName = 'prefill.attribute';
  const intl = useIntl();
  const {values, setFieldValue} = useFormikContext<ComponentWithPrefill>();
  const [{value: attribute}] =
    useField<ComponentWithPrefill['prefill']['attribute']>('prefill.attribute');
  const {getPrefillAttributes} = useContext(BuilderContext);
  const {plugin} = values.prefill;
  const previousPlugin = usePrevious(plugin);

  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => {
    if (!plugin) {
      setFieldValue(fieldName, '');
      return [];
    }
    if (attribute && previousPlugin && plugin !== previousPlugin) {
      setFieldValue(fieldName, '');
    }
    return await getPrefillAttributes(plugin);
  }, [plugin]);
  if (error) {
    throw error;
  }
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'prefill.attribute' builder field",
    defaultMessage: 'Specify the attribute holding the pre-fill data.',
  });
  const _options = isAttributeOptions(options) ? options : [];

  return (
    <Select
      name={fieldName}
      label={
        <FormattedMessage
          description="Label for 'prefill.attribute' builder field"
          defaultMessage="Plugin attribute"
        />
      }
      tooltip={tooltip}
      isLoading={loading}
      isClearable
      options={_options}
      valueProperty="id"
      emptyValue=""
    />
  );
};

export default PrefillAttributeSelect;
