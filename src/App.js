import React from 'react';
import './App.css';
import Home from './Home';
import Provider from './context/Provider';

function App() {
  return (
    <Provider>
      <Home />
    </Provider>
  );
}

export default App;
