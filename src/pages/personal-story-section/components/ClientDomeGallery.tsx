import { useEffect, useMemo, useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import './ClientDomeGallery.css';

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

interface ClientDomeGalleryProps {
  images: string[];
  fit?: number;
  minRadius?: number;
  maxVerticalRotationDeg?: number;
  segments?: number;
  dragDampening?: number;
  grayscale?: boolean;
}

const ClientDomeGallery = ({
  images,
  fit = 0.8,
  minRadius = 600,
  maxVerticalRotationDeg = 0,
  segments = 34,
  dragDampening = 2,
  grayscale = true
}: ClientDomeGalleryProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef<number | null>(null);

  const items = useMemo(() => {
    const xCols = Array.from({ length: segments }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    const usedImages = Array.from({ length: totalSlots }, (_, i) => images[i % images.length]);

    return coords.map((c, i) => ({
      ...c,
      src: usedImages[i]
    }));
  }, [images, segments]);

  const applyTransform = useCallback((xDeg: number, yDeg: number) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  }, []);

  // Auto-rotate
  useEffect(() => {
    const autoRotate = () => {
      rotationRef.current.y = (rotationRef.current.y + 0.1) % 360;
      applyTransform(rotationRef.current.x, rotationRef.current.y);
      autoRotateRef.current = requestAnimationFrame(autoRotate);
    };
    
    autoRotateRef.current = requestAnimationFrame(autoRotate);
    
    return () => {
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current);
      }
    };
  }, [applyTransform]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const updateSize = () => {
      const cr = root.getBoundingClientRect();
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      
      let radius = minDim * fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      radius = clamp(radius, minRadius, Infinity);
      
      root.style.setProperty('--radius', `${Math.round(radius)}px`);
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none');
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(root);
    updateSize();
    
    return () => ro.disconnect();
  }, [fit, minRadius, grayscale]);

  const computeItemBaseRotation = (offsetX: number, offsetY: number, sizeX: number, sizeY: number) => {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
  };

  return (
    <div
      ref={rootRef}
      className="client-dome-root"
      style={{
        ['--segments-x' as any]: segments,
        ['--segments-y' as any]: segments,
        ['--image-filter' as any]: grayscale ? 'grayscale(1)' : 'none'
      }}
    >
      <div className="client-dome-main">
        <div className="client-dome-stage">
          <div ref={sphereRef} className="client-dome-sphere">
            {items.map((it, i) => {
              const rotation = computeItemBaseRotation(it.x, it.y, it.sizeX, it.sizeY);
              return (
                <div
                  key={`${it.x},${it.y},${i}`}
                  className="client-dome-item"
                  style={{
                    ['--offset-x' as any]: it.x,
                    ['--offset-y' as any]: it.y,
                    ['--item-size-x' as any]: it.sizeX,
                    ['--item-size-y' as any]: it.sizeY,
                    transform: `rotateY(${rotation.rotateY}deg) rotateX(${rotation.rotateX}deg) translateZ(var(--radius))`
                  }}
                >
                  <div className="client-dome-item__image">
                    <img src={it.src} draggable={false} alt="Client logo" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="client-dome-overlay" />
        <div className="client-dome-overlay client-dome-overlay--blur" />
      </div>
    </div>
  );
};

export default ClientDomeGallery;
