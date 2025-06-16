import React from 'react';
import styles from './style.module.scss';

export type ReactWindowModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    showOverlay?: boolean;
    style?: React.CSSProperties;
    overlayStyle?: React.CSSProperties;
};

export function ReactWindowModal({
    isOpen,
    onClose,
    title,
    children,
    className = '',
    showOverlay = true,
    style = {},
    overlayStyle = {},
}: ReactWindowModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className={`${styles.overlay} ${showOverlay ? '' : styles.noOverlay}`}
            style={overlayStyle}
            onClick={onClose}>
            <div className={`${styles.modal} ${className}`} style={style} onClick={(e) => {
                e.preventDefault();
                e.stopPropagation()
            }}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label="Đóng modal"
                >
                    <svg
                        className={styles.closeIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {title && <h2 className={styles.title}>{title}</h2>}

                <div className={styles.content}>{children}</div>
            </div>
        </div>
    );
};
