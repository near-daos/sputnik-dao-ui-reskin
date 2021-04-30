import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import { createEpicMiddleware, combineEpics, Epic } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { StoreState } from 'types/store';

import { auth, daos, proposals, redirect, createDao } from './reducers';
import { sputnikEpic } from './epics';

export const epicMiddleware = createEpicMiddleware();

export const epics = [sputnikEpic];

const rootReducer = combineReducers<StoreState>({
  auth,
  daos,
  proposals,
  redirect,
  createDao,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(epicMiddleware)),
);

const persist = persistStore(store);

const rootEpic: Epic<AnyAction, AnyAction> = combineEpics(...epics);

epicMiddleware.run(rootEpic);

export { store, persist };
