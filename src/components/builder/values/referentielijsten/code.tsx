import {useFormikContext} from 'formik';
import {useContext} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import useAsync from 'react-use/esm/useAsync';

import Select from '@/components/formio/select';
import {BuilderContext} from '@/context';

import {ComponentWithReferentielijsten, ReferentielijstenTabelOption} from './types';
import {transformItems} from './utils';

function isTabelOptions(
  options: ReferentielijstenTabelOption[] | undefined
): options is ReferentielijstenTabelOption[] {
  return options !== undefined;
}

/**
 * The `ReferentielijstenTabelCode` component is used to specify the code of the tabel
 * in Referentielijsten API for which the items will be fetched
 */
export const ReferentielijstenTabelCode: React.FC = () => {
  const intl = useIntl();
  const {values} = useFormikContext<ComponentWithReferentielijsten>();
  const service = values?.openForms?.service;
  const {getReferentielijstenTabellen} = useContext(BuilderContext);
  const {
    value: options,
    loading,
    error,
  } = useAsync(async () => {
    if (service) {
      return await getReferentielijstenTabellen(service);
    }
    return [];
  }, [service]);

  if (error) {
    throw error;
  }
  const _options = isTabelOptions(options) ? transformItems(options, intl) : [];

  return (
    <Select
      name="openForms.code"
      label={
        <FormattedMessage
          description="Label for 'openForms.code' builder field"
          defaultMessage="Referentielijsten table code"
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

export default ReferentielijstenTabelCode;
