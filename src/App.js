import React from 'react';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <div className="App">
        <Navigation />
      </div>
    </ErrorBoundary>
  );
}

export default App;
