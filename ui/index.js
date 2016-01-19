import '../node_modules/animate.css/animate.min.css';
import '../node_modules/highlight.js/styles/github.css';
import '../node_modules/nprogress/nprogress.css';

import $ from 'jquery';
window.jQuery = $; // Assure it's available globally.
require('../public/components/semantic/dist/semantic.min.js');

import '../public/css/common.css';
import '../public/css/header.css';
import '../public/css/code.css';

import React, { Component } from 'react';
import reactDom from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { rootStore } from './store';

import routes from './routes/routes';

/*
var devDom = <Router routes={routes}></Router>
var prdDom = <Router history={history} routes={routes}></Router>

reactDom.render(
  <Provider store={rootStore}>
    {'production' === process.env.NODE_ENV ? prdDom : devDom}
  </Provider>,
  document.getElementById('blog')
);
*/

reactDom.render(
  <Provider store={rootStore}>
    <Router routes={routes}  history={browserHistory}></Router>
  </Provider>,
  document.getElementById('blog')
);