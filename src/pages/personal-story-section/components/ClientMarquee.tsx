"use client";

import React from "react"

import { useEffect, useRef, useState, useCallback } from "react";

interface ClientMarqueeProps {
  logos: string[];
  autoScrollSpeed?: number;
  pauseOnHover?: boolean;
}

const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 80;
const LOGO_GAP = 48;
const ITEM_WIDTH = LOGO_WIDTH + LOGO_GAP;

const ClientMarquee = ({
  logos,
  autoScrollSpeed = 0.5,
  pauseOnHover = true,
}: ClientMarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStartRef = useRef({ x: 0, offset: 0 });

  // Triple the logos for seamless infinite loop
  const loopedLogos = [...logos, ...logos, ...logos];
  const totalWidth = logos.length * ITEM_WIDTH;

  const updateTrackPosition = useCallback(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
    }
  }, []);

  const normalizeOffset = useCallback(() => {
    if (offsetRef.current >= totalWidth * 2) {
      offsetRef.current -= totalWidth;
    } else if (offsetRef.current < 0) {
      offsetRef.current += totalWidth;
    }
  }, [totalWidth]);

  // Auto-scroll animation
  useEffect(() => {
    const animate = () => {
      if (!isDragging && !isPaused) {
        // Apply velocity decay when manually scrolling stops
        if (Math.abs(velocityRef.current) > 0.1) {
          offsetRef.current += velocityRef.current;
          velocityRef.current *= 0.95; // Decay
        } else {
          velocityRef.current = 0;
          offsetRef.current += autoScrollSpeed;
        }

        normalizeOffset();
        updateTrackPosition();
      } else if (isDragging && Math.abs(velocityRef.current) > 0.1) {
        // Continue momentum during pause
        offsetRef.current += velocityRef.current;
        velocityRef.current *= 0.92;
        normalizeOffset();
        updateTrackPosition();
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isDragging, isPaused, autoScrollSpeed, normalizeOffset, updateTrackPosition]);

  // Mouse drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, offset: offsetRef.current };
      velocityRef.current = 0;
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      const deltaX = dragStartRef.current.x - e.clientX;
      const newOffset = dragStartRef.current.offset + deltaX;
      velocityRef.current = deltaX * 0.1;
      offsetRef.current = newOffset;
      normalizeOffset();
      updateTrackPosition();
      dragStartRef.current.x = e.clientX;
      dragStartRef.current.offset = offsetRef.current;
    },
    [isDragging, normalizeOffset, updateTrackPosition]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
    if (pauseOnHover) {
      setIsPaused(false);
    }
  }, [isDragging, pauseOnHover]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      offset: offsetRef.current,
    };
    velocityRef.current = 0;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;

      const deltaX = dragStartRef.current.x - e.touches[0].clientX;
      const newOffset = dragStartRef.current.offset + deltaX;
      velocityRef.current = deltaX * 0.1;
      offsetRef.current = newOffset;
      normalizeOffset();
      updateTrackPosition();
      dragStartRef.current.x = e.touches[0].clientX;
      dragStartRef.current.offset = offsetRef.current;
    },
    [isDragging, normalizeOffset, updateTrackPosition]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <section className="w-full bg-secondary/30">
      <div className="max-w-full mx-auto">
        {/* Marquee Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden select-none"
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-secondary/30 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-secondary/30 to-transparent z-10 pointer-events-none" />

          {/* Track */}
          <div
            ref={trackRef}
            className="flex items-center will-change-transform py-8"
            style={{ gap: `${LOGO_GAP}px` }}
          >
            {loopedLogos.map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="flex-shrink-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 transition-all duration-300 hover:bg-background hover:border-border hover:shadow-lg group"
                style={{
                  width: LOGO_WIDTH,
                  height: LOGO_HEIGHT,
                }}
              >
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Partner logo"
                  className="max-w-[75%] max-h-[60%] object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 "
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientMarquee;
