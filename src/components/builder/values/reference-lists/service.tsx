import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import Select from '@/components/formio/select';
import {BuilderContext} from '@/context';

import {ComponentWithReferenceLists} from './types';

/**
 * Fetch the available Reference lists services and display them in a Select
 *
 * The selected service is used at runtime to retrieve options to populate a Select
 *
 * This requires an async function `getServices` to be provided to the
 * BuilderContext which is responsible for retrieving the list of available plugins.
 *
 * If a fetch error occurs, it is thrown during rendering - you should provide your
 * own error boundary to catch this.
 */
const ReferenceListsServiceSelect: React.FC = () => {
  const intl = useIntl();
  const {values, setFieldValue} = useFormikContext<ComponentWithReferenceLists>();
  const {getServices} = useContext(BuilderContext);
  const {value: options = [], loading} = useAsync(async () => {
    const options = await getServices('referenceLists');
    if (options.length === 1 && !values?.openForms?.service) {
      setFieldValue('openForms.service', options[0].slug);
    }
    return options;
  }, [getServices, setFieldValue]); // values is deliberately excluded from the dependency array

  return (
    <Select
      name="openForms.service"
      label={
        <FormattedMessage
          description="Label for 'openForms.service' builder field"
          defaultMessage="Reference lists service"
        />
      }
      tooltip={intl.formatMessage({
        description: "Description for the 'openForms.service' builder field",
        defaultMessage: `The identifier of the reference lists service from which the options will be retrieved.`,
      })}
      isLoading={loading}
      valueProperty="slug"
      options={options}
      required
    />
  );
};

export default ReferenceListsServiceSelect;
