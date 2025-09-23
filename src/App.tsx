import React from 'react';
import { QuoteForm } from './components/QuoteForm';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <>
      <ThemeToggle />
      <QuoteForm />
    </>
  );
}

export default App;