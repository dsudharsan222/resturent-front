import React, { useState, useEffect } from 'react';
import { getAllQuotes, updateQuoteStatus } from '../../../services/adminApi';
import { 
  FileText, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  MapPin, 
  X, 
  Eye, 
  MessageCircle, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import Button from '../../../components/UI/Button';
import styles from './LeadsList.module.scss';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending Review', color: 'badge-pending' },
  { value: 'contacted', label: 'Contacted Host', color: 'badge-contacted' },
  { value: 'confirmed', label: 'Menu Confirmed', color: 'badge-confirmed' },
  { value: 'completed', label: 'Event Completed', color: 'badge-completed' },
  { value: 'cancelled', label: 'Cancelled', color: 'badge-cancelled' },
];

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getAllQuotes();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      toast.error('Failed to load event leads.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await updateQuoteStatus(id, newStatus);
      toast.success('Lead status updated successfully.');
      
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error('Failed to update lead status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      (lead.customer_name && lead.customer_name.toLowerCase().includes(query)) ||
      (lead.customer_phone && lead.customer_phone.includes(query)) ||
      (lead.customer_email && lead.customer_email.toLowerCase().includes(query)) ||
      (lead.event_type_id && lead.event_type_id.toLowerCase().includes(query));

    const currentStatus = (lead.status || 'pending').toLowerCase();
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2>Event Leads & Catering Quotes</h2>
          <p>Review customer event inquiries, update pipeline status, and contact organizers.</p>
        </div>
        <span className={styles.leadCountBadge}>
          {leads.length} Total Inquiries
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search by customer name, phone, or event..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterPills}>
          <button 
            className={clsx(styles.filterPill, statusFilter === 'all' && styles.active)}
            onClick={() => setStatusFilter('all')}
          >
            All Leads ({leads.length})
          </button>
          <button 
            className={clsx(styles.filterPill, statusFilter === 'pending' && styles.active)}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={clsx(styles.filterPill, statusFilter === 'contacted' && styles.active)}
            onClick={() => setStatusFilter('contacted')}
          >
            Contacted
          </button>
          <button 
            className={clsx(styles.filterPill, statusFilter === 'confirmed' && styles.active)}
            onClick={() => setStatusFilter('confirmed')}
          >
            Confirmed
          </button>
        </div>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className={styles.skeletonTable}>
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="skeleton" style={{ height: '60px', borderRadius: '8px', marginBottom: '0.5rem' }}></div>
          ))}
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Event Occasion</th>
                <th>Headcount</th>
                <th>Food Preference</th>
                <th>Event Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const currentStatus = (lead.status || 'pending').toLowerCase();

                return (
                  <tr key={lead.id}>
                    <td>
                      <div className={styles.customerCell}>
                        <strong>{lead.customer_name || 'Guest Organizer'}</strong>
                        <span>📞 {lead.customer_phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.eventTag}>
                        {lead.event_type_id || 'Catering'}
                      </span>
                    </td>
                    <td>
                      <strong>{lead.guest_count_id || '50-100'}</strong> Guests
                    </td>
                    <td>
                      <span className={styles.prefBadge}>
                        {lead.food_preference_id || 'Both'}
                      </span>
                    </td>
                    <td>
                      {lead.event_date ? (
                        <span>📅 {new Date(lead.event_date).toLocaleDateString()}</span>
                      ) : (
                        <span className={styles.muted}>TBD</span>
                      )}
                    </td>
                    <td>
                      <select 
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        disabled={updatingId === lead.id}
                        className={clsx(styles.statusSelect, styles[`status_${currentStatus}`])}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button 
                          className={styles.viewBtn} 
                          onClick={() => setSelectedLead(lead)}
                          title="Inspect Lead Details"
                        >
                          <Eye size={16} /> Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="7" className={styles.emptyTd}>
                    No event leads match your current search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className={styles.modalOverlay} onClick={() => setSelectedLead(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3>Lead #{selectedLead.id} Details</h3>
                <span className={styles.createdDate}>
                  Submitted: {selectedLead.created_at ? new Date(selectedLead.created_at).toLocaleString() : 'Recent'}
                </span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedLead(null)}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              {/* Customer Contact Section */}
              <div className={styles.modalSection}>
                <h4>Customer Information</h4>
                <div className={styles.detailGrid}>
                  <div>
                    <label>Organizer Name</label>
                    <p>{selectedLead.customer_name}</p>
                  </div>
                  <div>
                    <label>Phone Number</label>
                    <p>
                      <a href={`tel:${selectedLead.customer_phone}`} className={styles.phoneLink}>
                        {selectedLead.customer_phone}
                      </a>
                    </p>
                  </div>
                  {selectedLead.customer_email && (
                    <div>
                      <label>Email Address</label>
                      <p>{selectedLead.customer_email}</p>
                    </div>
                  )}
                </div>

                <div className={styles.contactActions}>
                  <a 
                    href={`https://wa.me/${selectedLead.customer_phone.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <MessageCircle size={16} /> WhatsApp Message
                  </a>
                  <a 
                    href={`tel:${selectedLead.customer_phone}`} 
                    className={styles.callBtn}
                  >
                    <Phone size={16} /> Call Organizer
                  </a>
                </div>
              </div>

              {/* Event Logistics */}
              <div className={styles.modalSection}>
                <h4>Event Logistics</h4>
                <div className={styles.detailGrid}>
                  <div>
                    <label>Occasion Type</label>
                    <p className={styles.capitalize}>{selectedLead.event_type_id}</p>
                  </div>
                  <div>
                    <label>Expected Guests</label>
                    <p>{selectedLead.guest_count_id} Guests</p>
                  </div>
                  <div>
                    <label>Food Preference</label>
                    <p className={styles.capitalize}>{selectedLead.food_preference_id}</p>
                  </div>
                  <div>
                    <label>Event Date</label>
                    <p>{selectedLead.event_date ? new Date(selectedLead.event_date).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                </div>

                {selectedLead.venue && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <label>Event Venue / City</label>
                    <p>{selectedLead.venue}</p>
                  </div>
                )}
              </div>

              {/* Special Requirements */}
              {selectedLead.special_requirements && (
                <div className={styles.modalSection}>
                  <h4>Special Instructions / Notes</h4>
                  <p className={styles.notesBox}>{selectedLead.special_requirements}</p>
                </div>
              )}

              {/* Status Update */}
              <div className={styles.modalSection}>
                <h4>Update Lead Status</h4>
                <div className={styles.statusButtonGroup}>
                  {STATUS_OPTIONS.map(opt => (
                    <button 
                      key={opt.value}
                      className={clsx(
                        styles.statusBtn, 
                        (selectedLead.status || 'pending').toLowerCase() === opt.value && styles.active
                      )}
                      onClick={() => handleStatusChange(selectedLead.id, opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <Button variant="outline" onClick={() => setSelectedLead(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
