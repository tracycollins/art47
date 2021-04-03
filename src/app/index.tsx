/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUserSlice } from 'app/pages/UserPage/slice';

import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import { GlobalStyle } from 'styles/global-styles';

import { ArtworksPage } from './pages/ArtworksPage/Loadable';
import { ArtistsPage } from './pages/ArtistsPage/Loadable';
import { UserPage } from './pages/UserPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { Header } from './components/Header';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { useTranslation } from 'react-i18next';

export function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { actions } = useUserSlice();
  const { isLoading, user, isAuthenticated } = useAuth0();

  useEffect(() => {
    console.log(
      `app | auth0` +
        ` | isLoading: ${isLoading}` +
        ` | isAuthenticated: ${isAuthenticated}` +
        ` | USER: ${user ? user.sub : 'UNDEFINED'}`,
    );
    if (!isLoading) {
      if (isAuthenticated && user) {
        dispatch(actions.getUser(user));
      } else {
        dispatch(actions.setUser(user));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated]);

  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - art 47"
        defaultTitle="art 47"
        htmlAttributes={{ lang: i18n.language }}
      >
        <meta name="description" content="art recommendation app" />
      </Helmet>
      <Header />

      <Switch>
        <Route path="/artworks/:id" component={ArtworksPage} />
        <Route path="/artworks" component={ArtworksPage} />
        <Route path="/artists/:id" component={ArtistsPage} />
        <Route path="/artists" component={ArtistsPage} />
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
