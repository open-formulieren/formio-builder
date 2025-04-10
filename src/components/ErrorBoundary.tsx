import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';

const logError = (error: any, errorInfo: any) => {
  console.error(error, errorInfo);
};

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: any, errorInfo: any) {
    logError(error, errorInfo);
  }

  render() {
    const {children} = this.props;
    const {hasError, error} = this.state;
    if (!hasError) {
      return children;
    }

    return <GenericError error={error} />;
  }
}

interface GenericErrorProps {
  error: any,
}

const GenericError = ({error}: GenericErrorProps) => {
  const intl = useIntl();
  // Wrapper may be a DOM element, which can't handle <FormattedMessage />
  const title = intl.formatMessage({
    description: 'Error boundary title',
    defaultMessage: 'Oops!',
  });
  return (
    <div title={title}>
      <div className="alert alert-danger">
        <FormattedMessage
          description="Generic error message"
          defaultMessage="Unfortunately something went wrong!"
        />
      </div>
      {error.detail}
    </div>
  );
};
