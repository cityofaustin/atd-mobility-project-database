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
import NewProjectView from "src/views/projects/NewProjectView";
import ProjectSummary from "src/views/projects/ProjectSummary";
import RegisterView from "src/views/auth/RegisterView";
import SettingsView from "src/views/settings/SettingsView/SettingsView";
import ProjectsListView from "./views/projects/ProjectsListView";

const routes = [
  { path: "/", element: <Navigate to="/moped" /> },
  {
    path: "moped/session",
    element: <MainLayout />,
    children: [
      { path: "signin", element: <LoginView /> },
      { path: "register", element: <RegisterView /> },
      { path: "*", element: <Navigate to="/signin" /> },
    ],
  },
  {
    path: "moped",
    element: <DashboardLayout />,
    children: [
      { path: "/", element: <DashboardView /> },
      { path: "dashboard", element: <DashboardView /> },
      { path: "account", element: <AccountView /> },
      { path: "staff", element: <StaffListView /> },
      { path: "staff/new", element: <NewStaffView /> },
      { path: "staff/edit/:userId", element: <EditStaffView /> },
      { path: "projects", element: <ProjectsListView /> },
      { path: "projects/new", element: <NewProjectView /> },
      { path: "projects/new/success", element: <ProjectSummary /> },
      { path: "settings", element: <SettingsView /> },
      { path: "404", element: <NotFoundView /> },
      { path: "*", element: <Navigate to="/moped/404" /> },
    ],
  },
];

export default routes;
