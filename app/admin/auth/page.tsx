'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import { Loader } from '@/app/components/atoms/loader';
import styles from './page.module.css';

export default function AdminAuthPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/auth', { email, password });
            if (response.data.success) {
                router.push('/admin');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.error || 'Authentication failed');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReadOnlyAccess = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/auth/read-only').then(() => {
                router.push('/admin');
            });
        } catch (err) {
            setError('Failed to enable read-only access');
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.logo}>
                        Joshua<span>.Dev</span>
                    </div>
                    <h1 className={styles.title}>Admin Sign In</h1>
                    <p className={styles.subtitle}>
                        Enter your credentials to access the dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <div className={styles.inputWrapper}>
                            <FiMail className={styles.inputIcon} size={18} />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.inputWrapper}>
                            <FiLock className={styles.inputIcon} size={18} />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader variant="inline" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className={styles.cardFooter}>
                    <button
                        type="button"
                        className={styles.readOnlyButton}
                        onClick={handleReadOnlyAccess}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader variant="inline" /> : 'Read-Only Access (Recruiters)'}
                    </button>
                </div>

                <div className={styles.cardFooter}>
                    <a href="/" className={styles.backLink}>
                        <FiArrowLeft size={16} />
                        Back to Portfolio
                    </a>
                </div>
            </div>
        </div>
    );
}
