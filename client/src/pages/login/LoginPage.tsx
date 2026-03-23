import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Fingerprint, Landmark } from 'lucide-react';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className={styles.page}>
      {/* Left Panel — Branding & Visual */}
      <div className={`${styles.leftPanel} ${mounted ? styles.mounted : ''}`}>
        <div className={styles.decorStripe} />

        <div className={styles.leftContent}>
          <div className={styles.badge}>
            <Shield size={13} />
            <span>AUTHORIZED ACCESS ONLY</span>
          </div>

          <div className={styles.logoBlock}>
            <div className={styles.logoIcon}>
              <Landmark size={28} strokeWidth={1.5} />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoAccent}>ENUGU</span>
              <span className={styles.logoDivider} />
              <span className={styles.logoLabel}>MOT</span>
            </div>
          </div>

          <h1 className={styles.headline}>
            Driver Biometric
            <br />
            <span className={styles.headlineAccent}>Compliance &amp; Enforcement</span>
          </h1>

          <p className={styles.description}>
            Secure digital ticketing platform for the Ministry of Transportation,
            Enugu State Government.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>2M+</span>
              <span className={styles.statLabel}>Driver Records</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Field Agents</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statValue}>99.5%</span>
              <span className={styles.statLabel}>Uptime</span>
            </div>
          </div>
        </div>

        <div className={styles.leftFooter}>
          <img
            src="/images/enugu-coat-of-arms.png"
            alt="Government of Enugu State"
            className={styles.coatOfArms}
          />
          <p className={styles.ministryName}>Enugu State Ministry of Transportation</p>
          <div className={styles.securityIndicator}>
            <span className={styles.securityDot} />
            <span>TLS 1.3 Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className={`${styles.rightPanel} ${mounted ? styles.mounted : ''}`}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.formLogoMark}>
              <Fingerprint size={22} strokeWidth={1.5} />
            </div>
            <h2 className={styles.formTitle}>Sign in</h2>
            <p className={styles.formSubtitle}>
              Enter your credentials to access the enforcement dashboard
            </p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <div className={styles.errorIcon}>!</div>
              <span>{error}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="login-email">
                Email Address
              </label>
              <div
                className={`${styles.fieldWrapper} ${
                  focusedField === 'email' ? styles.fieldFocused : ''
                }`}
              >
                <Mail size={18} className={styles.fieldIcon} />
                <input
                  id="login-email"
                  type="email"
                  className={styles.fieldInput}
                  placeholder="you@mot.gov.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="login-password">
                Password
              </label>
              <div
                className={`${styles.fieldWrapper} ${
                  focusedField === 'password' ? styles.fieldFocused : ''
                }`}
              >
                <Lock size={18} className={styles.fieldIcon} />
                <input
                  id="login-password"
                  type="password"
                  className={styles.fieldInput}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className={styles.formFooter}>
            <p className={styles.footerText}>
              Enugu State Ministry of Transportation &copy; 2026
            </p>
            <p className={styles.footerSubtext}>
              Unauthorized access is prohibited and punishable by law
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
