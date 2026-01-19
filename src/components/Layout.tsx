import { type ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="layout" style={{
            minHeight: '100vh',
            background: 'var(--color-bg-page)',
            color: 'var(--color-text-main)',
            fontFamily: 'Inter, sans-serif'
        }}>
            <main style={{ padding: 'var(--spacing-md)' }}>
                {children}
            </main>
        </div>
    );
}
