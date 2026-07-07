import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";

import { HomePage } from "@/pages/landing/HomePage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";

import { OverviewPage } from "@/pages/dashboard/OverviewPage";
import { SettingsPage } from "@/pages/dashboard/SettingsPage";
import { ProfilePage } from "@/pages/dashboard/ProfilePage";
import { AssistantPage } from "@/pages/dashboard/AssistantPage";
import { CatalogListPage } from "@/pages/catalog/CatalogListPage";

import { NotFoundPage } from "@/pages/misc/NotFoundPage";

// Three.js (via ArraySceneViewer) solo se descarga cuando se visita Simulación.
const SimulationPage = lazy(() =>
  import("@/pages/dashboard/SimulationPage").then((module) => ({ default: module.SimulationPage }))
);

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

      {/*
        Sin muro de login: /app es de acceso libre, no requiere autenticación.
        ProtectedRoute (src/routes/ProtectedRoute.tsx) queda listo para cuando
        exista backend real y se quiera exigir sesión.
      */}
      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<OverviewPage />} />
        <Route
          path="simulacion"
          element={
            <Suspense fallback={<div className="p-8 text-sm text-slate-400">Cargando simulación…</div>}>
              <SimulationPage />
            </Suspense>
          }
        />
        <Route path="asistente" element={<AssistantPage />} />
        <Route path="catalog" element={<CatalogListPage />} />
        <Route path="catalog/:category" element={<CatalogListPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
