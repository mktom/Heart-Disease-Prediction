import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './HomePage';
import DataDisplay from './DataDisplay';
import DataAnalysis from './DataAnalysis';
import DataPrediction from './DataPrediction';
import ErrorPage from './ErrorPage';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path='/' component={HomePage}/>
          <Route path='/display' component={DataDisplay}/>
          <Route path='/analysis' component={DataAnalysis}/>
          <Route path='/prediction' component={DataPrediction}/>
          <Route component={ErrorPage}/>
        </Switch>
      </div>
    );
  }
}

export default App;
