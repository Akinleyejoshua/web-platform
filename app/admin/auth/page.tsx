'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiLock, FiMail, FiEye, FiEyeOff, FiShield, FiZap, FiTrendingUp } from 'react-icons/fi';
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
                            Joshua<span>.Dev</span>
                        </div>
                        <h1 className={styles.brandTitle}>Admin Control Center</h1>
                        <p className={styles.brandSubtitle}>
                            Access your portfolio dashboard to manage content, monitor analytics, and keep your digital presence updated.
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
                                <FiShield size={28} />
                            </div>
                            <h2>Welcome Back</h2>
                            <p>Enter your credentials to access the admin dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email">Email Address</label>
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
                                        placeholder="••••••••••"
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
                                    <span className={styles.loadingSpinner} />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className={styles.featuresHint}>
                            <div className={styles.featureItem}>
                                <FiZap size={16} />
                                <span>Manage hero, about, projects & more</span>
                            </div>
                            <div className={styles.featureItem}>
                                <FiTrendingUp size={16} />
                                <span>Track real-time analytics & visitors</span>
                            </div>
                        </div>

                        <div className={styles.backLink}>
                            <a href="/">← Back to Portfolio</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
