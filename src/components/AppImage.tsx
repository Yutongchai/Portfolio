import React, { useState, useEffect, useRef } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

function Image({
  src,
  alt = "Image Name",
  className = "",
  priority = false,
  loading,
  ...props
}: ImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(priority ? src : undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
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

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = "/assets/images/no_image.png";
    setHasError(true);
    setIsLoaded(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading || (priority ? 'eager' : 'lazy')}
        decoding="async"
        {...props}
      />
    </div>
  );
}

export default Image;