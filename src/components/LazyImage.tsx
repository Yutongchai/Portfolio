import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> {
  src: string;
  alt: string;
  priority?: boolean;
  placeholderColor?: string;
}

const LazyImage = ({ 
  src, 
  alt, 
  priority = false, 
  placeholderColor = '#1a1a1a',
  className = '',
  ...props 
}: LazyImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(priority ? src : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      // Priority images load immediately
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder background */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ backgroundColor: placeholderColor }}
      >
        {/* Optional shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" 
             style={{ 
               backgroundSize: '200% 100%',
               animation: 'shimmer 2s infinite'
             }} 
        />
      </div>

      {/* Actual image */}
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...props}
      />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default LazyImage;
