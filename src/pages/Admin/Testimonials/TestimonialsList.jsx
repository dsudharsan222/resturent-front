import React, { useState, useEffect } from 'react';
import { getAllTestimonialsAdmin, approveTestimonial, deleteTestimonial } from '../../../services/adminApi';
import { Check, X, Trash2, Star, MessageSquare, ShieldCheck, AlertCircle } from 'lucide-react';
import styles from './TestimonialsList.module.scss';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const TestimonialsList = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllTestimonialsAdmin();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      toast.error('Failed to load testimonials');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id) => {
    try {
      await approveTestimonial(id);
      toast.success('Testimonial status updated.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to update review status');
    }
  };

  const handleDelete = async (id, author) => {
    if (window.confirm(`Are you sure you want to permanently delete the review from "${author}"?`)) {
      try {
        await deleteTestimonial(id);
        toast.success('Testimonial deleted.');
        fetchData();
      } catch (err) {
        toast.error(err.message || 'Failed to delete review');
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Reviews & Testimonials Moderation</h2>
          <p>Review customer feedback, approve positive stories for the home page, and remove spam.</p>
        </div>
        <span className={styles.countBadge}>
          {testimonials.length} Reviews Total
        </span>
      </div>

      {loading ? (
        <div className={styles.skeletonTable}>
          {[1, 2, 3].map(n => (
            <div key={n} className="skeleton" style={{ height: '70px', borderRadius: '8px', marginBottom: '0.5rem' }}></div>
          ))}
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Author & Rating</th>
                <th>Feedback Message</th>
                <th>Submission Date</th>
                <th>Live Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((test) => (
                <tr key={test.id}>
                  <td>
                    <div className={styles.authorCell}>
                      <strong>{test.author}</strong>
                      <div className={styles.stars}>
                        {[...Array(test.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className={styles.reviewText}>"{test.text}"</p>
                  </td>
                  <td>
                    <span className={styles.dateText}>
                      {test.created_at ? new Date(test.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </td>
                  <td>
                    <span className={clsx(styles.badge, test.is_approved ? styles.approved : styles.pending)}>
                      {test.is_approved ? '✓ Live on Site' : '⏳ Pending Review'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      {test.is_approved ? (
                        <button 
                          className={styles.rejectBtn} 
                          onClick={() => handleToggleApproval(test.id)}
                          title="Hide from public site"
                        >
                          <X size={15} /> Hide
                        </button>
                      ) : (
                        <button 
                          className={styles.approveBtn} 
                          onClick={() => handleToggleApproval(test.id)}
                          title="Approve for public showcase"
                        >
                          <Check size={15} /> Approve
                        </button>
                      )}
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(test.id, test.author)} 
                        title="Delete permanently"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {testimonials.length === 0 && (
                <tr>
                  <td colSpan="5" className={styles.emptyTd}>No testimonials found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;
