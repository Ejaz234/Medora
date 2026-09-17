import { Navigate, Route, Routes } from "react-router-dom";
import { Show } from "@clerk/react";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Show
      when="signed-in"
      fallback={<Navigate to="/sign-in" replace />}
    >
      {children}
    </Show>
  );
}

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      <Route path="/sign-in/*" element={<SignIn />} />

      <Route path="/sign-up/*" element={<SignUp />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      {/* Unknown route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;
