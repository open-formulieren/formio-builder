import {FormattedMessage, useIntl} from 'react-intl';

import {TextField} from '../formio';

// for possible values, see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete

const AutoComplete: React.FC<{}> = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'autocomplete' builder field",
    defaultMessage: 'Display options to fill in the field, based on earlier typed values.',
  });
  return (
    <TextField
      name="autocomplete"
      label={
        <FormattedMessage
          description="Component property 'Autocomplete' label"
          defaultMessage="Autocomplete"
        />
      }
      tooltip={tooltip}
      placeholder="on"
    />
  );
};

export default AutoComplete;
