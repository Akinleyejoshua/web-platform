'use client';

import { useState, useEffect } from 'react';

export function useReadOnly() {
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        const checkReadOnly = () => {
            if (typeof document === 'undefined') return false;
            const match = document.cookie.match(/admin_read_only=true/);
            return !!match;
        };
        setIsReadOnly(checkReadOnly());
    }, []);

    return isReadOnly;
}
