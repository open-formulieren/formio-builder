import {FormattedMessage} from 'react-intl';

import {TextField} from '../formio';
import {LABELS} from './messages';

/*
 * The label specifies the label for a form field visible for end users filling out the
 * field.
 *
 * Additionally, it typically serves as input/starting value to derive the component key
 * and can typically be translated by the form designers.
 */
const Label: React.FC = () => (
  <TextField name="label" label={<FormattedMessage {...LABELS.label} />} required />
);

export default Label;
