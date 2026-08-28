import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  LogOut, 
  LayoutDashboard, 
  Settings, 
  List, 
  UtensilsCrossed, 
  Truck, 
  MessageSquare, 
  Briefcase, 
  FileText, 
  Menu as MenuIcon, 
  X, 
  ExternalLink,
  ChefHat
} from 'lucide-react';
import styles from './AdminLayout.module.scss';
import clsx from 'clsx';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={19} />, label: 'Dashboard' },
    { to: '/admin/leads', icon: <FileText size={19} />, label: 'Leads & Quotes' },
    { to: '/admin/menu-items', icon: <UtensilsCrossed size={19} />, label: 'Menu Items' },
    { to: '/admin/categories', icon: <List size={19} />, label: 'Categories' },
    { to: '/admin/services', icon: <Truck size={19} />, label: 'Catering Services' },
    { to: '/admin/testimonials', icon: <MessageSquare size={19} />, label: 'Reviews & Feedback' },
    { to: '/admin/quote-configs', icon: <Briefcase size={19} />, label: 'Quote Master Data' },
    { to: '/admin/settings', icon: <Settings size={19} />, label: 'Global Settings' },
  ];

  return (
    <div className={styles.adminLayout}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={clsx(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}>
        <div className={styles.brandHeader}>
          <div className={styles.logoBadge}>
            <ChefHat size={20} />
          </div>
          <div className={styles.brandText}>
            <h2>SV Admin</h2>
            <span>Operations Portal</span>
          </div>
          <button className={styles.mobileCloseBtn} onClick={closeSidebar}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSectionLabel}>MANAGEMENT</div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeSidebar}
              className={({ isActive }) => clsx(styles.navItem, isActive && styles.active)}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              <span className={styles.navLabel}>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="/" target="_blank" rel="noreferrer" className={styles.viewSiteLink}>
            <ExternalLink size={16} />
            <span>View Public Site</span>
          </a>
          <button className={styles.sidebarLogoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button 
              className={styles.mobileMenuToggle} 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle menu"
            >
              <MenuIcon size={22} />
            </button>
            <div className={styles.headerTitle}>
              <h1>Restaurant Management</h1>
              <span>Control menu, catering packages, and event leads</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <Link to="/" className={styles.siteBtn} target="_blank">
              <ExternalLink size={15} /> View Site
            </Link>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>
        
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
