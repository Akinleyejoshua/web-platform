'use client';

import { useState, useEffect } from 'react';

export function useReadOnly() {
    const [isReadOnly, setIsReadOnly] = useState(false);
    if (typeof window === 'undefined') {
        return false; // Return false during server-side rendering
    } else {
        useEffect(() => {
            const checkReadOnly = () => {
                if (typeof document === 'undefined') return false;
                const match = document.cookie.match(/admin_read_only=true/);
                return !!match;
            };
            setIsReadOnly(checkReadOnly());
        }, [location.pathname]); // Re-run when the pathname changes
    }


    return isReadOnly;
}
