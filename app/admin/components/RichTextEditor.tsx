'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
    FiBold, FiItalic, FiUnderline, FiAlignLeft, FiAlignCenter, 
    FiAlignRight, FiAlignJustify, FiList, FiLink, FiImage, 
    FiGrid, FiRotateCcw, FiRotateCw, FiCode, FiScissors, FiCheckCircle, FiX, FiVideo
} from 'react-icons/fi';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your technical article...' }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [activeFormats, setActiveFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikeThrough: false,
    });

    // Modal dialogs state
    const [activeModal, setActiveModal] = useState<'image' | 'video' | 'table' | null>(null);
    const [modalTab, setModalTab] = useState<'upload' | 'url'>('upload');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);

    // Keep backup selection to restore before inserting
    const savedRangeRef = useRef<Range | null>(null);
    const isInternalChangeRef = useRef(false);

    // Handle initial load or external updates
    useEffect(() => {
        let isExternal = false;
        if (editorRef.current) {
            if (isInternalChangeRef.current) {
                isInternalChangeRef.current = false;
            } else if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || '';
                isExternal = true;
            }
        } else {
            isExternal = true;
        }
        updateCounts();
        if (isExternal) {
            highlightCode();
        }
    }, [value]);

    // Highlight code blocks inside editor
    const highlightCode = () => {
        if (!isSourceMode && editorRef.current) {
            const codeBlocks = editorRef.current.querySelectorAll('pre code, pre');
            codeBlocks.forEach((block) => {
                // Ensure it has class for hljs or auto-highlight
                hljs.highlightElement(block as HTMLElement);
            });
        }
    };

    // Run highlight and restore content when returning to visual view
    useEffect(() => {
        if (!isSourceMode && editorRef.current) {
            editorRef.current.innerHTML = value || '';
            highlightCode();
        }
    }, [isSourceMode]);

    const updateCounts = () => {
        if (!editorRef.current) return;
        const text = editorRef.current.innerText || '';
        const cleanText = text.trim();
        const words = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
        setWordCount(words);
        setCharCount(text.length);
    };

    // Save user's cursor selection range
    const saveSelection = () => {
        if (typeof window === 'undefined') return;
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            savedRangeRef.current = sel.getRangeAt(0).cloneRange();
        }
    };

    // Restore user's cursor selection range
    const restoreSelection = () => {
        if (typeof window === 'undefined' || !savedRangeRef.current) return;
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(savedRangeRef.current);
        }
    };

    // Execute standard document command
    const execCmd = (command: string, val: string = '') => {
        editorRef.current?.focus();
        document.execCommand(command, false, val);
        updateActiveFormats();
        if (editorRef.current) {
            isInternalChangeRef.current = true;
            onChange(editorRef.current.innerHTML);
        }
    };

    const updateActiveFormats = () => {
        if (typeof document === 'undefined') return;
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikeThrough: document.queryCommandState('strikeThrough'),
        });
    };

    const handleInput = () => {
        if (editorRef.current) {
            isInternalChangeRef.current = true;
            onChange(editorRef.current.innerHTML);
            updateCounts();
        }
    };

    // Open a modal and save current cursor selection
    const openModal = (type: 'image' | 'video' | 'table') => {
        saveSelection();
        setActiveModal(type);
        setModalTab('upload');
        setImageUrl('');
        setVideoUrl('');
    };

    // Close any active modal
    const closeModal = () => {
        setActiveModal(null);
    };

    // Insert Image action
    const handleInsertImage = () => {
        restoreSelection();
        if (imageUrl) {
            execCmd('insertHTML', `<img src="${imageUrl}" alt="Uploaded Asset" style="max-width: 100%; border-radius: 6px; margin: 15px 0; display: block;" />`);
        }
        closeModal();
    };

    // Upload Image from local file (to base64)
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setImageUrl(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    // Insert Video action
    const handleInsertVideo = () => {
        restoreSelection();
        if (videoUrl) {
            if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = videoUrl.match(regExp);
                const id = (match && match[2].length === 11) ? match[2] : null;
                const embedUrl = id ? `https://www.youtube.com/embed/${id}` : videoUrl;
                execCmd('insertHTML', `<iframe src="${embedUrl}" width="100%" height="450" frameborder="0" allowfullscreen style="border-radius: 6px; margin: 15px 0; border: none;"></iframe>`);
            } else if (videoUrl.includes('loom.com')) {
                const loomId = videoUrl.split('/').pop()?.split('?')[0];
                const embedUrl = `https://www.loom.com/embed/${loomId}`;
                execCmd('insertHTML', `<iframe src="${embedUrl}" width="100%" height="450" frameborder="0" allowfullscreen style="border-radius: 6px; margin: 15px 0; border: none;"></iframe>`);
            } else {
                // Direct video link (e.g. mp4 blob or url)
                execCmd('insertHTML', `<video src="${videoUrl}" controls style="max-width: 100%; border-radius: 6px; margin: 15px 0; display: block;"></video>`);
            }
        }
        closeModal();
    };

    // Upload Video from local file (to base64 blob)
    const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setVideoUrl(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    // Insert Table action
    const handleInsertTable = () => {
        restoreSelection();
        let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 15px 0;"><thead><tr>';
        for (let j = 0; j < tableCols; j++) {
            tableHtml += '<th style="border: 1px solid #d2d0ce; padding: 8px; background: #f3f2f1; text-align: left; font-weight: 600;">Header</th>';
        }
        tableHtml += '</tr></thead><tbody>';
        for (let i = 0; i < tableRows - 1; i++) {
            tableHtml += '<tr>';
            for (let j = 0; j < tableCols; j++) {
                tableHtml += '<td style="border: 1px solid #d2d0ce; padding: 8px;">Cell</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody></table><p><br></p>';
        
        execCmd('insertHTML', tableHtml);
        closeModal();
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        onChange(val);
    };

    const insertHyperlink = () => {
        saveSelection();
        const url = prompt('Enter the link URL (e.g. https://google.com):');
        if (url) {
            restoreSelection();
            execCmd('createLink', url);
        }
    };

    return (
        <div className={styles.wordEditor}>
            {/* MS Word Blue Header */}
            <div className={styles.ribbonHeader}>
                <div className={styles.ribbonTitle}>
                    <FiCheckCircle size={16} />
                    <span>Technical Document Creator</span>
                </div>
                <div className={styles.ribbonBadge}>MS Word Mode</div>
            </div>

            {/* Formatting Ribbon */}
            <div className={styles.ribbonToolbar}>
                {/* Font Section */}
                <div className={styles.toolbarCol}>
                    <div className={styles.commandGroup}>
                        <button
                            type="button"
                            onClick={() => execCmd('bold')}
                            className={`${styles.toolButton} ${activeFormats.bold ? styles.toolButtonActive : ''}`}
                            title="Bold (Ctrl+B)"
                        >
                            <FiBold size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => execCmd('italic')}
                            className={`${styles.toolButton} ${activeFormats.italic ? styles.toolButtonActive : ''}`}
                            title="Italic (Ctrl+I)"
                        >
                            <FiItalic size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => execCmd('underline')}
                            className={`${styles.toolButton} ${activeFormats.underline ? styles.toolButtonActive : ''}`}
                            title="Underline (Ctrl+U)"
                        >
                            <FiUnderline size={14} />
                        </button>
                        <button
                            type="button"
                            onClick={() => execCmd('strikeThrough')}
                            className={`${styles.toolButton} ${activeFormats.strikeThrough ? styles.toolButtonActive : ''}`}
                            title="Strikethrough"
                        >
                            <span style={{ textDecoration: 'line-through', fontWeight: 'bold', fontSize: '0.85rem' }}>ab</span>
                        </button>
                        
                        <div style={{ width: '1px', background: '#e1dfdd', margin: '0 4px', height: '20px' }} />

                        {/* Text Color */}
                        <div className={styles.colorWrapper} title="Font Color">
                            <span className={styles.colorIndicator}>
                                <span>A</span>
                                <div className={styles.colorBar} style={{ backgroundColor: '#ff0000' }} />
                            </span>
                            <input
                                type="color"
                                className={styles.colorInput}
                                onChange={(e) => execCmd('foreColor', e.target.value)}
                            />
                        </div>

                        {/* Background Highlight */}
                        <div className={styles.colorWrapper} title="Text Highlight Color">
                            <span className={styles.colorIndicator}>
                                <span>ab</span>
                                <div className={styles.colorBar} style={{ backgroundColor: '#ffff00' }} />
                            </span>
                            <input
                                type="color"
                                className={styles.colorInput}
                                onChange={(e) => execCmd('hiliteColor', e.target.value)}
                                defaultValue="#ffff00"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => execCmd('removeFormat')}
                            className={styles.toolButton}
                            title="Clear All Formatting"
                        >
                            <FiScissors size={14} />
                        </button>
                    </div>
                    <div className={styles.groupLabel}>Font & Colors</div>
                </div>

                {/* Paragraph Styles */}
                <div className={styles.toolbarCol}>
                    <div className={styles.commandGroup}>
                        <select
                            onChange={(e) => execCmd('formatBlock', e.target.value)}
                            className={styles.toolSelect}
                            title="Heading Style"
                            defaultValue="p"
                        >
                            <option value="p">Normal text</option>
                            <option value="h1">Heading 1</option>
                            <option value="h2">Heading 2</option>
                            <option value="h3">Heading 3</option>
                            <option value="blockquote">Quote Block</option>
                            <option value="pre">Code Block</option>
                        </select>

                        <select
                            onChange={(e) => execCmd('fontSize', e.target.value)}
                            className={styles.toolSelect}
                            title="Font Size"
                            defaultValue="3"
                        >
                            <option value="1">Small (8pt)</option>
                            <option value="2">Medium-Small (10pt)</option>
                            <option value="3">Regular (12pt)</option>
                            <option value="4">Medium-Large (14pt)</option>
                            <option value="5">Large (18pt)</option>
                            <option value="6">Very Large (24pt)</option>
                            <option value="7">Huge (36pt)</option>
                        </select>
                    </div>
                    <div className={styles.groupLabel}>Styles</div>
                </div>

                {/* Alignment & Lists */}
                <div className={styles.toolbarCol}>
                    <div className={styles.commandGroup}>
                        <button type="button" onClick={() => execCmd('justifyLeft')} className={styles.toolButton} title="Align Left"><FiAlignLeft size={14} /></button>
                        <button type="button" onClick={() => execCmd('justifyCenter')} className={styles.toolButton} title="Align Center"><FiAlignCenter size={14} /></button>
                        <button type="button" onClick={() => execCmd('justifyRight')} className={styles.toolButton} title="Align Right"><FiAlignRight size={14} /></button>
                        <button type="button" onClick={() => execCmd('justifyFull')} className={styles.toolButton} title="Justify"><FiAlignJustify size={14} /></button>
                        
                        <div style={{ width: '1px', background: '#e1dfdd', margin: '0 4px', height: '20px' }} />
                        
                        <button type="button" onClick={() => execCmd('insertUnorderedList')} className={styles.toolButton} title="Bullets List"><FiList size={14} /></button>
                        <button type="button" onClick={() => execCmd('insertOrderedList')} className={styles.toolButton} title="Numbered List">
                            <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>1.</span>
                        </button>
                    </div>
                    <div className={styles.groupLabel}>Paragraph</div>
                </div>

                {/* Insert Elements (Custom dialog buttons) */}
                <div className={styles.toolbarCol}>
                    <div className={styles.commandGroup}>
                        <button type="button" onClick={insertHyperlink} className={styles.toolButton} title="Insert Link"><FiLink size={14} /></button>
                        <button type="button" onClick={() => openModal('image')} className={styles.toolButton} title="Insert Image (Upload or URL)"><FiImage size={14} /></button>
                        <button type="button" onClick={() => openModal('video')} className={styles.toolButton} title="Insert Video (Upload, Loom, YouTube)"><FiVideo size={14} /></button>
                        <button type="button" onClick={() => openModal('table')} className={styles.toolButton} title="Insert Table Grid"><FiGrid size={14} /></button>
                    </div>
                    <div className={styles.groupLabel}>Insert</div>
                </div>

                {/* Undo / Redo & HTML source toggle */}
                <div className={styles.toolbarCol}>
                    <div className={styles.commandGroup}>
                        <button type="button" onClick={() => execCmd('undo')} className={styles.toolButton} title="Undo"><FiRotateCcw size={14} /></button>
                        <button type="button" onClick={() => execCmd('redo')} className={styles.toolButton} title="Redo"><FiRotateCw size={14} /></button>
                        
                        <div style={{ width: '1px', background: '#e1dfdd', margin: '0 4px', height: '20px' }} />

                        <button 
                            type="button" 
                            onClick={() => setIsSourceMode(!isSourceMode)} 
                            className={`${styles.toolButton} ${isSourceMode ? styles.toolButtonActive : ''}`} 
                            title="Toggle HTML Source Code View"
                        >
                            <FiCode size={14} />
                        </button>
                    </div>
                    <div className={styles.groupLabel}>System</div>
                </div>
            </div>

            {/* Document Canvas Frame (Mimicking MS Word Paper) */}
            <div className={styles.documentContainer}>
                {isSourceMode ? (
                    <textarea
                        value={value}
                        onChange={handleSourceChange}
                        className={styles.sourceArea}
                        placeholder="Paste HTML source code here..."
                    />
                ) : (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onKeyUp={updateActiveFormats}
                        onMouseUp={updateActiveFormats}
                        className={styles.paper}
                        style={{ outline: 'none' }}
                        data-placeholder={placeholder}
                    />
                )}
            </div>

            {/* Word Count Status Bar */}
            <div className={styles.statusBar}>
                <div>
                    Page 1 of 1 &nbsp;|&nbsp; Words: {wordCount} &nbsp;|&nbsp; Characters: {charCount}
                </div>
                <div>
                    100% Zoom &nbsp;|&nbsp; English (US)
                </div>
            </div>

            {/* Insert Image Dialog */}
            {activeModal === 'image' && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <span>Insert Image</span>
                            <button className={styles.modalClose} onClick={closeModal}><FiX size={18} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalTabs}>
                                <button className={`${styles.modalTab} ${modalTab === 'upload' ? styles.modalTabActive : ''}`} onClick={() => setModalTab('upload')}>Upload File</button>
                                <button className={`${styles.modalTab} ${modalTab === 'url' ? styles.modalTabActive : ''}`} onClick={() => setModalTab('url')}>Web Link URL</button>
                            </div>

                            {modalTab === 'upload' ? (
                                <div className={styles.modalUploadArea} style={{ position: 'relative' }}>
                                    <FiImage size={32} style={{ color: '#605e5c', marginBottom: '8px' }} />
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Select or drop image file here</p>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageFileChange}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                    {imageUrl && <p style={{ fontSize: '0.75rem', color: '#107c41', marginTop: '6px', fontWeight: 'bold' }}>✓ Image loaded successfully</p>}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className={styles.modalInput}
                                    placeholder="Paste image web address (URL)..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            )}

                            <div className={styles.modalActions}>
                                <button className={styles.modalBtnPrimary} onClick={handleInsertImage} disabled={!imageUrl}>Insert Image</button>
                                <button className={styles.modalBtnSecondary} onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Insert Video Dialog */}
            {activeModal === 'video' && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <span>Insert Video / Embed</span>
                            <button className={styles.modalClose} onClick={closeModal}><FiX size={18} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.modalTabs}>
                                <button className={`${styles.modalTab} ${modalTab === 'upload' ? styles.modalTabActive : ''}`} onClick={() => setModalTab('upload')}>Upload Video File</button>
                                <button className={`${styles.modalTab} ${modalTab === 'url' ? styles.modalTabActive : ''}`} onClick={() => setModalTab('url')}>Loom / YouTube / URL</button>
                            </div>

                            {modalTab === 'upload' ? (
                                <div className={styles.modalUploadArea} style={{ position: 'relative' }}>
                                    <FiVideo size={32} style={{ color: '#605e5c', marginBottom: '8px' }} />
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>Select video file (.mp4, .mov, etc.)</p>
                                    <input 
                                        type="file" 
                                        accept="video/*" 
                                        onChange={handleVideoFileChange}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                    {videoUrl && <p style={{ fontSize: '0.75rem', color: '#107c41', marginTop: '6px', fontWeight: 'bold' }}>✓ Video loaded successfully</p>}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className={styles.modalInput}
                                    placeholder="YouTube link, Loom URL, or direct video address..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                />
                            )}

                            <div className={styles.modalActions}>
                                <button className={styles.modalBtnPrimary} onClick={handleInsertVideo} disabled={!videoUrl}>Insert Video</button>
                                <button className={styles.modalBtnSecondary} onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Insert Table Dialog */}
            {activeModal === 'table' && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <span>Insert Table</span>
                            <button className={styles.modalClose} onClick={closeModal}><FiX size={18} /></button>
                        </div>
                        <div className={styles.modalBody}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#605e5c' }}>Number of Rows</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className={styles.modalInput}
                                        value={tableRows}
                                        onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '4px', color: '#605e5c' }}>Number of Columns</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={20}
                                        className={styles.modalInput}
                                        value={tableCols}
                                        onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button className={styles.modalBtnPrimary} onClick={handleInsertTable}>Insert Grid</button>
                                <button className={styles.modalBtnSecondary} onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
