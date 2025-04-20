import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['auth/register/rejected', 'auth/login/rejected'],
          ignoredPaths: ['auth.error']
        }
      })
  });
}

export const store = makeStore();

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];