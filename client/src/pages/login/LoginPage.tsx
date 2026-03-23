import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.branding}>
          <div className={styles.logo}>MOT</div>
          <h1 className={styles.title}>Enugu State</h1>
          <p className={styles.subtitle}>Ministry of Transport - Ticketing System</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@mot.gov.ng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            className={styles.loginButton}
          >
            Sign In
          </Button>
        </form>

        <p className={styles.footer}>Enugu State Government &copy; 2026</p>
      </div>
    </div>
  );
};
