import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import useSettingsStore from './store/useSettingsStore';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Contact from './pages/Contact';
import Catering from './pages/Catering';
import CateringServiceDetail from './pages/CateringServiceDetail';
import QuoteLayout from './components/Quote/QuoteLayout';
import { 
  StepEventType, 
  StepGuests, 
  StepPreference, 
  StepContact, 
  QuoteSuccess 
} from './components/Quote/QuoteSteps';

// Admin imports
import AdminAuthMiddleware from './components/Admin/AdminAuthMiddleware';
import AdminLayout from './components/Admin/Layout/AdminLayout';
import Login from './pages/Admin/Login';
import MenuItemsList from './pages/Admin/MenuItems/MenuItemsList';
import Settings from './pages/Admin/Settings/Settings';
import CategoriesList from './pages/Admin/Categories/CategoriesList';
import TestimonialsList from './pages/Admin/Testimonials/TestimonialsList';
import QuoteConfigs from './pages/Admin/QuoteConfigs/QuoteConfigs';
import ServicesList from './pages/Admin/Services/ServicesList';
import ServiceDetail from './pages/Admin/Services/ServiceDetail';

function App() {
  const fetchSettings = useSettingsStore(state => state.fetchSettings);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminAuthMiddleware><AdminLayout /></AdminAuthMiddleware>}>
            <Route index element={<Navigate to="menu-items" replace />} />
            <Route path="menu-items" element={<MenuItemsList />} />
            <Route path="settings" element={<Settings />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="testimonials" element={<TestimonialsList />} />
            <Route path="quote-configs" element={<QuoteConfigs />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            {/* Remaining future routes */}
            <Route path="dashboard" element={<div>Dashboard Coming Soon</div>} />
            <Route path="leads" element={<div>Leads Coming Soon</div>} />
          </Route>

          {/* Customer Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            
            <Route path="catering" element={<Catering />} />
            <Route path="catering/:serviceId" element={<CateringServiceDetail />} />
            
            <Route path="catering/quote" element={<QuoteLayout />}>
              <Route index element={<StepEventType />} />
              <Route path="success" element={<QuoteSuccess />} />
              <Route path=":eventType" element={<StepGuests />} />
              <Route path=":eventType/:guests" element={<StepPreference />} />
              <Route path=":eventType/:guests/:preference/contact" element={<StepContact />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
