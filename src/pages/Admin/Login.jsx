import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../../components/UI/Button';
import styles from './Login.module.scss';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('admin@svcaterers.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (token || storedToken) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email.trim(), password);
      if (res && res.success) {
        toast.success('Signed in successfully!');
        navigate('/admin/dashboard', { replace: true });
      } else {
        throw new Error(res?.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
      toast.error(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        {/* Brand Header */}
        <div className={styles.brandHeader}>
          <div className={styles.logoBadge}>
            <ChefHat size={32} />
          </div>
          <h2>SV Caterers</h2>
          <span>Restaurant Staff & Operations Portal</span>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Admin Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@svcaterers.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Secure Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="large" 
            loading={loading}
            className={styles.submitBtn}
          >
            Access Admin Console <ArrowRight size={18} />
          </Button>
        </form>

        <div className={styles.footerLinks}>
          <Link to="/" className={styles.backLink}>
            ← Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
