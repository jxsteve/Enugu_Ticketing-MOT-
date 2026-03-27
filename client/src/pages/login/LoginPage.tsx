import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, Fingerprint, Landmark, Eye, EyeOff } from 'lucide-react';
import styles from './LoginPage.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC = () => {
  const { login, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters.';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      // Focus the first errored field
      if (errors.email) {
        emailRef.current?.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!validateForm()) return;

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
        <div className={styles.decorStripe} aria-hidden="true" />

        <div className={styles.leftContent}>
          <div className={styles.badge}>
            <Shield size={13} />
            <span>AUTHORIZED ACCESS ONLY</span>
          </div>

          <div className={styles.logoBlock}>
            <div className={styles.logoIcon} aria-hidden="true">
              <Landmark size={28} strokeWidth={1.5} />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoAccent}>ENUGU</span>
              <span className={styles.logoDivider} aria-hidden="true" />
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

          <div className={styles.stats} aria-label="Platform statistics">
            <div className={styles.stat}>
              <span className={styles.statValue}>2M+</span>
              <span className={styles.statLabel}>Driver Records</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Field Agents</span>
            </div>
            <div className={styles.statDivider} aria-hidden="true" />
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
            <span className={styles.securityDot} aria-hidden="true" />
            <span>TLS 1.3 Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className={`${styles.rightPanel} ${mounted ? styles.mounted : ''}`}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.formLogoMark} aria-hidden="true">
              <Fingerprint size={22} strokeWidth={1.5} />
            </div>
            <h2 className={styles.formTitle}>Sign in</h2>
            <p className={styles.formSubtitle}>
              Enter your credentials to access the enforcement dashboard
            </p>
          </div>

          {error && (
            <div className={styles.errorBox} role="alert">
              <div className={styles.errorIcon} aria-hidden="true">!</div>
              <span>{error}</span>
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="login-email">
                Email Address
              </label>
              <div
                className={`${styles.fieldWrapper} ${
                  focusedField === 'email' ? styles.fieldFocused : ''
                } ${fieldErrors.email ? styles.fieldError : ''}`}
              >
                <Mail size={18} className={styles.fieldIcon} aria-hidden="true" />
                <input
                  ref={emailRef}
                  id="login-email"
                  type="email"
                  className={styles.fieldInput}
                  placeholder="you@mot.gov.ng"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  aria-invalid={fieldErrors.email ? 'true' : undefined}
                  aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  required
                />
              </div>
              {fieldErrors.email && (
                <span id="email-error" className={styles.fieldErrorText} role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="login-password">
                Password
              </label>
              <div
                className={`${styles.fieldWrapper} ${
                  focusedField === 'password' ? styles.fieldFocused : ''
                } ${fieldErrors.password ? styles.fieldError : ''}`}
              >
                <Lock size={18} className={styles.fieldIcon} aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={styles.fieldInput}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  aria-invalid={fieldErrors.password ? 'true' : undefined}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span id="password-error" className={styles.fieldErrorText} role="alert">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
              aria-busy={isLoading || undefined}
            >
              {isLoading ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ArrowRight size={18} />
                </>
              )}
              {isLoading && <span className={styles.srOnly}>Signing in...</span>}
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
