'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiExternalLink, FiImage, FiPackage } from 'react-icons/fi';
import { FileUpload } from '../components/file-upload';
import { Loader } from '@/app/components/atoms/loader';
import styles from '../components/editor.module.css';
import projectStyles from '../projects/projects.module.css';

type ProductCategory = 'saas' | 'b2b' | 'b2c' | 'tool' | 'other';
type MediaType = 'image' | 'video';

interface ProductItem {
    _id?: string;
    title: string;
    description: string;
    category: ProductCategory;
    mediaType: MediaType;
    mediaUrl: string;
    technologies: string[];
    liveUrl: string;
    order: number;
}

const emptyProduct: ProductItem = {
    title: '',
    description: '',
    category: 'saas',
    mediaType: 'image',
    mediaUrl: '',
    technologies: [],
    liveUrl: '',
    order: 0,
};

const categoryLabels: Record<ProductCategory, string> = {
    saas: 'SaaS',
    b2b: 'B2B',
    b2c: 'B2C',
    tool: 'Tool',
    other: 'Other',
};

export default function AdminProductsPage() {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [editingItem, setEditingItem] = useState<ProductItem | null>(null);
    const [techInput, setTechInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/product-projects');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = () => {
        setEditingItem({ ...emptyProduct, order: products.length });
        setTechInput('');
    };

    const handleEdit = (product: ProductItem) => {
        setEditingItem({ ...product });
        setTechInput(product.technologies.join(', '));
    };

    const handleCancel = () => {
        setEditingItem(null);
    };

    const handleSave = async () => {
        if (!editingItem) return;

        // Apply tech input before saving
        const techs = techInput.split(',').map(t => t.trim()).filter(Boolean);

        setIsSaving(true);
        setMessage(null);

        try {
            const dataToSave = { ...editingItem, technologies: techs };
            if (editingItem._id) {
                await axios.put('/api/product-projects', dataToSave);
            } else {
                await axios.post('/api/product-projects', dataToSave);
            }
            await fetchProducts();
            setEditingItem(null);
            setMessage({ type: 'success', text: 'Product saved successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save product.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await axios.delete(`/api/product-projects?id=${id}`);
            await fetchProducts();
            setMessage({ type: 'success', text: 'Product deleted successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete product.' });
        }
    };

    if (isLoading) {
        return <Loader variant="section" />;
    }

    return (
        <div className={styles.editor}>
            <div className={styles.header}>
                <h1 className={styles.title}>Manage Products</h1>
                {!editingItem && (
                    <button onClick={handleAdd} className={styles.addBtn}>
                        <FiPlus size={18} />
                        New Product
                    </button>
                )}
            </div>

            {message && (
                <div className={message.type === 'success' ? styles.success : styles.error}>
                    {message.text}
                </div>
            )}

            {editingItem ? (
                <div className={styles.form}>
                    <div className={styles.sectionTitle}>
                        {editingItem._id ? 'Edit Product' : 'New Product'}
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Title</label>
                            <input
                                type="text"
                                value={editingItem.title}
                                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                className={styles.input}
                                placeholder="e.g. FlashMailPro"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label}>Category</label>
                            <select
                                value={editingItem.category}
                                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as ProductCategory })}
                                className={styles.select}
                            >
                                {Object.entries(categoryLabels).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            value={editingItem.description}
                            onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                            className={styles.textarea}
                            placeholder="A brief description of this product..."
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Technologies (comma-separated)</label>
                        <input
                            type="text"
                            value={techInput}
                            onChange={(e) => setTechInput(e.target.value)}
                            className={styles.input}
                            placeholder="e.g. Next.js, Node.js, MongoDB"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Product Image</label>
                        <FileUpload
                            value={editingItem.mediaUrl}
                            onChange={(url) => setEditingItem({ ...editingItem, mediaUrl: url })}
                            label="Upload product screenshot"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Live URL</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={editingItem.liveUrl}
                                onChange={(e) => setEditingItem({ ...editingItem, liveUrl: e.target.value })}
                                className={styles.input}
                                style={{ paddingLeft: '40px' }}
                                placeholder="https://..."
                            />
                            <FiExternalLink style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} size={18} />
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={handleSave} disabled={isSaving} className={styles.submitBtn}>
                            <FiCheck size={18} />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button onClick={handleCancel} className={styles.cancelBtn}>
                            <FiX size={18} />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.grid}>
                    {products.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--color-muted)' }}>
                            No products found. Create your first one!
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className={projectStyles.card}>
                                <div className={projectStyles.cardMedia}>
                                    {product.mediaUrl ? (
                                        <img src={product.mediaUrl} alt={product.title} />
                                    ) : (
                                        <div className={projectStyles.noMedia}>
                                            <FiPackage size={24} />
                                        </div>
                                    )}
                                    <span className={projectStyles.badge}>{categoryLabels[product.category]}</span>
                                </div>
                                <div className={projectStyles.cardContent}>
                                    <h3 className={projectStyles.cardTitle}>{product.title}</h3>
                                    <p className={projectStyles.cardDesc}>{product.description}</p>
                                    {product.technologies.length > 0 && (
                                        <div className={projectStyles.cardTechs}>
                                            {product.technologies.slice(0, 3).map((tech, i) => (
                                                <span key={i} className={projectStyles.techBadge}>{tech}</span>
                                            ))}
                                            {product.technologies.length > 3 && (
                                                <span className={projectStyles.techBadge}>+{product.technologies.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className={projectStyles.cardActions}>
                                    {product.liveUrl && (
                                        <a href={product.liveUrl} target="_blank" rel="noopener noreferrer" className={projectStyles.actionBtn}>
                                            <FiExternalLink size={16} />
                                        </a>
                                    )}
                                    <button onClick={() => handleEdit(product)} className={projectStyles.actionBtn}>
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(product._id!)} className={`${projectStyles.actionBtn} ${projectStyles.delete}`}>
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
