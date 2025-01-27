import {FormattedMessage, useIntl} from 'react-intl';

import {TextField} from '@/components/formio';

/**
 * The `ReferentielijstenTabelCode` component is used to specify the code of the tabel
 * in Referentielijsten API for which the items will be fetched
 */
export const ReferentielijstenTabelCode: React.FC = () => {
  const intl = useIntl();
  return (
    <TextField
      name={'openForms.code'}
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
      required
    />
  );
};

export default ReferentielijstenTabelCode;
