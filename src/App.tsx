import { Routes, Route } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "./pages/auth/Login/Login";
import { RegisterPage } from "./pages/auth/Register/Register";
import { ResetPassword } from "./pages/auth/ResetPassword/ResetPassword";
import { LogoutPage } from "./pages/auth/Logout/Logout";
import { NotFoundPage } from "./pages/404/NotFound";
import { SettingsPage } from "./pages/settings/Settings";
import { ThemeProvider } from "@/components/theme/themeProvider";
import ContactPage from "./pages/contact/Contact";
import { DashboardPage } from "./pages/dashboard/Dashboard";
import { ListPage } from "./pages/lists/Lists";
import { Overview } from "./pages/dashboard/Overview";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Overview />} />

          <Route path="/contacts" element={<ContactPage />} />

          <Route path="/lists" element={<ListPage />} />

          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/logout" element={<LogoutPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />

          <Route path="/settings" element={<SettingsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
