import {FormattedMessage, useIntl} from 'react-intl';

import {TextField} from '../formio';

const Suffix: React.FC = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'suffix' builder field",
    defaultMessage: `A short indicator that can provide more context for the expected field value.
      The '<sup> and <sub>' HTML tags are supported.`,
  });
  return (
    <TextField
      name="suffix"
      label={
        <FormattedMessage
          description="Label for 'suffix' builder field"
          defaultMessage="A short indicator to discribe the field value, e.g. <example></example>."
          values={{
            example: () => <code>m&lt;sup&gt;3&lt;/sup&gt;</code>,
          }}
        />
      }
      tooltip={tooltip}
    />
  );
};

export default Suffix;
