import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { EquipmentPage } from './pages/public/EquipmentPage';
import { EventsPage } from './pages/public/EventsPage';
import { DistributionPage } from './pages/public/DistributionPage';
import { NewsPage } from './pages/public/NewsPage';
import { EnquiryPage } from './pages/public/EnquiryPage';
import { CapabilitiesPage } from './pages/public/CapabilitiesPage';
import { AboutPage } from './pages/public/AboutPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { ChangePasswordPage } from './pages/admin/ChangePasswordPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { ActivityLogsPage } from './pages/admin/ActivityLogsPage';
import { WorkAdminPage } from './pages/admin/WorkAdminPage';
import { HeroAdminPage } from './pages/admin/HeroAdminPage';
import { TeamAdminPage } from './pages/admin/TeamAdminPage';
import { PartnersAdminPage } from './pages/admin/PartnersAdminPage';
import { MarketingAdminPage } from './pages/admin/MarketingAdminPage';
import { HomeContentAdminPage } from './pages/admin/HomeContentAdminPage';
import { BrandSettingsAdminPage } from './pages/admin/BrandSettingsAdminPage';
import { SEOSettingsAdminPage } from './pages/admin/SEOSettingsAdminPage';
import { EquipmentAdminPage } from './pages/admin/EquipmentAdminPage';
import { EventsAdminPage } from './pages/admin/EventsAdminPage';
import { DistributionAdminPage } from './pages/admin/DistributionAdminPage';
import { NewsAdminPage } from './pages/admin/NewsAdminPage';
import { EnquiriesAdminPage } from './pages/admin/EnquiriesAdminPage';
import { SettingsAdminPage } from './pages/admin/SettingsAdminPage';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/capabilities" element={<CapabilitiesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/distribution" element={<DistributionPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/enquiry" element={<EnquiryPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/change-password" element={<ChangePasswordPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          <Route path="/admin/activity-logs" element={<ActivityLogsPage />} />
          <Route path="/admin/hero" element={<HeroAdminPage />} />
          <Route path="/admin/projects" element={<WorkAdminPage />} />
          <Route path="/admin/work" element={<WorkAdminPage />} />
          <Route path="/admin/equipment" element={<EquipmentAdminPage />} />
          <Route path="/admin/events" element={<EventsAdminPage />} />
          <Route path="/admin/team" element={<TeamAdminPage />} />
          <Route path="/admin/partners" element={<PartnersAdminPage />} />
          <Route path="/admin/marketing" element={<MarketingAdminPage />} />
          <Route path="/admin/distribution" element={<DistributionAdminPage />} />
          <Route path="/admin/news" element={<NewsAdminPage />} />
          <Route path="/admin/content/home" element={<HomeContentAdminPage />} />
          <Route path="/admin/settings/brand" element={<BrandSettingsAdminPage />} />
          <Route path="/admin/settings/seo" element={<SEOSettingsAdminPage />} />
          <Route path="/admin/media" element={<MediaLibraryPage />} />
          <Route path="/admin/enquiries" element={<EnquiriesAdminPage />} />
          <Route path="/admin/settings" element={<SettingsAdminPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
