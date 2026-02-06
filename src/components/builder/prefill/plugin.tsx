import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import Select from '@/components/formio/select';
import {BuilderContext} from '@/context';

import {ComponentWithPrefill, PrefillPluginOption} from './types';

function isPluginOptions(
  options: PrefillPluginOption[] | undefined
): options is PrefillPluginOption[] {
  return options !== undefined;
}

/**
 * Fetch the available validator plugins and display them in a multiselect.
 *
 * This requires an async function `getPrefillPlugins` to be provided to the
 * BuilderContext which is responsible for retrieving the list of available plugins.
 *
 * If a fetch error occurs, it is thrown during rendering - you should provide your
 * own error boundary to catch this.
 */
const PrefillPluginSelect: React.FC = () => {
  const intl = useIntl();
  const {values} = useFormikContext<ComponentWithPrefill>();
  const {getPrefillPlugins, formMode} = useContext(BuilderContext);

  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => await getPrefillPlugins(values.type || ''), []);
  if (error) {
    throw error;
  }
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'prefill.plugin' builder field",
    defaultMessage: 'Select the plugin to use for the prefill functionality.',
  });
  const _options = isPluginOptions(options) ? options : [];

  return formMode === 'appointment' ? null : (
    <Select
      name="prefill.plugin"
      label={
        <FormattedMessage
          description="Label for 'prefill.plugin' builder field"
          defaultMessage="Plugin"
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

export default PrefillPluginSelect;
