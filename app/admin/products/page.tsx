'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiExternalLink, FiImage, FiPackage, FiArrowUp, FiArrowDown, FiBookOpen, FiGithub } from 'react-icons/fi';
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
    assets?: { type: 'image' | 'video' | 'youtube' | 'loom' | 'external'; url: string }[];
    technologies: string[];
    githubUrl?: string;
    liveUrl: string;
    blogUrl?: string;
    order: number;
    isVisible: boolean;
}

const emptyProduct: ProductItem = {
    title: '',
    description: '',
    category: 'saas',
    mediaType: 'image',
    mediaUrl: '',
    assets: [],
    technologies: [],
    githubUrl: '',
    liveUrl: '',
    blogUrl: '',
    order: 0,
    isVisible: true,
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
    const [formUploadMode, setFormUploadMode] = useState<'storage' | 'base64'>('storage');

    const fetchProducts = async () => {
        try {
            const response = await axios.get('/api/product-projects?admin=true');
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
        setFormUploadMode('storage');
    };

    const handleEdit = (product: ProductItem) => {
        setEditingItem({ ...product });
        setTechInput(product.technologies.join(', '));
        
        // Detect if any existing image uses base64
        const usesBase64 = product.mediaUrl?.startsWith('data:') || 
                           product.assets?.some(a => a.url?.startsWith('data:'));
        setFormUploadMode(usesBase64 ? 'base64' : 'storage');
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

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === products.length - 1) return;

        const newProducts = [...products];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        
        [newProducts[index], newProducts[swapIndex]] = [newProducts[swapIndex], newProducts[index]];
        
        const updates = newProducts.map((p, i) => ({ ...p, order: i }));
        setProducts(updates);

        try {
            await Promise.all([
                axios.put('/api/product-projects', updates[index]),
                axios.put('/api/product-projects', updates[swapIndex])
            ]);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to reorder.' });
            fetchProducts();
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

                    {/* Gemini AI Product Generator */}
                    <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px dashed rgba(99, 102, 241, 0.3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label className={styles.label} style={{ fontWeight: 600, color: 'var(--color-accent)', marginBottom: 0 }}>Gemini AI Product Generator</label>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Describe what software product/SaaS you built, and Gemini will generate a professional name/title, detailed description, and technologies.</span>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <input
                                type="text"
                                id="gemini-ai-product-prompt"
                                placeholder="e.g. a billing and subscription management platform for micro-SaaS applications"
                                className={styles.input}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={async () => {
                                    const promptInput = document.getElementById('gemini-ai-product-prompt') as HTMLInputElement;
                                    if (!promptInput || !promptInput.value.trim()) {
                                        alert('Please enter a product description.');
                                        return;
                                    }
                                    setIsSaving(true);
                                    try {
                                        const res = await axios.post('/api/generate', { prompt: promptInput.value, type: 'product' });
                                        if (res.data) {
                                            setEditingItem({
                                                ...editingItem,
                                                title: res.data.title || editingItem.title,
                                                description: res.data.description || editingItem.description,
                                                technologies: res.data.technologies || editingItem.technologies
                                            });
                                            setTechInput(res.data.technologies ? res.data.technologies.join(', ') : '');
                                            alert('Product details generated successfully!');
                                        }
                                    } catch (err: any) {
                                        console.error(err);
                                        alert('Failed to generate product: ' + (err.response?.data?.error || err.message));
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                                className={styles.addAssetBtn}
                                style={{ height: '44px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', background: 'var(--color-accent)' }}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Generating...' : 'Generate Details'}
                            </button>
                        </div>
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
                            uploadMode={formUploadMode}
                            onUploadModeChange={setFormUploadMode}
                        />
                    </div>

                    {/* Product Assets List Section */}
                    <div style={{ marginTop: '2rem', marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-bg-secondary, rgba(255,255,255,0.02))', border: '1px dashed var(--color-border)', borderRadius: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <label className={styles.label} style={{ marginBottom: 0, fontWeight: 600 }}>Product Gallery / Slide Assets ({editingItem.assets?.length || 0})</label>
                            <button
                                type="button"
                                onClick={() => {
                                    const currentAssets = editingItem.assets || [];
                                    setEditingItem({
                                        ...editingItem,
                                        assets: [...currentAssets, { type: 'image', url: '' }]
                                    });
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.8rem', background: 'var(--color-accent, #6366f1)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                            >
                                <FiPlus size={14} /> Add Slide Asset
                            </button>
                        </div>

                        {(!editingItem.assets || editingItem.assets.length === 0) ? (
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', margin: '0' }}>
                                No assets added yet. Slideshow will fallback to default product image.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {editingItem.assets.map((asset, index) => (
                                    <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'var(--color-card, rgba(0,0,0,0.15))', border: '1px solid var(--color-border)', borderRadius: '8px', position: 'relative' }}>
                                        {/* Remove Asset Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentAssets = [...(editingItem.assets || [])];
                                                currentAssets.splice(index, 1);
                                                setEditingItem({ ...editingItem, assets: currentAssets });
                                            }}
                                            style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
                                            title="Delete Asset"
                                        >
                                            <FiTrash2 size={14} style={{ display: 'block' }} />
                                        </button>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ flex: '0 0 130px' }}>
                                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Asset Type</label>
                                                <select
                                                    value={asset.type}
                                                    onChange={(e) => {
                                                        const currentAssets = [...(editingItem.assets || [])];
                                                        currentAssets[index].type = e.target.value as any;
                                                        setEditingItem({ ...editingItem, assets: currentAssets });
                                                    }}
                                                    className={styles.select}
                                                    style={{ height: '38px', padding: '4px 8px', fontSize: '0.85rem' }}
                                                >
                                                    <option value="image">Image</option>
                                                    <option value="video">Direct Video (.mp4)</option>
                                                    <option value="youtube">YouTube URL</option>
                                                    <option value="loom">Loom Video</option>
                                                    <option value="external">External Frame</option>
                                                </select>
                                            </div>

                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>Asset URL / Upload</label>
                                                {asset.type === 'image' ? (
                                                    <FileUpload
                                                        value={asset.url}
                                                        onChange={(url) => {
                                                            const currentAssets = [...(editingItem.assets || [])];
                                                            currentAssets[index].url = url;
                                                            setEditingItem({ ...editingItem, assets: currentAssets });
                                                        }}
                                                        accept="image/*"
                                                        uploadMode={formUploadMode}
                                                        onUploadModeChange={setFormUploadMode}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={asset.url}
                                                        onChange={(e) => {
                                                            const currentAssets = [...(editingItem.assets || [])];
                                                            currentAssets[index].url = e.target.value;
                                                            setEditingItem({ ...editingItem, assets: currentAssets });
                                                        }}
                                                        className={styles.input}
                                                        placeholder={
                                                            asset.type === 'youtube' ? 'https://youtube.com/watch?v=...' :
                                                            asset.type === 'loom' ? 'https://loom.com/share/...' :
                                                            'https://...'
                                                        }
                                                        style={{ height: '38px', padding: '4px 12px', fontSize: '0.85rem' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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

                    <div className={styles.field}>
                        <label className={styles.label}>GitHub URL (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={editingItem.githubUrl || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, githubUrl: e.target.value })}
                                className={styles.input}
                                style={{ paddingLeft: '40px' }}
                                placeholder="https://github.com/..."
                            />
                            <FiGithub style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} size={18} />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Blog Post Link / URL (Optional)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={editingItem.blogUrl || ''}
                                onChange={(e) => setEditingItem({ ...editingItem, blogUrl: e.target.value })}
                                className={styles.input}
                                style={{ paddingLeft: '40px' }}
                                placeholder="e.g. /blog/my-product-writeup or https://..."
                            />
                            <FiBookOpen style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--color-text-secondary)' }} size={18} />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label className={styles.label}>Order (Sort Hierarchy)</label>
                            <input
                                type="number"
                                value={editingItem.order}
                                onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                                className={styles.input}
                                placeholder="Lower numbers appear first"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '100%', paddingTop: '32px' }}>
                                <input
                                    type="checkbox"
                                    checked={editingItem.isVisible !== false}
                                    onChange={(e) => setEditingItem({ ...editingItem, isVisible: e.target.checked })}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                Publicly Visible
                            </label>
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
                        products.map((product, index) => (
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
                                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className={projectStyles.actionBtn}>
                                        <FiArrowUp size={16} />
                                    </button>
                                    <button onClick={() => handleMove(index, 'down')} disabled={index === products.length - 1} className={projectStyles.actionBtn}>
                                        <FiArrowDown size={16} />
                                    </button>
                                    {product.githubUrl && (
                                        <a href={product.githubUrl} target="_blank" rel="noopener noreferrer" className={projectStyles.actionBtn} title="View Source on GitHub">
                                            <FiGithub size={16} />
                                        </a>
                                    )}
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
