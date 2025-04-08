import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // You could send the error to a logging service here
    this.logErrorToService(error, errorInfo);
  }
  
  logErrorToService(error, errorInfo) {
    // Implement your error logging logic here
    // This could be a call to Firebase Crashlytics, Sentry, LogRocket, etc.
    
    // Example with console for now
    console.group('Error logged to service');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
    
    // Don't log sensitive user data
    const sanitizedError = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // In a real app, you would send this to your error tracking service
    // Example: Sentry.captureException(error, { extra: sanitizedError });
  }
  
  handleResetError = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but an error occurred while rendering this component.</p>
            
            {this.props.showDetails && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <p>{this.state.error.toString()}</p>
                <p>Component Stack:</p>
                <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <div className="error-boundary-actions">
              <button 
                onClick={this.handleResetError}
                className="error-reset-button"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="error-refresh-button"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 