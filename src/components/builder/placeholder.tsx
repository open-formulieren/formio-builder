import {FormattedMessage, useIntl} from 'react-intl';

import {TextField} from '../formio';
import {LABELS} from './messages';

const Placeholder = () => {
  const intl = useIntl();
  const tooltip = intl.formatMessage({
    description: "Tooltip for 'placeholder' builder field",
    defaultMessage: 'The placeholder text that will appear when this field is empty.',
  });
  const placeholder = intl.formatMessage({
    description: "Placeholder for 'placeholder' builder field",
    defaultMessage: 'Placeholder',
  });
  return (
    <TextField
      name="placeholder"
      label={<FormattedMessage {...LABELS.placeholder} />}
      tooltip={tooltip}
      placeholder={placeholder}
    />
  );
};

export default Placeholder;
