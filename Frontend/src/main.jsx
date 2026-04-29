import React from "react";
import ReactDOM from "react-dom/client";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { store, persistor } from "../src/redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  
    <PersistGate persistor={persistor}>
  <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>          
  </Provider>
  </PersistGate>
);
