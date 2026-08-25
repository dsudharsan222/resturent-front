import React, { useState, useEffect } from 'react';
import { getAllTestimonialsAdmin, approveTestimonial, deleteTestimonial } from '../../../services/adminApi';
import { Check, X, Trash2 } from 'lucide-react';
import styles from './TestimonialsList.module.scss';

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
      // Ensure data is an array
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id) => {
    try {
      await approveTestimonial(id);
      fetchData(); // Refresh list to reflect new status
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading testimonials...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Testimonials Management</h2>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Author</th>
              <th>Rating</th>
              <th>Review Text</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(test => (
              <tr key={test.id}>
                <td>{test.author}</td>
                <td>
                  <span className={styles.rating}>{'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)}</span>
                </td>
                <td className={styles.reviewText}>{test.text}</td>
                <td>
                  <span className={`${styles.badge} ${test.is_approved ? styles.approved : styles.pending}`}>
                    {test.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    {test.is_approved ? (
                      <button 
                        className={styles.rejectBtn} 
                        onClick={() => handleToggleApproval(test.id)}
                        title="Revoke Approval"
                      >
                        <X size={16} /> Hide
                      </button>
                    ) : (
                      <button 
                        className={styles.approveBtn} 
                        onClick={() => handleToggleApproval(test.id)}
                        title="Approve to show on site"
                      >
                        <Check size={16} /> Approve
                      </button>
                    )}
                    <button className={styles.deleteBtn} onClick={() => handleDelete(test.id)} title="Delete completely">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No testimonials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestimonialsList;
