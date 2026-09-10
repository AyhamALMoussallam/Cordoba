import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";
import { RatesAdminPage } from "./pages/RatesAdmin";
import { PrivacyPage } from "./pages/Privacy";
import { AccountAdminPage } from "./pages/AccountAdmin";
import { BranchesAdminPage } from "./pages/BranchesAdmin";
import { ContactAdminPage } from "./pages/ContactAdmin";
import { FaqAdminPage } from "./pages/FaqAdmin";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RatesAdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/account"
        element={
          <ProtectedRoute>
            <AccountAdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/branches"
        element={
          <ProtectedRoute>
            <BranchesAdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/contact"
        element={
          <ProtectedRoute>
            <ContactAdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faq"
        element={
          <ProtectedRoute>
            <FaqAdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
