import {CosignV2ComponentSchema} from '@open-formulieren/types';
import {FormattedMessage} from 'react-intl';

import {Description, FieldSet, TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';

/**
 * Show a formio cosign v2 component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<CosignV2ComponentSchema>> = ({component}) => {
  const {key, label, validate = {}, description, checkBsn} = component;
  const {required = false} = validate;
  return (
    <FieldSet field={key} label={label}>
      {description && <Description text={description} />}
      <TextField
        name={`${key}.email`}
        multiple={false}
        label={
          <FormattedMessage
            description="Label for the email of the cosigner"
            defaultMessage="Cosigner's email address"
          />
        }
        required={required}
        type="email"
      />
      {checkBsn && (
        <TextField
          name={`${key}.bsn`}
          multiple={false}
          label={
            <FormattedMessage
              description="Label for BSN of cosigner"
              defaultMessage="Cosigner's BSN"
            />
          }
          required={required}
          inputMask={'999999999'}
        />
      )}
    </FieldSet>
  );
};

export default Preview;
