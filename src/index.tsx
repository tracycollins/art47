/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import history from 'utils/history';
import { Auth0Provider } from '@auth0/auth0-react';

// Use consistent styling
import 'sanitize.css/sanitize.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { configureAppStore } from 'store/configureStore';

import reportWebVitals from 'reportWebVitals';

// Initialize languages
import './locales/i18n';

const store = configureAppStore();
const MOUNT_NODE = document.getElementById('root') as HTMLElement;

ReactDOM.render(
  <Provider store={store}>
    <HelmetProvider>
      <React.StrictMode>
        <Auth0Provider
          domain="wild-disk-7982.us.auth0.com"
          clientId="Utmgokd22lCluIMbM2WzmAVgyjCsHPxB"
          redirectUri={
            process.env.REACT_APP_AUTH0_REDIRECT_URI ||
            `http://localhost:3000/profile`
          }
        >
          <App />
        </Auth0Provider>
      </React.StrictMode>
    </HelmetProvider>
  </Provider>,
  MOUNT_NODE,
);

// Hot reloadable translation json files
if (module.hot) {
  module.hot.accept(['./locales/i18n'], () => {
    // No need to render the App again because i18next works with the hooks
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
