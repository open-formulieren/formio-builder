import {AddressNLComponentSchema} from '@open-formulieren/types';
import clsx from 'clsx';
import {FormattedMessage} from 'react-intl';

import {Description, FieldSet, TextField} from '@/components/formio';

import {ComponentPreviewProps} from '../types';
import './preview.scss';

/**
 * Show a formio address component preview.
 *
 * NOTE: for the time being, this is rendered in the default Formio bootstrap style,
 * however at some point this should use the components of
 * @open-formulieren/formio-renderer instead for a more accurate preview.
 */
const Preview: React.FC<ComponentPreviewProps<AddressNLComponentSchema>> = ({component}) => {
  const {key, label, description, tooltip, validate = {}, deriveAddress, layout} = component;

  const {required = false} = validate;
  return (
    <FieldSet field={key} label={label} tooltip={tooltip}>
      {description && <Description text={description} />}
      <div className={clsx('offb-addressnl-preview', `offb-addressnl-preview--${layout}`)}>
        <TextField
          name={`${key}.postcode`}
          label={
            <FormattedMessage description="Label for address postcode" defaultMessage="Postcode" />
          }
          inputMask="9999 AA"
          required={required}
        />
        <TextField
          name={`${key}.houseNumber`}
          label={
            <FormattedMessage
              description="Label for address housenumber"
              defaultMessage="House number"
            />
          }
          required={required}
        />
        <TextField
          name={`${key}.houseLetter`}
          label={
            <FormattedMessage
              description="Label for address houseletter"
              defaultMessage="House letter addition"
            />
          }
          inputMask="A"
        />
        <TextField
          name={`${key}.houseNumberAddition`}
          label={
            <FormattedMessage
              description="Label for address housenumberaddition"
              defaultMessage="House number addition"
            />
          }
        />
        {deriveAddress && (
          <>
            <TextField
              name={`${key}.city`}
              label={
                <FormattedMessage
                  description="Label for addressNL city read only result"
                  defaultMessage="City"
                />
              }
              disabled
            />
            <TextField
              name={`${key}.streetNumber`}
              label={
                <FormattedMessage
                  description="Label for addressNL streetName read only result"
                  defaultMessage="Street name"
                />
              }
              disabled
            />
          </>
        )}
      </div>
    </FieldSet>
  );
};

export default Preview;
