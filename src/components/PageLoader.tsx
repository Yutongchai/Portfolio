import React, { useEffect } from 'react';

interface PageLoaderProps {
  onLoaded?: () => void;
  minMs?: number;
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

const PageLoader: React.FC<PageLoaderProps> = ({ onLoaded, minMs = 300 }) => {
  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        // Wait for fonts to be ready (if supported)
        const fontsReady = (document as any).fonts?.ready ?? Promise.resolve();

        // If the app includes a small brand/logo file used in the nav, prefer to wait for it.
        // Consumers can customize by preloading more assets before calling onLoaded.
        await Promise.all([fontsReady, wait(minMs)]);
      } catch (e) {
        // ignore
      }

      if (!mounted) return;
      if (onLoaded) onLoaded();
    };

    run();

    return () => {
      mounted = false;
    };
  }, [onLoaded, minMs]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f1724',
      color: '#fff',
      zIndex: 9999,
      transition: 'opacity 300ms ease',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, margin: '0 auto 12px', borderRadius: 12, background: 'linear-gradient(90deg,#fcb22f,#fffb)', filter: 'blur(6px)', opacity: 0.9 }} />
        <div style={{ fontSize: 14, opacity: 0.9 }}>Loading…</div>
      </div>
    </div>
  );
};

export default PageLoader;
