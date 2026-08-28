import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/Layout/AdminLayout';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import useSettingsStore from './store/useSettingsStore';

// Lazy Loaded Customer Pages
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Catering = lazy(() => import('./pages/Catering'));
const CateringServiceDetail = lazy(() => import('./pages/CateringServiceDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// Lazy Loaded Catering Quote Flow
const QuoteLayout = lazy(() => import('./components/Quote/QuoteLayout'));
import { 
  StepEventType, 
  StepGuests, 
  StepPreference, 
  StepContact, 
  QuoteSuccess 
} from './components/Quote/QuoteSteps';

// Lazy Loaded Admin Pages
const Login = lazy(() => import('./pages/Admin/Login'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard/Dashboard'));
const LeadsList = lazy(() => import('./pages/Admin/Leads/LeadsList'));
const MenuItemsList = lazy(() => import('./pages/Admin/MenuItems/MenuItemsList'));
const CategoriesList = lazy(() => import('./pages/Admin/Categories/CategoriesList'));
const ServicesList = lazy(() => import('./pages/Admin/Services/ServicesList'));
const ServiceDetail = lazy(() => import('./pages/Admin/Services/ServiceDetail'));
const TestimonialsList = lazy(() => import('./pages/Admin/Testimonials/TestimonialsList'));
const QuoteConfigs = lazy(() => import('./pages/Admin/QuoteConfigs/QuoteConfigs'));
const Settings = lazy(() => import('./pages/Admin/Settings/Settings'));

// Loading Fallback Spinner
const PageLoader = () => (
  <div style={{
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    color: 'var(--color-primary)'
  }}>
    <div style={{
      width: '44px',
      height: '44px',
      border: '3px solid var(--color-border)',
      borderTopColor: 'var(--color-primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
      Loading delicious experience...
    </span>
  </div>
);

function App() {
  const { fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1c1f24',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Customer Facing Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="catering" element={<Catering />} />
            <Route path="catering/:serviceId" element={<CateringServiceDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />

            {/* Quote Stepper Flow */}
            <Route path="catering/quote" element={<QuoteLayout />}>
              <Route index element={<StepEventType />} />
              <Route path=":eventType" element={<StepGuests />} />
              <Route path=":eventType/:guests" element={<StepPreference />} />
              <Route path=":eventType/:guests/:preference/contact" element={<StepContact />} />
              <Route path="success" element={<QuoteSuccess />} />
            </Route>
          </Route>

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Console */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<LeadsList />} />
            <Route path="menu-items" element={<MenuItemsList />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="testimonials" element={<TestimonialsList />} />
            <Route path="quote-configs" element={<QuoteConfigs />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
