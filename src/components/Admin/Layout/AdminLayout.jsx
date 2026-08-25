import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LogOut, LayoutDashboard, Settings, List, Menu as MenuIcon, Truck, MessageSquare, Briefcase, FileText } from 'lucide-react';
import styles from './AdminLayout.module.scss';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
    { to: '/admin/categories', icon: <List size={20} />, label: 'Categories' },
    { to: '/admin/menu-items', icon: <MenuIcon size={20} />, label: 'Menu Items' },
    { to: '/admin/services', icon: <Truck size={20} />, label: 'Services' },
    { to: '/admin/testimonials', icon: <MessageSquare size={20} />, label: 'Testimonials' },
    { to: '/admin/quote-configs', icon: <Briefcase size={20} />, label: 'Quote Configs' },
    { to: '/admin/leads', icon: <FileText size={20} />, label: 'Leads' },
  ];

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>SV Admin</h2>
        </div>
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? `${styles.navItem} ${styles.active}` : styles.navItem)}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Admin Panel</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </header>
        
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
