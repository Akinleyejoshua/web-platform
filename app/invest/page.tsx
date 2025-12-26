'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCopy, FiCheck, FiGlobe, FiMapPin, FiHeart, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';
import { usePageViewTracker, useSectionViewTracker, trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './invest.module.css';

export default function InvestPage() {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Section refs for tracking
    const heroRef = useRef<HTMLElement>(null);
    const valuePropsRef = useRef<HTMLDivElement>(null);
    const bankSectionRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    // Track invest page view
    usePageViewTracker('invest');

    // Track section views
    useSectionViewTracker('invest_hero', heroRef);
    useSectionViewTracker('invest_value_props', valuePropsRef);
    useSectionViewTracker('invest_bank_details', bankSectionRef);
    useSectionViewTracker('invest_footer', footerRef);

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        trackClick(`invest_copy_${field}`, true);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const localBank = {
        bankName: 'Access Bank',
        accountNumber: '1485948764',
        accountName: 'Joshua Akinleye Moyinoluwa',
    };

    const internationalBank = {
        bankName: 'Lead Bank',
        accountNumber: '218715082180',
        wireRouting: '101019644',
        accountName: 'Joshua Akinleye',
        currency: 'USD',
    };

    const ukBank = {
        bankName: 'Clear Junction Limited',
        accountNumber: '40938263',
        accountName: 'Joshua Akinleye',
        currency: 'GBP',
    };

    const euBank = {
        bankName: 'Clear Junction Limited',
        accountNumber: '40938263',
        accountName: 'Joshua Akinleye',
        currency: 'EUR',
    };

    return (
        <div className={styles.page}>
            {/* Background Elements */}
            <div className={styles.bgGradient} />
            <div className={styles.bgGrid} />

            <div className={styles.container}>
                {/* Back Button */}
                <Link href="/" className={styles.backBtn} onClick={() => trackClick('invest_back_button', true)}>
                    <FiArrowLeft size={18} />
                    Back to Portfolio
                </Link>

                {/* Hero Section */}
                <header ref={heroRef} className={styles.hero}>
                    <div className={styles.badge}>
                        <FiTrendingUp size={14} />
                        Invest in Innovation
                    </div>
                    <h1 className={styles.title}>
                        Support the <span className={styles.titleAccent}>Future</span> of Technology
                    </h1>
                    <p className={styles.subtitle}>
                        Your investment fuels groundbreaking projects in AI, web development, and cutting-edge technology solutions.
                        Join a growing community of forward-thinking supporters who believe in building tomorrow, today.
                    </p>
                </header>

                {/* Value Propositions */}
                <div ref={valuePropsRef} className={styles.valueProps}>
                    <div className={styles.valueProp}>
                        <div className={styles.valueIcon}>
                            <FiZap size={20} />
                        </div>
                        <h3>Direct Impact</h3>
                        <p>100% of your contribution goes directly into developing innovative solutions</p>
                    </div>
                    <div className={styles.valueProp}>
                        <div className={styles.valueIcon}>
                            <FiShield size={20} />
                        </div>
                        <h3>Transparency</h3>
                        <p>Regular updates on project progress and how your investment is utilized</p>
                    </div>
                    <div className={styles.valueProp}>
                        <div className={styles.valueIcon}>
                            <FiHeart size={20} />
                        </div>
                        <h3>Community</h3>
                        <p>Join an exclusive network of investors and early adopters</p>
                    </div>
                </div>

                {/* Bank Details Section */}
                <section ref={bankSectionRef} className={styles.bankSection}>
                    <h2 className={styles.sectionTitle}>Investment Options</h2>
                    <p className={styles.sectionSubtitle}>
                        Choose your preferred payment method. All transactions are secure and appreciated.
                    </p>

                    <div className={styles.cardsGrid}>
                        {/* Local Bank Card */}
                        <div className={styles.bankCard}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <FiMapPin size={24} />
                                </div>
                                <div>
                                    <h3 className={styles.cardTitle}>Local Transfer</h3>
                                    <span className={styles.cardBadge}>NGN</span>
                                </div>
                            </div>

                            <p className={styles.cardDesc}>
                                For transfers within Nigeria using Naira (₦)
                            </p>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Bank Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{localBank.bankName}</span>
                                        <button
                                            onClick={() => copyToClipboard(localBank.bankName, 'localBank')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'localBank' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Number</span>
                                    <div className={styles.detailValue}>
                                        <span className={styles.highlight}>{localBank.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(localBank.accountNumber, 'localAcc')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'localAcc' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{localBank.accountName}</span>
                                        <button
                                            onClick={() => copyToClipboard(localBank.accountName, 'localName')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'localName' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* International Bank Card */}
                        <div className={`${styles.bankCard} ${styles.internationalCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <FiGlobe size={24} />
                                </div>
                                <div>
                                    <h3 className={styles.cardTitle}>International Wire</h3>
                                    <span className={styles.cardBadge}>USD</span>
                                </div>
                            </div>

                            <p className={styles.cardDesc}>
                                For international transfers in US Dollars ($)
                            </p>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Bank Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{internationalBank.bankName}</span>
                                        <button
                                            onClick={() => copyToClipboard(internationalBank.bankName, 'intBank')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'intBank' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Number</span>
                                    <div className={styles.detailValue}>
                                        <span className={styles.highlight}>{internationalBank.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(internationalBank.accountNumber, 'intAcc')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'intAcc' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Wire Routing</span>
                                    <div className={styles.detailValue}>
                                        <span className={styles.highlight}>{internationalBank.wireRouting}</span>
                                        <button
                                            onClick={() => copyToClipboard(internationalBank.wireRouting, 'intRouting')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'intRouting' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{internationalBank.accountName}</span>
                                        <button
                                            onClick={() => copyToClipboard(internationalBank.accountName, 'intName')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'intName' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UK Bank Card */}
                        <div className={`${styles.bankCard} ${styles.internationalCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <FiGlobe size={24} />
                                </div>
                                <div>
                                    <h3 className={styles.cardTitle}>UK Transfer</h3>
                                    <span className={styles.cardBadge}>GBP</span>
                                </div>
                            </div>

                            <p className={styles.cardDesc}>
                                For transfers from the United Kingdom in British Pounds (£)
                            </p>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Bank Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{ukBank.bankName}</span>
                                        <button
                                            onClick={() => copyToClipboard(ukBank.bankName, 'ukBank')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'ukBank' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Number</span>
                                    <div className={styles.detailValue}>
                                        <span className={styles.highlight}>{ukBank.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(ukBank.accountNumber, 'ukAcc')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'ukAcc' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{ukBank.accountName}</span>
                                        <button
                                            onClick={() => copyToClipboard(ukBank.accountName, 'ukName')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'ukName' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EU Bank Card */}
                        <div className={`${styles.bankCard} ${styles.internationalCard}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <FiGlobe size={24} />
                                </div>
                                <div>
                                    <h3 className={styles.cardTitle}>EU Transfer</h3>
                                    <span className={styles.cardBadge}>EUR</span>
                                </div>
                            </div>

                            <p className={styles.cardDesc}>
                                For transfers from the European Union in Euros (€)
                            </p>

                            <div className={styles.detailsGrid}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Bank Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{euBank.bankName}</span>
                                        <button
                                            onClick={() => copyToClipboard(euBank.bankName, 'euBank')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'euBank' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Number</span>
                                    <div className={styles.detailValue}>
                                        <span className={styles.highlight}>{euBank.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(euBank.accountNumber, 'euAcc')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'euAcc' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Account Name</span>
                                    <div className={styles.detailValue}>
                                        <span>{euBank.accountName}</span>
                                        <button
                                            onClick={() => copyToClipboard(euBank.accountName, 'euName')}
                                            className={styles.copyBtn}
                                        >
                                            {copiedField === 'euName' ? <FiCheck size={14} /> : <FiCopy size={14} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Thank You Message */}
                <footer ref={footerRef} className={styles.footer}>
                    <div className={styles.thankYou}>
                        <FiHeart className={styles.heartIcon} size={24} />
                        <h3>Thank You for Your Support</h3>
                        <p>
                            Every contribution, no matter the size, makes a difference.
                            Your belief in this vision helps turn innovative ideas into reality.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
