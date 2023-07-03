import {FormattedMessage} from 'react-intl';

import {TextField} from '../formio';

/*
 * The description contains additional useful information/hints for a given field to
 * clarify what's expected by the end-user filling out the form.
 */
const Tooltip: React.FC = () => (
  <TextField
    name="tooltip"
    label={
      <FormattedMessage description="Component property 'Tooltip' label" defaultMessage="Tooltip" />
    }
  />
);

export default Tooltip;
