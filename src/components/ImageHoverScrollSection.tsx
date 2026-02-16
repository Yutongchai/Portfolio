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

const AutoFitText: React.FC<AutoFitTextProps> = ({ text, minFontSize = 14, maxFontSize = 24 }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [fontSize, setFontSize] = useState(maxFontSize);

    useEffect(() => {
        const span = spanRef.current;
        if (!span) return;

        const parent = span.parentElement as HTMLElement | null;
        if (!parent) return;

        const fitsAt = (size: number) => {
            span.style.fontSize = size + 'px';
            // Give browser a tick to compute layout if necessary
            return span.scrollWidth <= Math.max(8, parent.clientWidth - 12);
        };

        // Binary search to find best size between min and max
        const compute = () => {
            let low = minFontSize;
            let high = maxFontSize;
            let best = minFontSize;

            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                if (fitsAt(mid)) {
                    best = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }

            // Apply best size
            span.style.fontSize = best + 'px';
            setFontSize(best);
        };

        // Run once initially
        compute();

        // Recompute on resize using ResizeObserver for reliability on image/layout changes
        const RO = (window as any).ResizeObserver;
        let ro: any = null;
        if (RO) {
            try {
                ro = new RO(() => compute());
                ro.observe(parent);
            } catch (err) {
                // ignore if observer cannot be attached
                ro = null;
            }
        }

        const handleWin = () => compute();
        window.addEventListener('orientationchange', handleWin);

        return () => {
            window.removeEventListener('orientationchange', handleWin);
            if (ro && typeof ro.disconnect === 'function') ro.disconnect();
        };
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
                padding: '0 4px',
            }}
        >
            {text}
        </span>
    );
};

const ImageHoverScrollSection = () => {
    return (
        <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
            <style>{`
                .eito-3d-grid { perspective: 1200px; }
                .eito-card-group { transform-style: preserve-3d; }
                
                /* On Mobile: click to show overlay. On Desktop: hover */
                .eito-card-group:hover .eito-hover-overlay,
                .eito-card-group:active .eito-hover-overlay { opacity: 1 !important; pointer-events: auto !important; }
                
                .eito-card-group:hover img { transform: scale(1.03); }

                @keyframes float-bounce-3d {
                  0% { transform: translate3d(0, -6px, 0) rotateX(0deg); }
                  50% { transform: translate3d(0, 6px, 6px) rotateX(1deg); }
                  100% { transform: translate3d(0, -6px, 0) rotateX(0deg); }
                }

                .eito-card-inner { will-change: transform, opacity; transform-style: preserve-3d; }
                
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

                /* Mobile-specific adjustments */
                @media (max-width: 768px) {
                    .eito-3d-grid {
                        display: flex !important;
                        flex-direction: row !important;
                        overflow-x: auto !important;
                        scroll-snap-type: x mandatory !important;
                        gap: 16px !important;
                        padding-bottom: 20px !important;
                    }
                    .eito-card-group {
                        min-width: 85vw !important;
                        scroll-snap-align: center !important;
                    }
                }
            `}</style>

            <div className="eito-3d-grid scrollbar-hide" style={{
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
                            if (window.innerWidth <= 768) return; // Disable tilt on mobile
                            const card = e.currentTarget as HTMLElement;
                            const imgEl = card.querySelector('img') as HTMLElement | null;
                            const shadowEl = card.querySelector('.eito-shadow') as HTMLElement | null;
                            const inner = card.querySelector('.eito-card-inner') as HTMLElement | null;
                            if (!imgEl) return;
                            const rect = card.getBoundingClientRect();
                            const x = (e.clientX - rect.left) / rect.width;
                            const y = (e.clientY - rect.top) / rect.height;
                            const rotateY = (x - 0.5) * 14;
                            const rotateX = (0.5 - y) * 10;
                            imgEl.style.transform = `translateZ(18px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
                            if (shadowEl) {
                                const sx = (x - 0.5) * 40;
                                const sy = Math.abs(y - 0.5) * 12 + 6;
                                const blur = Math.max(8, 22 - Math.abs((x - 0.5) * 12));
                                shadowEl.style.transform = `translate3d(${sx}px, ${sy}px, 0) scale(1.02)`;
                                shadowEl.style.opacity = '0.95';
                                shadowEl.style.filter = `blur(${blur}px)`;
                            }
                            if (inner) inner.style.boxShadow = '0 20px 50px rgba(0,0,0,0.28)';
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
                            <div
                                className="eito-shadow"
                                style={{
                                    position: 'absolute',
                                    left: 12, right: 12, top: '40%', height: '48%',
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
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: window.innerWidth <= 768 ? 16 : 24,
                                    left: 0, width: '100%', textAlign: 'center', zIndex: 2, pointerEvents: 'none',
                                }}
                            >
                                <h2
                                    style={{
                                        fontFamily: 'Sora, Space Grotesk, sans-serif',
                                        fontWeight: 800,
                                        fontSize: window.innerWidth <= 768 ? '1.8rem' : '2.5rem',
                                        margin: 0,
                                        textShadow: '0 2px 8px rgba(0,0,0,0.35)',
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
                            <div
                                className="eito-hover-overlay"
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, width: '100%', height: '100%',
                                    background: 'rgba(0,0,0,0.75)',
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
                                        padding: '12px',
                                        borderLeft: '4px solid #fcb22f',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                        margin: 0,
                                        maxWidth: '90%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <span style={{ fontSize: '1.2rem', color: '#fcb22f', fontWeight: 700 }}>&ldquo;</span>
                                    <AutoFitText text={img.hoverText} />
                                    <span style={{ fontSize: '1.2rem', color: '#fcb22f', fontWeight: 700 }}>&rdquo;</span>
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