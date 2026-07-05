import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import { HomePage } from "@/pages/landing/HomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";

import { OverviewPage } from "@/pages/dashboard/OverviewPage";
import { ProjectsListPage } from "@/pages/dashboard/ProjectsListPage";
import { ProjectDetailPage } from "@/pages/dashboard/ProjectDetailPage";
import { ClientsPage } from "@/pages/dashboard/ClientsPage";
import { QuotesPage } from "@/pages/dashboard/QuotesPage";
import { ReportsPage } from "@/pages/dashboard/ReportsPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { AdminPage } from "@/pages/dashboard/AdminPage";
import { ProfilePage } from "@/pages/dashboard/ProfilePage";
import { CatalogListPage } from "@/pages/catalog/CatalogListPage";

import { NotFoundPage } from "@/pages/misc/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="quotes" element={<QuotesPage />} />
        <Route path="catalog" element={<CatalogListPage />} />
        <Route path="catalog/:category" element={<CatalogListPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
