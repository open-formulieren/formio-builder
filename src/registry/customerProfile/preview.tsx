import {
  CustomerProfileComponentSchema,
  CustomerProfileData,
  DigitalAddressType,
} from '@open-formulieren/types';
import {useFormikContext} from 'formik';
import {useEffect} from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';

import {Description, FieldSet, TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

const fieldLabels = defineMessages<DigitalAddressType>({
  email: {
    defaultMessage: 'Email',
    description: 'Label for digital address email',
  },
  phoneNumber: {
    defaultMessage: 'Phone number',
    description: 'Label for digital address phone number',
  },
});

const fieldTypes: Record<DigitalAddressType, string> = {
  email: 'email',
  phoneNumber: 'tel',
};

/**
 * Show a formio customerProfile component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<CustomerProfileComponentSchema>> = ({component}) => {
  const {getFieldProps, getFieldHelpers} = useFormikContext();
  const {key, label, description, tooltip, validate = {}, digitalAddressTypes} = component;
  const {setValue} = getFieldHelpers<CustomerProfileComponentSchema['defaultValue']>(key);
  const {value: addresses = []} = getFieldProps<CustomerProfileData>(key);

  useEffect(() => {
    // When digitalAddressTypes changes, update the addresses array to match the new types.
    if (digitalAddressTypes.length !== addresses?.length) {
      setValue(
        digitalAddressTypes.map(type => ({
          type,
          // Try to preserve the existing address if it exists, otherwise use an empty string.
          address: addresses.find(address => address.type === type)?.address || '',
        }))
      );
    }
  }, [addresses, digitalAddressTypes]);

  const {required = false} = validate;
  return (
    <FieldSet field={key} label={label} tooltip={tooltip}>
      {description && <Description text={description} />}
      <div className="offb-customer-profile-preview">
        {addresses
          .sort((a, b) => a.type.localeCompare(b.type))
          .map((address, index) => (
            <TextField
              key={address.type}
              name={`${key}.${index}.address`}
              label={<FormattedMessage {...fieldLabels[address.type]} />}
              required={required}
              type={fieldTypes[address.type]}
            />
          ))}
      </div>
    </FieldSet>
  );
};

export default Preview;
