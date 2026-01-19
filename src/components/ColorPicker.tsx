


import { useRef } from 'react';

import { PALETTE } from '../core/palette';

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {

    const inputRef = useRef<HTMLInputElement>(null);

    const handleCustomClick = () => {
        // Trigger the hidden input
        inputRef.current?.click();
    };

    return (
        <div className="color-picker">
            <div className="flex flex-wrap gap-xs" style={{ maxWidth: 200 }}>
                {PALETTE.map(c => (
                    <button
                        key={c}
                        onClick={() => onChange(c)}
                        title={c}
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: c,
                            border: color === c ? '2px solid var(--color-text-main)' : '1px solid var(--color-border)',
                            cursor: 'pointer',
                            transition: 'transform 0.1s',
                            boxShadow: color === c ? '0 0 0 1px var(--color-bg-card)' : 'none'
                        }}
                    />
                ))}

                {/* Custom Color Trigger */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={handleCustomClick}
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                            border: '1px solid var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Custom Color"
                    >
                    </button>
                    <input
                        ref={inputRef}
                        type="color"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        style={{
                            position: 'absolute',
                            opacity: 0,
                            pointerEvents: 'none',
                            width: 0, height: 0
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
