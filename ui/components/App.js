import $ from 'jquery';
import React, { Component } from 'react';

import Header from './Header';
import Home from './Home';
import Footer from './Footer';

class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className="ui stackable grid">
        <div className="two wide column"></div>
        <div className="twelve wide column">
          <Header />
          {this.props.children || <Home />}
          <Footer />
        </div>
        </div>
    );
  }
}

export default App;