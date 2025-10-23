import {CustomerProfileComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Description, FieldSet, TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio customerProfile component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<CustomerProfileComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip, validate = {}, digitalAddressTypes} = component;

  const {required = false} = validate;
  return (
    <FieldSet field={key} label={label} tooltip={tooltip}>
      {description && <Description text={description} />}
      <div className="offb-customer-profile-preview">
        {digitalAddressTypes.email && (
          <TextField
            name={`${key}.email.address`}
            label={
              <FormattedMessage
                description="Label for digital address email"
                defaultMessage="Email"
              />
            }
            required={required}
            type="email"
          />
        )}
        {digitalAddressTypes.phoneNumber && (
          <TextField
            name={`${key}.phoneNumber.address`}
            label={
              <FormattedMessage
                description="Label for digital address phone number"
                defaultMessage="Phone number"
              />
            }
            required={required}
            type="tel"
          />
        )}
      </div>
    </FieldSet>
  );
};

export default Preview;
