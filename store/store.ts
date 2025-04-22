// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import classroomReducer from "./slices/classroomSlice";
import quizReducer from "./slices/quizSlice";
import { injectStore } from "@/lib/api/axios"; // ⬅️ import this

export function makeStore() {
  const newStore = configureStore({
    reducer: {
      auth: authReducer,
      classroom: classroomReducer,
      quiz: quizReducer
    },
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["auth/register/rejected", "auth/login/rejected"],
          ignoredPaths: ["auth.error"],
        },
      }),
  });

  injectStore(newStore); // ⬅️ inject here after creation

  return newStore;
}

export const store = makeStore();

// types
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
