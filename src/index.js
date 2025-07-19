// // src/index.js
// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import { CartProvider } from "./components/CartContext";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// // Create a QueryClient instance
// const queryClient = new QueryClient();

// ReactDOM.render(
//   <QueryClientProvider client={queryClient}>
//     <CartProvider>
//       <App />
//     </CartProvider>
//   </QueryClientProvider>,
//   document.getElementById("root")
// );



/* new method to encrypt local storage details */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CartProvider } from "./components/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CryptoJS from "crypto-js"; //  Import CryptoJS

if (process.env.NODE_ENV === "production") {
  console.log = function () { };   // Disable logs
  console.warn = function () { };  // Disable warnings
  console.error = function () { }; // Disable errors
  console.info = () => { };
  console.debug = () => { };

  // Prevent runtime errors from showing in devtools
  window.onerror = () => true;
  window.onunhandledrejection = () => true;
}

// Create a QueryClient instance
const queryClient = new QueryClient();
// Backup original localStorage methods
const originalSetItem = localStorage.setItem;
const originalGetItem = localStorage.getItem;
const originalRemoveItem = localStorage.removeItem;

// Global Secret Key
const SECRET_KEY = process.env.REACT_APP_SECRET_KEY || "qwertyuiop"; // fallback if .env not loaded

// Override setItem  Encrypt values before storing
localStorage.setItem = (key, value) => {
  try {
    const stringValue = JSON.stringify(value); // Always stringify
    const encrypted = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
    originalSetItem.call(localStorage, key, encrypted);
  } catch (err) {
    console.error(`[localStorage.setItem] Encryption failed for key "${key}":`, err);
  }
};

// Override getItem  Decrypt if encrypted, fallback to plain text
localStorage.getItem = (key) => {
  const storedValue = originalGetItem.call(localStorage, key);
  if (!storedValue) return null;

  try {
    // Try decrypting (assume it's encrypted)
    const bytes = CryptoJS.AES.decrypt(storedValue, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (decrypted) {
      return JSON.parse(decrypted);
    }
    throw new Error("Decryption returned empty string");
  } catch (decryptErr) {
    // Fallback: assume plain text
    try {
      return JSON.parse(storedValue);
    } catch (parseErr) {
      console.warn(`[localStorage.getItem] Failed to decrypt/parse "${key}". Returning raw value.`);
      return storedValue; // fallback to raw string
    }
  }
};

// Override removeItem  No changes needed
localStorage.removeItem = (key) => {
  originalRemoveItem.call(localStorage, key);
};


//  Render App
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <App />
    </CartProvider>
  </QueryClientProvider>,
  document.getElementById("root")
);
