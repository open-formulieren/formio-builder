import React from 'react';

import GenericError from '@/components/error/GenericError';

const logError = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error(error, errorInfo);
};

export interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface StateWithoutError {
  hasError: false;
  error: null;
}

interface StateWithError {
  hasError: true;
  error: Error;
}

type ErrorBoundaryState = StateWithError | StateWithoutError;

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: Error): StateWithError {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo);
  }

  render(): React.ReactNode {
    const {children} = this.props;
    const {hasError, error} = this.state;
    if (!hasError) {
      return children;
    }

    return <GenericError error={error} />;
  }
}
