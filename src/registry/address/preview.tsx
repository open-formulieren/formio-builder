import {AddressComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Description, FieldSet, TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio address component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<AddressComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip, validate = {}} = component;

  const {required = false} = validate;
  return (
    <FieldSet
      type="address"
      field={key}
      required={required}
      htmlId={`editform-${key}`}
      label={label}
      tooltip={tooltip}
    >
      {description && <Description text={description} />}
      <TextField
        name={`${key}.postcode`}
        label={
          <FormattedMessage description="Label for address postcode" defaultMessage="Postcode" />
        }
        inputMask="9999 AA"
        required={required}
      />
      <TextField
        name={`${key}.housenumber`}
        label={
          <FormattedMessage
            description="Label for address housenumber"
            defaultMessage="House number"
          />
        }
        required={required}
      />
      <TextField
        name={`${key}.houseletter`}
        label={
          <FormattedMessage
            description="Label for address houseletter"
            defaultMessage="House letter addition"
          />
        }
        inputMask="A"
      />
      <TextField
        name={`${key}.housenumberaddition`}
        label={
          <FormattedMessage
            description="Label for address housenumberaddition"
            defaultMessage="House number addition"
          />
        }
      />
    </FieldSet>
  );
};

export default Preview;
