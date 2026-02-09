// =========================================
// FILE: SubscriptionGuard.jsx
// Subscription Access Guard for React App (JavaScript version)
// =========================================

import React, { useState, useEffect } from 'react';

// Configuration
const CONFIG = {
    // 🔧 LOCAL: 'http://localhost:5000/api/access/check'
    // 🌐 PRODUCTION:
    API_URL: 'https://payment.nuansasolution.id/api/access/check',
    PAYMENT_URL: 'https://payment.nuansasolution.id/',
    SESSION_EXPIRY_MS: 60 * 60 * 1000, // 1 hour
    STORAGE_KEY_PREFIX: 'ns_access_',
    DEFAULT_FEATURE_SLUG: 'surat-kuasa'
};

const SubscriptionGuard = ({ children, featureSlug = CONFIG.DEFAULT_FEATURE_SLUG }) => {
    const [isVerified, setIsVerified] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const storageKey = `${CONFIG.STORAGE_KEY_PREFIX}${featureSlug}`;

    // Check existing session on mount
    useEffect(() => {
        const checkSession = () => {
            try {
                const data = localStorage.getItem(storageKey);
                if (!data) {
                    setIsVerified(false);
                    return;
                }

                const session = JSON.parse(data);

                // Check if session is expired
                if (session.expiresAt && Date.now() > session.expiresAt) {
                    localStorage.removeItem(storageKey);
                    setIsVerified(false);
                    return;
                }

                setIsVerified(true);
            } catch (err) {
                localStorage.removeItem(storageKey);
                setIsVerified(false);
            }
        };

        checkSession();
    }, [storageKey]);

    // Normalize phone number
    const normalizePhone = (phoneNumber) => {
        let cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '62' + cleaned.slice(1);
        } else if (!cleaned.startsWith('62')) {
            cleaned = '62' + cleaned;
        }
        return cleaned;
    };

    // Handle verification
    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: normalizePhone(phone),
                    feature_slug: featureSlug
                })
            });

            const result = await response.json();

            if (result.status === true) {
                // Save session
                const session = {
                    phone: phone,
                    feature: featureSlug,
                    expiredAt: result.expired_at,
                    createdAt: Date.now(),
                    expiresAt: Date.now() + CONFIG.SESSION_EXPIRY_MS
                };
                localStorage.setItem(storageKey, JSON.stringify(session));
                setIsVerified(true);
            } else {
                setError(result.message || 'Subscription tidak aktif');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    // Still checking session
    if (isVerified === null) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
                <div style={{ width: '48px', height: '48px', border: '3px solid #e2e8f0', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Not verified - show verification form
    if (!isVerified) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', padding: '16px' }}>
                <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '32px', width: '100%', maxWidth: '400px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <span style={{ display: 'inline-block', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: 'white', fontSize: '11px', fontWeight: 'bold', padding: '4px 12px', borderRadius: '9999px', textTransform: 'uppercase', marginBottom: '16px' }}>
                            {featureSlug.replace(/-/g, ' ')}
                        </span>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Verifikasi Akses</h1>
                        <p style={{ color: '#6b7280' }}>Masukkan nomor WhatsApp untuk melanjutkan</p>
                    </div>

                    {error && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleVerify}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                Nomor WhatsApp
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>+62</span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                    placeholder="8123456789"
                                    style={{ width: '100%', paddingLeft: '48px', paddingRight: '16px', paddingTop: '12px', paddingBottom: '12px', border: '1px solid #d1d5db', borderRadius: '12px', outline: 'none', boxSizing: 'border-box' }}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', color: 'white', fontWeight: '600', padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.5 : 1 }}
                        >
                            {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
                        </button>
                    </form>

                    <div style={{ marginTop: '16px' }}>
                        <a
                            href={CONFIG.PAYMENT_URL}
                            style={{ display: 'block', width: '100%', textAlign: 'center', background: '#f3f4f6', color: '#374151', fontWeight: '500', padding: '12px 24px', borderRadius: '12px', textDecoration: 'none', boxSizing: 'border-box' }}
                        >
                            Daftar Berlangganan
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Verified - render children
    return <>{children}</>;
};

export default SubscriptionGuard;

// =========================================
// UTILITY: Logout function to clear session
// =========================================
export const clearSubscriptionSession = (featureSlug = 'surat-kuasa') => {
    localStorage.removeItem(`${CONFIG.STORAGE_KEY_PREFIX}${featureSlug}`);
};

// =========================================
// UTILITY: Check if has valid session
// =========================================
export const hasSubscriptionSession = (featureSlug = 'surat-kuasa') => {
    try {
        const data = localStorage.getItem(`${CONFIG.STORAGE_KEY_PREFIX}${featureSlug}`);
        if (!data) return false;

        const session = JSON.parse(data);
        return session.expiresAt && Date.now() < session.expiresAt;
    } catch (err) {
        return false;
    }
};
