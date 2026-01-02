import type {CustomerProfileComponentSchema} from '@open-formulieren/types';
import {DigitalAddressType} from '@open-formulieren/types/dist/components/customerProfile';
import {FormattedMessage, defineMessages} from 'react-intl';

import {Description, FieldSet, TextField} from '@/components/formio';

import type {ComponentPreviewProps} from '../types';

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
  const {key, label, description, tooltip, validate = {}, digitalAddressTypes = []} = component;

  const {required = false} = validate;
  return (
    <FieldSet field={key} label={label} tooltip={tooltip}>
      {digitalAddressTypes
        .sort((a, b) => a.localeCompare(b))
        .map((addressType, index) => (
          <TextField
            key={addressType}
            name={`${key}.${index}.address`}
            label={<FormattedMessage {...fieldLabels[addressType]} />}
            required={required}
            type={fieldTypes[addressType]}
          />
        ))}
      {description && <Description text={description} />}
    </FieldSet>
  );
};

export default Preview;
