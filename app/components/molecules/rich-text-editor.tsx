'use client';

import React, { useRef, useEffect, useState } from 'react';
import { 
    FiBold, 
    FiItalic, 
    FiUnderline, 
    FiList, 
    FiLink2, 
    FiAlignLeft, 
    FiAlignCenter, 
    FiAlignRight, 
    FiCode, 
    FiEye, 
    FiCornerDownLeft,
    FiX,
    FiMaximize2,
    FiMinimize2
} from 'react-icons/fi';
import styles from './rich-text-editor.module.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const COLORS = [
    { name: 'Default', value: 'var(--color-text)' },
    { name: 'Accent', value: 'var(--color-accent)' },
    { name: 'Accent Secondary', value: 'var(--color-accent-secondary)' },
    { name: 'Success', value: '#10B981' },
    { name: 'Warning', value: '#F59E0B' },
    { name: 'Danger', value: '#EF4444' },
    { name: 'Muted', value: 'var(--color-text-muted)' },
];

export function RichTextEditor({ value, onChange, placeholder = 'Start typing...' }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [sourceValue, setSourceValue] = useState(value);
    const [activeStates, setActiveStates] = useState({
        bold: false,
        italic: false,
        underline: false,
        listUl: false,
        listOl: false,
        alignLeft: false,
        alignCenter: false,
        alignRight: false,
    });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);

    // Track active formats
    const checkActiveFormats = () => {
        if (!editorRef.current || isSourceMode) return;
        setActiveStates({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            listUl: document.queryCommandState('insertUnorderedList'),
            listOl: document.queryCommandState('insertOrderedList'),
            alignLeft: document.queryCommandState('justifyLeft'),
            alignCenter: document.queryCommandState('justifyCenter'),
            alignRight: document.queryCommandState('justifyRight'),
        });
    };

    // Initialize/Sync editor content
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
        setSourceValue(value || '');
    }, [value, isSourceMode]);

    const handleInput = () => {
        if (!editorRef.current) return;
        const html = editorRef.current.innerHTML;
        // Avoid setting empty paragraphs
        const cleanedHtml = html === '<p><br></p>' || html === '<br>' ? '' : html;
        onChange(cleanedHtml);
        setSourceValue(cleanedHtml);
        checkActiveFormats();
    };

    const executeCommand = (command: string, arg: string = '') => {
        if (isSourceMode) return;
        document.execCommand(command, false, arg);
        handleInput();
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    // Save current selection for async actions (like Link prompt or Color picker)
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            setSavedSelection(sel.getRangeAt(0));
        }
    };

    const restoreSelection = () => {
        if (!savedSelection) return;
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(savedSelection);
    };

    const handleLinkClick = () => {
        saveSelection();
        setShowLinkModal(true);
        setLinkUrl('');
    };

    const applyLink = () => {
        restoreSelection();
        if (linkUrl) {
            // Apply protocol if missing
            let formattedUrl = linkUrl;
            if (!/^https?:\/\//i.test(linkUrl) && !linkUrl.startsWith('/')) {
                formattedUrl = `https://${linkUrl}`;
            }
            executeCommand('createLink', formattedUrl);
        }
        setShowLinkModal(false);
        setSavedSelection(null);
    };

    const applyColor = (color: string) => {
        restoreSelection();
        executeCommand('foreColor', color);
        setShowColorPicker(false);
    };

    const handleBlockFormat = (tag: string) => {
        executeCommand('formatBlock', `<${tag}>`);
    };

    // Word & Character count
    const cleanText = value.replace(/<[^>]*>/g, '');
    const charCount = cleanText.length;
    const wordCount = cleanText.trim() === '' ? 0 : cleanText.trim().split(/\s+/).length;

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.toolGroup}>
                    <button
                        type="button"
                        onClick={() => executeCommand('bold')}
                        className={`${styles.btn} ${activeStates.bold ? styles.active : ''}`}
                        title="Bold"
                        disabled={isSourceMode}
                    >
                        <FiBold size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => executeCommand('italic')}
                        className={`${styles.btn} ${activeStates.italic ? styles.active : ''}`}
                        title="Italic"
                        disabled={isSourceMode}
                    >
                        <FiItalic size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => executeCommand('underline')}
                        className={`${styles.btn} ${activeStates.underline ? styles.active : ''}`}
                        title="Underline"
                        disabled={isSourceMode}
                    >
                        <FiUnderline size={16} />
                    </button>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <select
                        onChange={(e) => handleBlockFormat(e.target.value)}
                        defaultValue="p"
                        className={styles.select}
                        disabled={isSourceMode}
                    >
                        <option value="p">Paragraph</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="blockquote">Quote</option>
                        <option value="pre">Code Block</option>
                    </select>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup}>
                    <button
                        type="button"
                        onClick={() => executeCommand('insertUnorderedList')}
                        className={`${styles.btn} ${activeStates.listUl ? styles.active : ''}`}
                        title="Bullet List"
                        disabled={isSourceMode}
                    >
                        <FiList size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => executeCommand('justifyLeft')}
                        className={`${styles.btn} ${activeStates.alignLeft ? styles.active : ''}`}
                        title="Align Left"
                        disabled={isSourceMode}
                    >
                        <FiAlignLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => executeCommand('justifyCenter')}
                        className={`${styles.btn} ${activeStates.alignCenter ? styles.active : ''}`}
                        title="Align Center"
                        disabled={isSourceMode}
                    >
                        <FiAlignCenter size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => executeCommand('justifyRight')}
                        className={`${styles.btn} ${activeStates.alignRight ? styles.active : ''}`}
                        title="Align Right"
                        disabled={isSourceMode}
                    >
                        <FiAlignRight size={16} />
                    </button>
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup} style={{ position: 'relative' }}>
                    <button
                        type="button"
                        onClick={handleLinkClick}
                        className={styles.btn}
                        title="Add Link"
                        disabled={isSourceMode}
                    >
                        <FiLink2 size={16} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={saveSelection}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className={styles.btn}
                        title="Text Color"
                        disabled={isSourceMode}
                    >
                        <span className={styles.colorIndicator} />
                    </button>

                    {showColorPicker && (
                        <div className={styles.colorPicker}>
                            {COLORS.map((col) => (
                                <button
                                    key={col.name}
                                    type="button"
                                    onClick={() => applyColor(col.value)}
                                    className={styles.colorOption}
                                    style={{ backgroundColor: col.value.includes('var') ? 'var(--color-accent)' : col.value }}
                                    title={col.name}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.divider} />

                <div className={styles.toolGroup} style={{ marginLeft: 'auto' }}>
                    <button
                        type="button"
                        onClick={() => setIsSourceMode(!isSourceMode)}
                        className={`${styles.btn} ${isSourceMode ? styles.active : ''}`}
                        title={isSourceMode ? 'Visual Editor' : 'HTML Code'}
                    >
                        <FiCode size={16} />
                    </button>
                </div>
            </div>

            <div className={styles.contentWrapper}>
                {isSourceMode ? (
                    <textarea
                        value={sourceValue}
                        onChange={(e) => {
                            setSourceValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        className={styles.sourceArea}
                        placeholder="HTML Source Code"
                    />
                ) : (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        onBlur={handleInput}
                        onKeyUp={checkActiveFormats}
                        onMouseUp={checkActiveFormats}
                        className={styles.editorArea}
                        data-placeholder={placeholder}
                    />
                )}
            </div>

            <div className={styles.footer}>
                <div>
                    <span>{wordCount} words</span>
                    <span style={{ marginLeft: 'var(--space-md)' }}>{charCount} characters</span>
                </div>
                <div>
                    {isSourceMode ? 'HTML Source Mode' : 'Visual Mode'}
                </div>
            </div>

            {showLinkModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Insert Link</h3>
                            <button type="button" onClick={() => setShowLinkModal(false)} className={styles.closeBtn}>
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <input
                                type="text"
                                placeholder="https://example.com"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                className={styles.modalInput}
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') applyLink();
                                }}
                            />
                        </div>
                        <div className={styles.modalFooter}>
                            <button type="button" onClick={() => setShowLinkModal(false)} className={styles.cancelBtn}>
                                Cancel
                            </button>
                            <button type="button" onClick={applyLink} className={styles.saveBtn}>
                                Insert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
