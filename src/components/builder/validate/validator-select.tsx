import {useFormikContext} from 'formik';
import {ExtendedComponentSchema} from 'formiojs';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import {BuilderContext} from '@/context';

import Select from '../../formio/select';

export interface ValidatorOption {
  id: string;
  label: string;
}

function isValidatorOptions(options: ValidatorOption[] | undefined): options is ValidatorOption[] {
  return options !== undefined;
}

/**
 * Fetch the available validator plugins and display them in a multiselect.
 *
 * This requires an async function `getValidatorPlugins` to be provided to the
 * BuilderContext which is responsible for retrieving the list of available plugins.
 *
 * If a fetch error occurs, it is thrown during rendering - you should provide your
 * own error boundary to catch this.
 */
const ValidatorPluginSelect: React.FC = () => {
  const intl = useIntl();
  const {values} = useFormikContext<ExtendedComponentSchema>();
  const {getValidatorPlugins, formMode} = useContext(BuilderContext);

  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => await getValidatorPlugins(values.type || ''), []);
  if (error) {
    throw error;
  }
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'validate.plugins' builder field",
    defaultMessage: 'Select the plugin(s) to use for the validation functionality.',
  });
  const _options = isValidatorOptions(options) ? options : [];

  return formMode === 'appointment' ? null : (
    <Select
      name="validate.plugins"
      label={
        <FormattedMessage
          description="Label for 'validate.plugins' builder field"
          defaultMessage="Plugin(s)"
        />
      }
      tooltip={tooltip}
      isLoading={loading}
      isMulti
      isClearable
      options={_options}
      valueProperty="id"
    />
  );
};

export default ValidatorPluginSelect;
