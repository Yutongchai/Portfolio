import React, { useRef, useEffect, useState } from 'react';

const images = [
    { src: import.meta.env.BASE_URL + 'e.jpg', label: 'Equilibrium', hoverText: 'Creating balance between fun and impact' },
    { src: import.meta.env.BASE_URL + 'i.jpg', label: 'Integrity', hoverText: 'Doing what we say, always' },
    { src: import.meta.env.BASE_URL + 't.jpg', label: 'Teamwork', hoverText: 'Collaboration over competition' },
    { src: import.meta.env.BASE_URL + 'o.jpg', label: 'Honour', hoverText: 'Respecting people and their potential' },
];

// 1. Move AutoFitText OUTSIDE the main component
interface AutoFitTextProps {
    text: string;
    minFontSize?: number;
    maxFontSize?: number;
}

const AutoFitText: React.FC<AutoFitTextProps> = ({ text, minFontSize = 16, maxFontSize = 28 }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [fontSize, setFontSize] = useState(maxFontSize);

    useEffect(() => {
        const fit = () => {
            const span = spanRef.current;
            if (!span) return;
            let size = maxFontSize;
            (span.style as CSSStyleDeclaration).fontSize = size + 'px';
            const parent = span.parentElement as HTMLElement | null;
            if (!parent) return;
            while (size > minFontSize && span.scrollWidth > parent.offsetWidth - 40) {
                size -= 1;
                span.style.fontSize = size + 'px';
            }
            setFontSize(size);
        };
        fit();
        window.addEventListener('resize', fit);
        return () => window.removeEventListener('resize', fit);
    }, [text, minFontSize, maxFontSize]);

    return (
        <span
            ref={spanRef}
            style={{
                fontSize: fontSize + 'px',
                fontStyle: 'italic',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                color: '#fff',
                textAlign: 'center',
                padding: '0 8px',
            }}
        >
            {text}
        </span>
    );
};

const ImageHoverScrollSection = () => {
    return (
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '40px 0' }}>
            <style>{`
        .eito-card-group:hover .eito-hover-overlay {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
        .eito-card-group:hover img {
          transform: scale(1.05);
        }
      `}</style>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 40,
            }}>
                {images.map((img) => (
                    <div
                        key={img.src}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        className="eito-card-group"
                    >
                        <div
                            style={{
                                borderRadius: 12,
                                overflow: 'hidden',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                width: '100%',
                                background: '#23242b',
                                minHeight: 220,
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            <img
                                src={img.src}
                                alt={img.label}
                                style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.4s ease-out' }}
                            />
                            {/* Fixed label at the bottom */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: 24,
                                    left: 0,
                                    width: '100%',
                                    textAlign: 'center',
                                    zIndex: 2,
                                    pointerEvents: 'none',
                                }}
                            >
                                <h2
                                    style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        fontWeight: 800,
                                        fontSize: '2.5rem',
                                        margin: 0,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                                        letterSpacing: '-1px',
                                        lineHeight: 1.1,
                                        background: 'linear-gradient(90deg, #fcb22f 0%, #fff 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {img.label}
                                </h2>
                            </div>
                            {/* Hover overlay */}
                            <div
                                className="eito-hover-overlay"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                    borderRadius: 12,
                                    zIndex: 3,
                                    pointerEvents: 'none',
                                }}
                            >
                                <blockquote
                                    style={{
                                        padding: '16px',
                                        borderLeft: '4px solid #fcb22f',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        margin: 0,
                                        maxWidth: '85%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem', color: '#fcb22f', fontWeight: 700, marginRight: 4 }}>&ldquo;</span>
                                    <AutoFitText text={img.hoverText} />
                                    <span style={{ fontSize: '1.5rem', color: '#fcb22f', fontWeight: 700, marginLeft: 4 }}>&rdquo;</span>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageHoverScrollSection;