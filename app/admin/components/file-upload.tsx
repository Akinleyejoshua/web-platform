'use client';

import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import axios from 'axios';
import styles from './file-upload.module.css';

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    accept?: string;
    label?: string;
    placeholder?: string;
}

export function FileUpload({
    value,
    onChange,
    accept = 'image/*',
    label = 'Upload Image',
    placeholder = 'Enter URL or upload file',
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(value || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsUploading(true);

        try {
            // Create base64 from file
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;

                // Set preview immediately
                setPreview(base64);

                try {
                    // Upload to server
                    const response = await axios.post('/api/upload', {
                        file: base64,
                        filename: file.name,
                        type: file.type,
                    });

                    if (response.data.success) {
                        onChange(response.data.url);
                        setPreview(response.data.url);
                    }
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        setError(err.response?.data?.error || 'Upload failed');
                    } else {
                        setError('Upload failed');
                    }
                    // Keep base64 as fallback
                    onChange(base64);
                }

                setIsUploading(false);
            };

            reader.onerror = () => {
                setError('Failed to read file');
                setIsUploading(false);
            };

            reader.readAsDataURL(file);
        } catch (err) {
            setError('Upload failed');
            setIsUploading(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        onChange(url);
        setPreview(url || null);
    };

    const handleClear = () => {
        onChange('');
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const triggerFileSelect = () => {
        inputRef.current?.click();
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>

            <div className={styles.inputRow}>
                <input
                    type="text"
                    value={value}
                    onChange={handleUrlChange}
                    placeholder={placeholder}
                    className={styles.urlInput}
                />
                <button
                    type="button"
                    onClick={triggerFileSelect}
                    disabled={isUploading}
                    className={styles.uploadBtn}
                >
                    {isUploading ? (
                        <span className={styles.spinner} />
                    ) : (
                        <FiUpload size={18} />
                    )}
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className={styles.hiddenInput}
            />

            {error && <p className={styles.error}>{error}</p>}

            {preview && (
                <div className={styles.preview}>
                    {preview.startsWith('data:video') || preview.includes('.mp4') || preview.includes('.webm') ? (
                        <video src={preview} controls className={styles.previewMedia} />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview} alt="Preview" className={styles.previewMedia} />
                    )}
                    <button
                        type="button"
                        onClick={handleClear}
                        className={styles.clearBtn}
                    >
                        <FiX size={16} />
                    </button>
                </div>
            )}

            {!preview && (
                <div className={styles.placeholder} onClick={triggerFileSelect}>
                    <FiImage size={32} />
                    <span>Click to upload or drag & drop</span>
                </div>
            )}
        </div>
    );
}
