import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { TrackerPage } from "../features/habits/pages/TrackerPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <TrackerPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
