import { Routes, Route } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { PeoplePage } from "@/pages/PeoplePage";
import { NewPersonPage } from "@/pages/NewPersonPage";
import { PersonDetailPage } from "@/pages/PersonDetailPage";
import { MemoriesPage } from "@/pages/MemoriesPage";
import { WingmanHistoryPage } from "@/pages/WingmanHistoryPage";
import { NewWingmanRunPage } from "@/pages/NewWingmanRunPage";
import { WingmanRunDetailPage } from "@/pages/WingmanRunDetailPage";
import { SettingsPage } from "@/pages/SettingsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/people" element={<PeoplePage />} />
      <Route path="/people/new" element={<NewPersonPage />} />
      <Route path="/people/:id" element={<PersonDetailPage />} />
      <Route path="/people/:id/memories" element={<MemoriesPage />} />
      <Route path="/wingman" element={<WingmanHistoryPage />} />
      <Route path="/wingman/new" element={<NewWingmanRunPage />} />
      <Route path="/wingman/:id" element={<WingmanRunDetailPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
