import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const PREF_KEY = 'deriv_display_currency';
const RATE_KEY = 'kes_usd_rate';
const RATE_EXPIRY_KEY = 'kes_usd_rate_expiry';
const CACHE_DURATION = 60 * 60 * 1000;
const FALLBACK_KES_RATE = 129.5;

type TCurrencyDisplayContext = {
    showKES: boolean;
    kesRate: number;
    toggleCurrency: () => void;
    convertBalance: (balance: string | number, currency: string) => { amount: string; code: string };
};

const CurrencyDisplayContext = createContext<TCurrencyDisplayContext>({
    showKES: false,
    kesRate: FALLBACK_KES_RATE,
    toggleCurrency: () => undefined,
    convertBalance: (balance, currency) => ({ amount: String(balance), code: currency }),
});

export const CurrencyDisplayProvider = ({ children }: { children: React.ReactNode }) => {
    const [showKES, setShowKES] = useState<boolean>(() => {
        return localStorage.getItem(PREF_KEY) === 'true';
    });
    const [kesRate, setKesRate] = useState<number>(() => {
        const cached = parseFloat(localStorage.getItem(RATE_KEY) ?? '');
        const expiry = parseInt(localStorage.getItem(RATE_EXPIRY_KEY) ?? '0', 10);
        if (!isNaN(cached) && Date.now() < expiry) return cached;
        return FALLBACK_KES_RATE;
    });

    useEffect(() => {
        const cached = parseFloat(localStorage.getItem(RATE_KEY) ?? '');
        const expiry = parseInt(localStorage.getItem(RATE_EXPIRY_KEY) ?? '0', 10);
        if (!isNaN(cached) && Date.now() < expiry) {
            setKesRate(cached);
            return;
        }

        fetch('https://api.exchangerate-api.com/v4/latest/USD')
            .then(res => res.json())
            .then(data => {
                const rate = data?.rates?.KES;
                if (rate && typeof rate === 'number') {
                    setKesRate(rate);
                    localStorage.setItem(RATE_KEY, String(rate));
                    localStorage.setItem(RATE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION));
                }
            })
            .catch(() => {});
    }, []);

    const toggleCurrency = useCallback(() => {
        setShowKES(prev => {
            const next = !prev;
            localStorage.setItem(PREF_KEY, String(next));
            return next;
        });
    }, []);

    const FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD'];

    const convertBalance = useCallback(
        (balance: string | number, currency: string): { amount: string; code: string } => {
            if (!showKES || !FIAT_CURRENCIES.includes((currency ?? '').toUpperCase())) {
                return { amount: String(balance), code: currency };
            }
            const raw = parseFloat(String(balance).replace(/,/g, ''));
            if (isNaN(raw)) return { amount: String(balance), code: currency };
            const kesAmount = raw * kesRate;
            const formatted = new Intl.NumberFormat('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(kesAmount);
            return { amount: formatted, code: 'KES' };
        },
        [showKES, kesRate]
    );

    return (
        <CurrencyDisplayContext.Provider value={{ showKES, kesRate, toggleCurrency, convertBalance }}>
            {children}
        </CurrencyDisplayContext.Provider>
    );
};

export const useCurrencyDisplay = () => useContext(CurrencyDisplayContext);

export default useCurrencyDisplay;
