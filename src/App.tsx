import React from 'react';
import './styles/App.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/home';
import Details from './pages/details';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Route exact path='/' component={Home} />
        <Route path='/pokemon/:id' component={Details} />
      </div>
    </Router>
  )
}

export default App;
