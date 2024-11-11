import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import bookReducer from './slices/bookSlice';
import statReducer from './slices/statSlice';
import authorReducer from './slices/authorSlice';
import { RESET_STATE } from './actions/types'; // Import your RESET_STATE action type

// Combine all reducers
const appReducer = combineReducers({
  user: userReducer,
  book: bookReducer,
  stat: statReducer,
  author: authorReducer,
});

// Root reducer to handle RESET_STATE action
const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STATE) {
    // Reset the state by returning undefined, which will reset state to initial values
    storage.removeItem('persist:root'); // Optional: clear persisted state
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export default store;
