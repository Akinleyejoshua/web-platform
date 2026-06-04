'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiCopy, FiCheck, FiGlobe, FiMapPin, FiHeart, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';
import { usePageViewTracker, useSectionViewTracker, trackClick } from '@/app/hooks/useAnalyticsTracker';
import styles from './invest.module.css';

export default function InvestPage() {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [currency, setCurrency] = useState<'USD'|'GBP'|'EUR'|'NGN'>('NGN');
    const [isProcessing, setIsProcessing] = useState(false);
    const conversionRates = {
        USD: 1500,
        GBP: 2000,
        EUR: 1600,
        NGN: 1,
    };
    const ngnAmount = parseFloat(amount) * conversionRates[currency];
    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

    // Load Paystack inline script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Section refs for tracking
    const heroRef = useRef<HTMLElement>(null);
    const valuePropsRef = useRef<HTMLDivElement>(null);
    const bankSectionRef = useRef<HTMLElement>(null);
    const paystackRef = useRef<HTMLElement>(null);
    const footerRef = useRef<HTMLElement>(null);

    // Track invest page view
    usePageViewTracker('invest');

    // Track section views
    useSectionViewTracker('invest_hero', heroRef);
    useSectionViewTracker('invest_value_props', valuePropsRef);
    useSectionViewTracker('invest_bank_details', bankSectionRef);
    useSectionViewTracker('invest_paystack', paystackRef);
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
        wireRouting: '',
    };

    const euBank = {
        bankName: 'Clear Junction Limited',
        accountNumber: '40938263',
        accountName: 'Joshua Akinleye',
        currency: 'EUR',
        wireRouting: '',
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

                {/* Paystack Section */}
                <section ref={paystackRef} className={styles.paystackSection}>
                    <h2 className={styles.sectionTitle}>Pay with Paystack</h2>
                    <p className={styles.sectionSubtitle}>
                        Send any amount from any currency. It will be converted to NGN for processing.
                    </p>

                    <div className={styles.paystackCard}>
                        <div className={styles.paystackForm}>
                            <div className={styles.currencyRow}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Amount</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="any"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className={styles.amountInput}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Currency</label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as 'USD'|'GBP'|'EUR'|'NGN')}
                                        className={styles.currencySelect}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="NGN">NGN (₦)</option>
                                    </select>
                                </div>
                            </div>

                            {amount && (
                                <div className={styles.conversionInfo}>
                                    <span>≈ ₦{ngnAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    if (!amount || parseFloat(amount) <= 0 || !paystackPublicKey) return;
                                    setIsProcessing(true);
                                    const finalNgn = Math.round(ngnAmount);
                                    const handler = (window as any).PaystackPop.setup({
                                        key: paystackPublicKey,
                                        email: 'akinleyejoshua.dev@gmail.com',
                                        amount: finalNgn * 100, // Paystack expects amount in kobo
                                        currency: 'NGN',
                                        ref: `INV-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
                                        callback: (response: any) => {
                                            setIsProcessing(false);
                                            trackClick('paystack_payment_success', true);
                                            alert(`Payment successful! Reference: ${response.reference}`);
                                        },
                                        onClose: () => {
                                            setIsProcessing(false);
                                            trackClick('paystack_payment_cancelled', true);
                                        },
                                    });
                                    handler.openIframe();
                                    trackClick('paystack_manual_payment', true);
                                }}
                                disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
                                className={styles.paystackBtn}
                            >
                                <FiZap size={18} />
                                {isProcessing ? 'Processing...' : `Pay ₦${amount ? Math.round(ngnAmount).toLocaleString() : '0'} with Paystack`}
                            </button>

                            <p className={styles.paystackNote}>
                                Secure inline checkout powered by Paystack. Your payment is processed securely without leaving this page.
                            </p>
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
