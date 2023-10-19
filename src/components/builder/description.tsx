import {FormattedMessage} from 'react-intl';

import {TextField} from '../formio';
import {LABELS} from './messages';

/*
 * The description contains additional useful information/hints for a given field to
 * clarify what's expected by the end-user filling out the form.
 */
const Description: React.FC = () => (
  <TextField name="description" label={<FormattedMessage {...LABELS.description} />} />
);

export default Description;
