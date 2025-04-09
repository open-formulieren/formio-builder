import {FormattedMessage, useIntl} from 'react-intl';

export interface GenericErrorProps {
  error: Error;
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
      <div className="alert alert-danger">
        <FormattedMessage
          description="Generic error message"
          defaultMessage="Unfortunately something went wrong!"
        />
      </div>
      <p>{error.message}</p>
    </div>
  );
};

export default GenericError;
