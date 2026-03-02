import React, { useEffect, useState } from 'react';

interface PageLoaderProps {
  onLoaded?: () => void;
  minMs?: number;
  imagesToPreload?: string[];
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const loadImage = (src?: string) => {
  return new Promise<void>((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.src = src;
    if (img.complete) return resolve();
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
};

const PageLoader: React.FC<PageLoaderProps> = ({
  onLoaded,
  minMs = 400,
  imagesToPreload = [],
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();
        const imageLoads = imagesToPreload.map(loadImage);
        await Promise.all([fontsReady, wait(minMs), ...imageLoads]);
      } catch (e) {
        // ignore
      }

      if (!mounted) return;

      // Trigger fade-out, then notify parent after transition completes
      setVisible(false);
      setTimeout(() => {
        if (mounted && onLoaded) onLoaded();
      }, 350); // matches transition duration below
    };

    run();

    return () => {
      mounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f1724',
        color: '#fff',
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 350ms ease',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Pulsing logo blob */}
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #fcb22f, #ff6b6b)',
            animation: 'pulse 1.4s ease-in-out infinite',
          }}
        />
        <div style={{ fontSize: 14, letterSpacing: '0.05em', opacity: 0.7 }}>
          Loading…
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.9; transform: scale(1); box-shadow: 0 0 0 0 rgba(252,178,47,0.4); }
          50% { opacity: 1; transform: scale(1.08); box-shadow: 0 0 0 12px rgba(252,178,47,0); }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;