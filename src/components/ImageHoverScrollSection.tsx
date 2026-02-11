import React, { useRef, useEffect, useState } from 'react';

const images = [
    { src: import.meta.env.BASE_URL + 'e.jpg', label: 'Equilibrium', hoverText: 'Turning fun into meaningful impact' },
    { src: import.meta.env.BASE_URL + 'i.jpg', label: 'Integrity', hoverText: 'Turning values into trust' },
    { src: import.meta.env.BASE_URL + 't.jpg', label: 'Teamwork', hoverText: 'Turning collaboration into success' },
    { src: import.meta.env.BASE_URL + 'o.jpg', label: 'Honour', hoverText: 'Turning promises into real results' },
];

const ImageHoverScrollSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setActiveIndex(index);
    };

    const activeImage = images[activeIndex];

    return (
        <div style={{
            width: '100%',
            background: 'transparent',
            padding: '20px 20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>{`
                .puzzle-piece {
                    width: 120px;
                    height: 120px;
                    position: relative;
                    cursor: pointer;
                    transition: transform 0.3s ease, opacity 0.3s ease;
                    opacity: 0.6;
                }
                .puzzle-piece.active {
                    opacity: 1;
                    transform: scale(1.15);
                }
                .puzzle-piece:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }
                .puzzle-piece::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: inherit;
                    border-radius: 50%;
                    border: 4px solid #f68921;
                }
                .nav-button {
                    width: 60px;
                    height: 60px;
                    background: #f68921;
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                .nav-button:hover {
                    background: #e67810;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.4);
                }
            `}</style>

            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* Main Content Area */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', marginBottom: '60px' }}>
                    {/* Left Arrow */}
                    <button onClick={prevSlide} className="nav-button">
                        ←
                    </button>

                    {/* Center Content Card with Circular Image */}
                    <div style={{
                        flex: 1,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '400px'
                    }}>
                        {/* Circular Image on Left */}
                        <div style={{
                            width: '280px',
                            height: '280px',
                            borderRadius: '50%',
                            border: '8px solid #f68921',
                            overflow: 'hidden',
                            position: 'relative',
                            zIndex: 2,
                            flexShrink: 0,
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                        }}>
                            <img
                                src={activeImage.src}
                                alt={activeImage.label}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>

                        {/* White Content Card */}
                        <div style={{
                            flex: 1,
                            background: 'white',
                            borderRadius: '32px',
                            padding: '48px 48px 48px 180px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                            marginLeft: '-120px',
                            zIndex: 1,
                            minHeight: '320px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <h3 style={{
                                fontSize: '2.5rem',
                                fontWeight: 900,
                                color: '#153462',
                                marginBottom: '24px',
                                textTransform: 'capitalize'
                            }}>
                                {activeImage.label}
                            </h3>
                            <p style={{
                                fontSize: '1.25rem',
                                color: '#4a5568',
                                lineHeight: 1.8,
                                marginBottom: '32px'
                            }}>
                                {activeImage.hoverText}
                            </p>
                            <button style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#153462',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: 0
                            }}>
                                Explore →
                            </button>
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button onClick={nextSlide} className="nav-button">
                        →
                    </button>
                </div>

                {/* Bottom Puzzle Pieces / Circles */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '40px',
                    flexWrap: 'wrap'
                }}>
                    {images.map((img, index) => (
                        <div
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`puzzle-piece ${index === activeIndex ? 'active' : ''}`}
                            style={{
                                backgroundImage: `url(${img.src})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageHoverScrollSection;