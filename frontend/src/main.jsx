import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";

import { ClerkProvider, useAuth } from "@clerk/clerk-react";

import { BrowserRouter } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { setClerkGetToken } from "./lib/axios";

// --------------------------------------------------
// Clerk Publishable Key
// --------------------------------------------------
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// --------------------------------------------------
// React Query
// --------------------------------------------------
const queryClient = new QueryClient();

// --------------------------------------------------
// Connect Clerk authentication to Axios
// --------------------------------------------------
function AuthSetup() {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkGetToken(getToken);
  }, [getToken]);

  return null;
}

// --------------------------------------------------
// Application
// --------------------------------------------------
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AuthSetup />

          <div data-theme="intelliview">
            <App />
          </div>
        </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
