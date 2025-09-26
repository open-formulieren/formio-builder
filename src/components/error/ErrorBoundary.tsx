import React from 'react';

import {z} from 'zod';

import GenericError from './GenericError';
import ZodError from './ZodError';
import type {AnyError} from './errorTypes';

const logError = (error: AnyError, errorInfo: React.ErrorInfo) => {
  console.error(error, errorInfo);
};

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKeys?: any[]; // optional dependency list
}

interface StateWithoutError {
  hasError: false;
  error: null;
}

interface StateWithError {
  hasError: true;
  error: AnyError;
}

type ErrorBoundaryState = StateWithError | StateWithoutError;

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {hasError: false, error: null};
  }

  static getDerivedStateFromError(error: AnyError): StateWithError {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: AnyError, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.resetKeys && prevProps.resetKeys !== this.props.resetKeys) {
      // Reset the error state
      this.setState({hasError: false, error: null});
    }
  }

  render(): React.ReactNode {
    const {children} = this.props;
    const {hasError, error} = this.state;
    if (!hasError) {
      return children;
    }

    if (error instanceof z.ZodError) {
      return <ZodError error={error} />;
    }
    return <GenericError error={error} />;
  }
}
