import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

// Route Page
import CreateForm from './pages/CreateForm'
import ListForm from './pages/ListForm'

import './sass/main.scss';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <HashRouter basename="/form/">
          <div className="App">
            <Route exact path="/" component={ListForm} />
            <Route exact path="/new/" component={CreateForm} />
            <Route exact path="/edit/:id" component={CreateForm} />
          </div>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
