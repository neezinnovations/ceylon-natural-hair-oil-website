import { Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AccountPage from "./pages/account/AccountPage";
import AccountDashboard from "./pages/account/AccountDashboard";
import AddressesPage from "./pages/account/AddressesPage";
import ProfilePage from "./pages/account/ProfilePage";
import OrdersPage from "./pages/account/OrdersPage";
import OrderDetailsPage from "./pages/account/OrderDetailsPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import AdminPage from "./pages/admin/AdminPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/AdminOrderDetailsPage";
import PaymentVerificationPage from "./pages/admin/PaymentVerificationPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

      <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>}>
        <Route index element={<AccountDashboard />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:orderId" element={<OrderDetailsPage />} />
        <Route path="addresses" element={<AddressesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:orderId" element={<AdminOrderDetailsPage />} />
        <Route path="payments" element={<PaymentVerificationPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
