import React, { useRef, useEffect, useState } from 'react';

const images = [
    { src: import.meta.env.BASE_URL + 'e.jpg', label: 'Equilibrium', hoverText: 'Turning fun into meaningful impact' },
    { src: import.meta.env.BASE_URL + 'i.jpg', label: 'Integrity', hoverText: 'Turning values into trust' },
    { src: import.meta.env.BASE_URL + 't.jpg', label: 'Teamwork', hoverText: 'Turning collaboration into success' },
    { src: import.meta.env.BASE_URL + 'o.jpg', label: 'Honour', hoverText: 'Turning promises into real results' },
];

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
        <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '24px 0' }}>
            <style>{`
                .eito-3d-grid { perspective: 1200px; }
                .eito-card-group { transform-style: preserve-3d; }
                .eito-card-group:hover .eito-hover-overlay { opacity: 1 !important; pointer-events: auto !important; }
                .eito-card-group:hover img { /* keep a subtle scale on hover; tilt handled by mouse */ transform: scale(1.03); }

                /* gentle floating/bounce in 3D space */
                @keyframes float-bounce-3d {
                  0% { transform: translate3d(0, -6px, 0) rotateX(0deg) rotateY(0deg); }
                  50% { transform: translate3d(0, 6px, 6px) rotateX(1deg) rotateY(-1deg); }
                  100% { transform: translate3d(0, -6px, 0) rotateX(0deg) rotateY(0deg); }
                }

                .eito-card-inner { will-change: transform, opacity; transform-style: preserve-3d; }
            `}</style>
            <div className="eito-3d-grid" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 32,
            }}>
                {images.map((img, idx) => (
                    <div
                        key={img.src}
                        className="eito-card-group"
                        style={{
                            cursor: 'pointer',
                            padding: 8,
                            borderRadius: 18,
                            boxSizing: 'border-box',
                            border: '8px solid #6f9185',
                            backgroundClip: 'padding-box',
                            perspective: 1200,
                        }}
                        onMouseMove={(e) => {
                            const card = e.currentTarget as HTMLElement;
                            const imgEl = card.querySelector('img') as HTMLElement | null;
                            const shadowEl = card.querySelector('.eito-shadow') as HTMLElement | null;
                            const inner = card.querySelector('.eito-card-inner') as HTMLElement | null;
                            if (!imgEl) return;
                            const rect = card.getBoundingClientRect();
                            const x = (e.clientX - rect.left) / rect.width;
                            const y = (e.clientY - rect.top) / rect.height;
                            const rotateY = (x - 0.5) * 14; // horizontal tilt
                            const rotateX = (0.5 - y) * 10; // vertical tilt
                            imgEl.style.transform = `translateZ(18px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                            if (shadowEl) {
                                const sx = (x - 0.5) * 40; // shadow offset x
                                const sy = Math.abs(y - 0.5) * 12 + 6; // shadow offset y
                                const blur = Math.max(8, 22 - Math.abs((x - 0.5) * 12));
                                shadowEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(1.02)`;
                                shadowEl.style.opacity = '0.95';
                                shadowEl.style.filter = `blur(${blur}px)`;
                            }
                            if (inner) {
                                inner.style.boxShadow = '0 20px 50px rgba(0,0,0,0.28)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            const card = e.currentTarget as HTMLElement;
                            const imgEl = card.querySelector('img') as HTMLElement | null;
                            const shadowEl = card.querySelector('.eito-shadow') as HTMLElement | null;
                            const inner = card.querySelector('.eito-card-inner') as HTMLElement | null;
                            if (imgEl) imgEl.style.transform = 'translateZ(0px) rotateX(0deg) rotateY(0deg) scale(1)';
                            if (shadowEl) {
                                shadowEl.style.transform = 'translate3d(0px, 18px, 0) scale(1)';
                                shadowEl.style.opacity = '0.6';
                                shadowEl.style.filter = 'blur(18px)';
                            }
                            if (inner) inner.style.boxShadow = '0 6px 24px rgba(0,0,0,0.12)';
                        }}
                    >
                        <div
                            className="eito-card-inner"
                            style={{
                                position: 'relative',
                                borderRadius: 12,
                                overflow: 'hidden',
                                boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                                width: '100%',
                                background: '#23242b',
                                minHeight: 220,
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                animation: `float-bounce-3d ${6 + (idx % 3)}s ease-in-out ${idx * 0.12}s infinite alternate`,
                            }}
                        >
                            {/* soft projected shadow to enhance 3Dness */}
                            <div
                                className="eito-shadow"
                                style={{
                                    position: 'absolute',
                                    left: 12,
                                    right: 12,
                                    top: '40%',
                                    height: '48%',
                                    borderRadius: 12,
                                    background: 'radial-gradient(closest-side, rgba(0,0,0,0.42), rgba(0,0,0,0.06))',
                                    filter: 'blur(18px)',
                                    transform: 'translate3d(0px, 18px, 0) scale(1)',
                                    transition: 'transform 0.18s ease, opacity 0.18s ease, filter 0.18s ease',
                                    zIndex: 1,
                                    pointerEvents: 'none',
                                }}
                            />
                            <img
                                src={img.src}
                                alt={img.label}
                                style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.28s cubic-bezier(.2,.9,.2,1)', position: 'relative', zIndex: 2 }}
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
                                        fontFamily: 'Sora, Space Grotesk, sans-serif',
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
                                    background: 'rgba(0,0,0,0.64)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.25s ease',
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