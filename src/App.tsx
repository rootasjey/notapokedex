import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import Details from './components/Details';

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
