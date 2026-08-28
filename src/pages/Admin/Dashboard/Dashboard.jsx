import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getMenuItems, 
  getCategories, 
  getCateringServices 
} from '../../../services/api';
import { 
  getAllQuotes, 
  getAllTestimonialsAdmin 
} from '../../../services/adminApi';
import { 
  UtensilsCrossed, 
  List, 
  Truck, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const [stats, setStats] = useState({
    menuCount: 0,
    categoriesCount: 0,
    servicesCount: 0,
    leadsCount: 0,
    pendingLeadsCount: 0,
    testimonialsCount: 0,
    pendingTestimonialsCount: 0,
    recentLeads: [],
    featuredItems: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [menuRes, catRes, srvRes, quotesRes, testRes] = await Promise.allSettled([
          getMenuItems(),
          getCategories(),
          getCateringServices(),
          getAllQuotes(),
          getAllTestimonialsAdmin()
        ]);

        const menuItems = menuRes.status === 'fulfilled' && Array.isArray(menuRes.value) ? menuRes.value : [];
        const categories = catRes.status === 'fulfilled' && Array.isArray(catRes.value) ? catRes.value : [];
        const services = srvRes.status === 'fulfilled' && Array.isArray(srvRes.value) ? srvRes.value : [];
        const quotes = quotesRes.status === 'fulfilled' && Array.isArray(quotesRes.value) ? quotesRes.value : [];
        const testimonials = testRes.status === 'fulfilled' && Array.isArray(testRes.value) ? testRes.value : [];

        const pendingQuotes = quotes.filter(q => !q.status || q.status === 'pending' || q.status === 'new');
        const pendingTest = testimonials.filter(t => !t.is_approved);
        const featured = menuItems.filter(m => m.is_featured || m.isFeatured);

        setStats({
          menuCount: menuItems.length,
          categoriesCount: categories.length,
          servicesCount: services.length,
          leadsCount: quotes.length,
          pendingLeadsCount: pendingQuotes.length,
          testimonialsCount: testimonials.length,
          pendingTestimonialsCount: pendingTest.length,
          recentLeads: quotes.slice(0, 5),
          featuredItems: featured.slice(0, 4)
        });
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.statsGrid}>
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="skeleton" style={{ height: '110px', borderRadius: '12px' }}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <div className={styles.welcomeBanner}>
        <div>
          <h2>Operations Executive Overview</h2>
          <p>Real-time statistics across menu items, customer event inquiries, and public ratings.</p>
        </div>
        <div className={styles.bannerActions}>
          <Link to="/admin/leads">
            <Button variant="gold" size="medium">
              <FileText size={16} /> Manage Leads ({stats.pendingLeadsCount} New)
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className={styles.statsGrid}>
        <Link to="/admin/leads" className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <FileText size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Catering Leads</span>
            <div className={styles.statNumberRow}>
              <span className={styles.statValue}>{stats.leadsCount}</span>
              {stats.pendingLeadsCount > 0 && (
                <span className={styles.statBadgePending}>{stats.pendingLeadsCount} Pending</span>
              )}
            </div>
          </div>
        </Link>

        <Link to="/admin/menu-items" className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#FEF3C7', color: '#D97706' }}>
            <UtensilsCrossed size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Menu Items</span>
            <div className={styles.statNumberRow}>
              <span className={styles.statValue}>{stats.menuCount}</span>
              <span className={styles.statSub}>Across {stats.categoriesCount} Categories</span>
            </div>
          </div>
        </Link>

        <Link to="/admin/services" className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#DCFCE7', color: '#16A34A' }}>
            <Truck size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Catering Packages</span>
            <div className={styles.statNumberRow}>
              <span className={styles.statValue}>{stats.servicesCount}</span>
              <span className={styles.statSub}>Active Packages</span>
            </div>
          </div>
        </Link>

        <Link to="/admin/testimonials" className={styles.statCard}>
          <div className={styles.statIconWrap} style={{ background: '#DBEAFE', color: '#2563EB' }}>
            <MessageSquare size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Reviews & Testimonials</span>
            <div className={styles.statNumberRow}>
              <span className={styles.statValue}>{stats.testimonialsCount}</span>
              {stats.pendingTestimonialsCount > 0 ? (
                <span className={styles.statBadgePending}>{stats.pendingTestimonialsCount} To Review</span>
              ) : (
                <span className={styles.statSub}>All Moderated</span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Main Grid: Recent Leads & Quick Actions */}
      <div className={styles.dashboardGrid}>
        {/* Recent Event Leads */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h3>Recent Event Inquiries</h3>
              <p>Latest quote requests submitted by customers</p>
            </div>
            <Link to="/admin/leads" className={styles.cardHeaderLink}>
              View All ({stats.leadsCount}) →
            </Link>
          </div>

          <div className={styles.leadsList}>
            {stats.recentLeads.length > 0 ? (
              stats.recentLeads.map((lead) => (
                <div key={lead.id} className={styles.leadRow}>
                  <div className={styles.leadInfo}>
                    <h4>{lead.customer_name}</h4>
                    <div className={styles.leadMeta}>
                      <span>📞 {lead.customer_phone}</span>
                      <span>🎉 {lead.event_type_id || 'Event'}</span>
                      {lead.event_date && (
                        <span>📅 {new Date(lead.event_date).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.leadStatus}>
                    <span className={styles.statusBadge}>
                      {lead.status || 'Pending Review'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>No quote inquiries received yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Operations & Highlights */}
        <div className={styles.sideCol}>
          {/* Quick Actions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Quick Operations</h3>
            </div>
            <div className={styles.quickActionsList}>
              <Link to="/admin/menu-items" className={styles.actionBtn}>
                <Plus size={16} /> Add New Menu Item
              </Link>
              <Link to="/admin/categories" className={styles.actionBtn}>
                <Plus size={16} /> Create Food Category
              </Link>
              <Link to="/admin/services" className={styles.actionBtn}>
                <Plus size={16} /> Manage Catering Packages
              </Link>
              <Link to="/admin/settings" className={styles.actionBtn}>
                <ExternalLink size={16} /> Update Hours & Phone Numbers
              </Link>
            </div>
          </div>

          {/* Featured Menu Preview */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Featured Dishes</h3>
              <Link to="/admin/menu-items" className={styles.cardHeaderLink}>
                Manage
              </Link>
            </div>
            <div className={styles.featuredList}>
              {stats.featuredItems.map((item) => (
                <div key={item.id} className={styles.featuredRow}>
                  <span>{item.name}</span>
                  <strong>₹{parseFloat(item.price || 0).toFixed(0)}</strong>
                </div>
              ))}
              {stats.featuredItems.length === 0 && (
                <p className={styles.emptyText}>No items marked as featured yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
