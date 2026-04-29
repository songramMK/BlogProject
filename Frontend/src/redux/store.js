import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './feature/user/userSlice'
// import themeReducer from "./theme/themeSlice";
import { persistReducer, persistStore } from "redux-persist"; // localstorage এ save রাখার জন্য data 

import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({ // সব reducer কে combine করে রেখে দিব যা redux-react থেকে আসবে. 
  user:userReducer,
  // theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage, // এই storage আসতেছে এইখানে থেকে --> import storage from "redux-persist/lib/storage";
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
