import React from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "src/layouts/DashboardLayout/DashboardLayout";
import MainLayout from "src/layouts/MainLayout/MainLayout";
import AccountView from "src/views/account/AccountView/AccountView";
import StaffListView from "src/views/staff/StaffListView";
import NewStaffView from "src/views/staff/NewStaffView";
import EditStaffView from "src/views/staff/EditStaffView";
import DashboardView from "src/views/reports/DashboardView/DashboardView";
import LoginView from "src/views/auth/LoginView";
import NotFoundView from "src/views/errors/NotFoundView";
import ProductListView from "src/views/product/ProductListView/ProductListView";
import NewProjectView from "src/views/projects/NewProjectView";
import RegisterView from "src/views/auth/RegisterView";
import SettingsView from "src/views/settings/SettingsView/SettingsView";

const routes = [
  {
    path: "moped",
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <DashboardView /> },
      { path: "account", element: <AccountView /> },
      { path: "staff", element: <StaffListView /> },
      { path: "staff/new", element: <NewStaffView /> },
      { path: "staff/edit/:userId", element: <EditStaffView /> },
      { path: "dashboard", element: <DashboardView /> },
      { path: "projects", element: <ProductListView /> },
      { path: "projects/new", element: <NewProjectView /> },
      { path: "settings", element: <SettingsView /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "login", element: <LoginView /> },
      { path: "register", element: <RegisterView /> },
      { path: "404", element: <NotFoundView /> },
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "*", element: <Navigate to="/404" /> },
    ],
  },
];

export default routes;
