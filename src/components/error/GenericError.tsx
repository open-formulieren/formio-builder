import {FormattedMessage, useIntl} from 'react-intl';

import ErrorDetail from './ErrorDetail';
import ErrorMessage from './ErrorMessage';
import type {AnyError} from './errorTypes';

export interface GenericErrorProps {
  error: AnyError;
}

const GenericError: React.FC<GenericErrorProps> = ({error}) => {
  const intl = useIntl();
  return (
    <div
      title={intl.formatMessage({
        description: 'Error boundary title',
        defaultMessage: 'Oops!',
      })}
    >
      <ErrorMessage>
        <FormattedMessage
          description="Generic error message"
          defaultMessage="Unfortunately something went wrong!"
        />
      </ErrorMessage>
      <ErrorDetail error={error} />
    </div>
  );
};

export default GenericError;
