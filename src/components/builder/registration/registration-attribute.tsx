import {useFormikContext} from 'formik';
import {ExtendedComponentSchema} from 'formiojs';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import Select from '@/components/formio/select';
import {BuilderContext} from '@/context';

export interface RegistrationAttributeOption {
  id: string;
  label: string;
}

function isAttributeOptions(
  options: RegistrationAttributeOption[] | undefined
): options is RegistrationAttributeOption[] {
  return options !== undefined;
}

/**
 * Fetch the available validator plugins and display them in a multiselect.
 *
 * This requires an async function `getRegistrationAttributes` to be provided to the
 * BuilderContext which is responsible for retrieving the list of available plugins.
 *
 * If a fetch error occurs, it is thrown during rendering - you should provide your
 * own error boundary to catch this.
 */
const RegistrationAttributeSelect: React.FC = () => {
  const intl = useIntl();
  const {values} = useFormikContext<ExtendedComponentSchema>();
  const {getRegistrationAttributes, formMode} = useContext(BuilderContext);

  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => await getRegistrationAttributes(values.type || ''), []);
  if (error) {
    throw error;
  }
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'registration.attribute' builder field",
    defaultMessage: 'Save the value as this attribute in the registration backend system.',
  });
  const _options = isAttributeOptions(options) ? options : [];

  return formMode === 'appointment' ? null : (
    <Select
      name="registration.attribute"
      label={
        <FormattedMessage
          description="Label for 'registration.attribute' builder field"
          defaultMessage="Registration attribute"
        />
      }
      tooltip={tooltip}
      isLoading={loading}
      isClearable
      options={_options}
      valueProperty="id"
    />
  );
};

export default RegistrationAttributeSelect;
