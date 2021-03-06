/* global __TARGET__ */

import { I18n } from 'cozy-ui/react'
import MuiCozyTheme from 'cozy-ui/react/MuiCozyTheme'
import React from 'react'
import { CozyProvider } from 'cozy-client'
import { Provider } from 'react-redux'

const AppContainer = ({ store, lang, history, client }) => {
  const AppRoute = require('components/AppRoute').default
  const Router =
    __TARGET__ === 'mobile'
      ? require('ducks/mobile/MobileRouter').default
      : require('react-router').Router
  return (
    <Provider store={store}>
      <CozyProvider client={client}>
        <I18n lang={lang} dictRequire={lang => require(`locales/${lang}`)}>
          <MuiCozyTheme>
            <Router history={history} routes={AppRoute} />
          </MuiCozyTheme>
        </I18n>
      </CozyProvider>
    </Provider>
  )
}

export default AppContainer
