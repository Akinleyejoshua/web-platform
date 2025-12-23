'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
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

    return (
        <div className={styles.authPage}>
            <div className={styles.authContainer}>
                {/* Left side - Branding */}
                <div className={styles.brandingSide}>
                    <div className={styles.brandingContent}>
                        <div className={styles.brandLogo}>
                            Port<span>folio</span>
                        </div>
                        <h1 className={styles.brandTitle}>Admin Panel</h1>
                        <p className={styles.brandSubtitle}>
                            Manage your portfolio content, track analytics, and keep your site updated.
                        </p>
                        <div className={styles.brandDecoration}>
                            <div className={styles.decorCircle1} />
                            <div className={styles.decorCircle2} />
                            <div className={styles.decorCircle3} />
                        </div>
                    </div>
                </div>

                {/* Right side - Login Form */}
                <div className={styles.formSide}>
                    <div className={styles.formContainer}>
                        <div className={styles.formHeader}>
                            <div className={styles.lockIcon}>
                                <FiLock size={24} />
                            </div>
                            <h2>Welcome back</h2>
                            <p>Enter your credentials to access the dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email</label>
                                <div className={styles.inputWrapper}>
                                    <FiMail className={styles.inputIcon} />
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
                                    <FiLock className={styles.inputIcon} />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        className={styles.togglePassword}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
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
                                    <span className={styles.loadingSpinner} />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className={styles.backLink}>
                            <a href="/">← Back to Portfolio</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
