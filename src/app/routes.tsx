import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { TasksPage } from "../features/tasks/TasksPage";

const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/tasks", element: <TasksPage /> },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
