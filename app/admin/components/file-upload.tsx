'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import axios from 'axios';
import styles from './file-upload.module.css';
import { Loader } from '@/app/components/atoms/loader';

interface FileUploadProps {
    value: string;
    onChange: (url: string) => void;
    accept?: string;
    label?: string;
    placeholder?: string;
    uploadMode?: 'storage' | 'base64';
    onUploadModeChange?: (mode: 'storage' | 'base64') => void;
}

export function FileUpload({
    value,
    onChange,
    accept = 'image/*',
    label = 'Upload Image',
    placeholder = 'Enter URL or upload file',
    uploadMode: propsUploadMode,
    onUploadModeChange,
}: FileUploadProps) {
    const [localUploadMode, setLocalUploadMode] = useState<'storage' | 'base64'>('storage');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(value || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeMode = propsUploadMode !== undefined ? propsUploadMode : localUploadMode;
    const setActiveMode = (mode: 'storage' | 'base64') => {
        if (onUploadModeChange) {
            onUploadModeChange(mode);
        } else {
            setLocalUploadMode(mode);
        }
    };

    // Auto-detect mode based on initial value format
    useEffect(() => {
        if (value && value.startsWith('data:')) {
            setActiveMode('base64');
        }
    }, [value]);

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

                if (activeMode === 'base64') {
                    onChange(base64);
                    setIsUploading(false);
                    return;
                }

                try {
                    // Upload to server (Storage Mode)
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <label className={styles.label}>{label}</label>
                
                {/* Upload Mode Option (Storage vs Base64) */}
                <div className={styles.modeSelector}>
                    <button
                        type="button"
                        onClick={() => setActiveMode('storage')}
                        className={`${styles.modeBtn} ${activeMode === 'storage' ? styles.modeBtnActive : ''}`}
                    >
                        Storage (Server)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMode('base64')}
                        className={`${styles.modeBtn} ${activeMode === 'base64' ? styles.modeBtnActive : ''}`}
                    >
                        Base64 (DB)
                    </button>
                </div>
            </div>

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
                        <Loader variant="inline" />
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

