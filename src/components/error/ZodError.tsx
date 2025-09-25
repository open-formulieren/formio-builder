import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {z} from 'zod';

export interface ZodErrorProps {
  error: z.ZodError;
}

const ZodError: React.FC<ZodErrorProps> = ({error}) => {
  const intl = useIntl();
  return (
    <div
      title={intl.formatMessage({
        description: 'Error boundary title',
        defaultMessage: 'Oops!',
      })}
    >
      <div className="alert alert-danger">
        <FormattedMessage
          description="Zod error message"
          defaultMessage="Something is wrong with the component configuration!"
        />
      </div>

      <ZodErrorDetails error={error} />
    </div>
  );
};

interface ZodErrorDetailsProps {
  error: z.ZodError;
}

const ZodErrorDetails: React.FC<ZodErrorDetailsProps> = ({error}) => {
  return (
    <ul>
      {error.issues.map(zodError => (
        <li>
          {zodError.path?.length > 0 && (<b>{zodError.path.join(' ')}:</b>)}
          {zodError.message}
          {'unionErrors' in zodError && zodError.unionErrors.map(unionError => <ZodErrorDetails error={unionError} />)}
        </li>
      ))}
    </ul>
  )
}

export default ZodError;
