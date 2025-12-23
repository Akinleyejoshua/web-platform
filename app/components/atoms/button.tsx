import React from 'react';
import styles from './button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    href?: string;
}

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    href,
    ...props
}: ButtonProps) {
    const classes = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

    if (href) {
        return (
            <a href={href} className={classes}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
