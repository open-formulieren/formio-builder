import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import Select from '@/components/formio/select';
import {BuilderContext} from '@/context';

import {ComponentWithReferenceLists, ReferenceListsTable} from './types';
import {transformItems} from './utils';

function isTabelOptions(
  options: ReferenceListsTable[] | undefined
): options is ReferenceListsTable[] {
  return options !== undefined;
}

/**
 * The `ReferenceListsTableCode` component is used to specify the code of the tabel
 * in Reference lists API for which the items will be fetched
 */
export const ReferenceListsTableCode: React.FC = () => {
  const intl = useIntl();
  const {values} = useFormikContext<ComponentWithReferenceLists>();
  const service = values?.openForms?.service;
  const {getReferenceListsTables} = useContext(BuilderContext);
  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => {
    if (!service) {
      return [];
    }
    return await getReferenceListsTables(service);
  }, [service]);

  if (error) {
    throw error;
  }
  const validOptions = options?.filter(option => option.isGeldig);
  const _options = isTabelOptions(validOptions) ? transformItems(validOptions, intl) : [];

  return (
    <Select
      name="openForms.code"
      label={
        <FormattedMessage
          description="Label for 'openForms.code' builder field"
          defaultMessage="Reference lists table code"
        />
      }
      tooltip={intl.formatMessage({
        description: "Description for the 'openForms.code' builder field",
        defaultMessage: `The code of the table from which the options will be retrieved.`,
      })}
      isLoading={loading}
      options={_options}
      valueProperty="value"
      required
    />
  );
};

export default ReferenceListsTableCode;
