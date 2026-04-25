import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { AnalyticsPage } from "../features/analytics/pages/AnalyticsPage";
import { YearlyInsightsPage } from "../features/analytics/pages/YearlyInsightsPage";
import { TrackerPage } from "../features/habits/pages/TrackerPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <TrackerPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
      { path: "analytics/year", element: <YearlyInsightsPage /> },
      { path: "yearly-insights", element: <YearlyInsightsPage /> },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}
