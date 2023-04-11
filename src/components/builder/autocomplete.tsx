import {FormattedMessage} from 'react-intl';

import {TextField} from '../formio';

// for possible values, see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete

const AutoComplete: React.FC<{}> = () => (
  <TextField
    name="autocomplete"
    label={
      <FormattedMessage
        description="Component property 'Autocomplete' label"
        defaultMessage="Autocomplete"
      />
    }
    tooltip="Display options to fill in the field, based on earlier typed values."
    placeholder="on"
  />
);

export default AutoComplete;
