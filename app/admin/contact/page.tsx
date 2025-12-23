'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../components/editor.module.css';

export default function AdminContactPage() {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/contact');
                setFormData({
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                });
            } catch (error) {
                console.error('Failed to fetch contact data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await axios.put('/api/contact', formData);
            setMessage({ type: 'success', text: 'Contact info updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update contact info.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Edit Contact Info</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="email" className={styles.label}>Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="hello@example.com"
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>Phone Number</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={styles.input}
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                {message && (
                    <div className={message.type === 'success' ? styles.success : styles.error}>
                        {message.text}
                    </div>
                )}

                <div className={styles.actions}>
                    <button type="submit" disabled={isSaving} className={styles.submitBtn}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
