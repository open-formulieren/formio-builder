import {FormattedMessage} from 'react-intl';

import {TextField} from '../formio';
import {LABELS} from './messages';

/*
 * The description contains additional useful information/hints for a given field to
 * clarify what's expected by the end-user filling out the form.
 */
const Tooltip: React.FC = () => (
  <TextField name="tooltip" label={<FormattedMessage {...LABELS.tooltip} />} />
);

export default Tooltip;
