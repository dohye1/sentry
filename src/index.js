import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserTracing } from "@sentry/tracing";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://2ba54f691cec47eb90bba09fc768acea@o4504581152768000.ingest.sentry.io/4504586599727104",
  integrations: [new BrowserTracing()],
  tracesSampler: 1.0,
  release: process.env.REACT_APP_RELEASE_VERSION,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();
