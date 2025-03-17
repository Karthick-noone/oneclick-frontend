// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CartProvider } from "./components/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <App />
    </CartProvider>
  </QueryClientProvider>,
  document.getElementById("root")
);
