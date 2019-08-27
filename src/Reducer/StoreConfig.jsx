import { applyMiddleware, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { rootReducer } from "./RootReducer";
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
const logger = createLogger({});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const history = createBrowserHistory();

export const store = createStore(
  rootReducer(history),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
    ),
    applyMiddleware(thunk),
    applyMiddleware(logger)
  )
);
