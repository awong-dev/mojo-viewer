import App from './components/App'
import React from 'react';
import ReactDOM from 'react-dom'

require("../sass/style.scss");

function initReact() {
  if (process.env.NODE_ENV === 'development') {
    const { AppContainer } = require('react-hot-loader');
    const render = Component => {
      ReactDOM.render((
        <AppContainer>
          <Component />
        </AppContainer>
      ), document.getElementById('root'));
    }

    render(App);

    // Hot Module Replacement API
    if (module.hot) {
      module.hot.accept('./components/App', () => {
        const NextApp = require('./components/App').default;
        render(NextApp);
      });
    }
  } else {
    ReactDOM.render((
      <App />
    ), document.getElementById('root'));
  }
}

function init() {
  initReact();
}

document.addEventListener('DOMContentLoaded', init);
