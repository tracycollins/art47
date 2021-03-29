/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { ArtworksPage } from './pages/ArtworksPage/Loadable';
import { UserPage } from './pages/UserPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';

export function App({ history }) {
  const { i18n } = useTranslation();
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - art 47"
        defaultTitle="art 47"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="art recommendation app" />
      </Helmet>
      <Header history={history} />

      <Switch>
        <Route path="/artworks/:id" component={ArtworksPage} />
        <Route path="/artworks" component={ArtworksPage} />
        <Route path="/authorize" component={HomePage} />
        <Route path="/login/callback" component={HomePage} />
        <Route path="/login" component={HomePage} />
        <Route path="/profile" component={UserPage} />
        <Route path="/logout" />
        <Route path="/" component={HomePage} />
        <Route path="" component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
