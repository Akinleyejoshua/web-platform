import React from 'react';
import styles from './grid.module.css';

type GridCols = 2 | 3 | 4 | 'auto-fit' | 'auto-fill';

interface GridProps {
    cols?: GridCols;
    children: React.ReactNode;
    className?: string;
}

const colsMap: Record<GridCols, string> = {
    2: styles.cols2,
    3: styles.cols3,
    4: styles.cols4,
    'auto-fit': styles.autoFit,
    'auto-fill': styles.autoFill,
};

export function Grid({ cols = 'auto-fit', children, className = '' }: GridProps) {
    return (
        <div className={`${styles.grid} ${colsMap[cols]} ${className}`.trim()}>
            {children}
        </div>
    );
}
