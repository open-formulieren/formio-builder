import {useField} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import Select, {Option} from '@/components/formio/select';
import {BuilderContext} from '@/context';

export interface ReferentielijstenServiceOption {
  url: string;
  slug: string;
  label: string;
  apiRoot: string;
  apiType: string;
}

function isServiceOptions(
  options: ReferentielijstenServiceOption[] | undefined
): options is ReferentielijstenServiceOption[] {
  return options !== undefined;
}

/**
 * Fetch the available Referentielijsten Services and display them in a Select
 *
 * The selected service is used at runtime to retrieve options to populate a Select
 *
 * This requires an async function `getServices` to be provided to the
 * BuilderContext which is responsible for retrieving the list of available plugins.
 *
 * If a fetch error occurs, it is thrown during rendering - you should provide your
 * own error boundary to catch this.
 */
const ReferentielijstenServiceSelect: React.FC = () => {
  const intl = useIntl();
  const {getServices} = useContext(BuilderContext);
  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => await getServices('referentielijsten'), []);
  if (error) {
    throw error;
  }
  const _options = isServiceOptions(options) ? options : [];
  const transformedOptions: Option[] = _options.map(({slug, label}) => ({
    value: slug,
    label: label,
  }));

  // react-select doesn't update the defaultValue if it is initially `null`,
  // so instead we update the value of the Formik field to ensure the correct default
  // is selected
  const [field, , {setValue}] = useField('openForms.service');
  if (transformedOptions && transformedOptions.length == 1 && !field.value) {
    setValue(transformedOptions[0].value);
  }

  return (
    <Select
      name={'openForms.service'}
      label={
        <FormattedMessage
          description="Label for 'openForms.service' builder field"
          defaultMessage="Referentielijsten service"
        />
      }
      tooltip={intl.formatMessage({
        description: "Description for the 'openForms.service' builder field",
        defaultMessage: `The identifier of the Referentielijsten service from which the options will be retrieved.`,
      })}
      isLoading={loading}
      options={transformedOptions}
      required
    />
  );
};

export default ReferentielijstenServiceSelect;
