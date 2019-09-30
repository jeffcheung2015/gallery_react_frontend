import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { loadReCaptcha } from 'react-recaptcha-google'
// Environment Components
import { store, history } from 'Reducer/StoreConfig';
import Layout from 'Components/Layout';
import { SnackbarProvider } from 'notistack';

class App extends React.Component {

  componentDidMount() {
    loadReCaptcha();
  }
  render() {
    return (
      <Provider store={store}>
        <SnackbarProvider
          maxSnack={5}
          preventDuplicate
          autoHideDuration={2000}
          anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
          <div className="App">
            <ConnectedRouter history={history}>
              <Layout/>
            </ConnectedRouter>
          </div>
        </SnackbarProvider>
      </Provider>
    );
  }
}

export default App;
