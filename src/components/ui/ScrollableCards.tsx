import React from 'react';

interface ScrollableCardsProps {
  children: React.ReactNode;
  /** Number of columns on desktop (default: 3) */
  desktopColumns?: 2 | 3 | 4;
  /** Gap between cards in pixels (default: 6) */
  gap?: 4 | 6 | 8 | 10;
  /** Enable horizontal scroll on mobile (default: true) */
  mobileScroll?: boolean;
  /** Custom className for additional styling */
  className?: string;
}

/**
 * ScrollableCards - Responsive card container
 * 
 * Mobile: Horizontal scrolling carousel
 * Tablet & Desktop: Responsive grid layout
 * 
 * Usage:
 * <ScrollableCards desktopColumns={3} gap={6}>
 *   <Card>...</Card>
 *   <Card>...</Card>
 *   <Card>...</Card>
 * </ScrollableCards>
 */
const ScrollableCards: React.FC<ScrollableCardsProps> = ({
  children,
  desktopColumns = 3,
  gap = 6,
  mobileScroll = true,
  className = '',
}) => {
  const gapClass = {
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
  }[gap];

  const desktopGridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[desktopColumns];

  if (mobileScroll) {
    return (
      <>
        {/* Mobile: Horizontal Scroll */}
        <div className={`md:hidden overflow-x-auto scrollbar-hide ${className}`}>
          <div className={`flex ${gapClass} pb-4`} style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            {React.Children.map(children, (child) => (
              <div className="flex-shrink-0" style={{ width: '85vw', maxWidth: '400px' }}>
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className={`hidden md:grid md:grid-cols-1 ${desktopGridClass} ${gapClass} ${className}`}>
          {children}
        </div>
      </>
    );
  }

  // Fallback: Standard responsive grid (no mobile scroll)
  return (
    <div className={`grid grid-cols-1 ${desktopGridClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollableCards;
