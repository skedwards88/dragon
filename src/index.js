import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";

if ("serviceWorker" in navigator) {
  console.log('HOSTNAME')
  console.log(location.hostname)
  const path = (location.hostname === "localhost") ? "/service-worker.js" : "/dragon/service-worker.js";
  const scope = (location.hostname === "localhost") ? "" : '/dragon/';
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(path, {scope: scope})
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

ReactDOM.render(<App />, document.getElementById("root"));
