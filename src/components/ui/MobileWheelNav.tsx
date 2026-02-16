import React, { useEffect, useRef } from 'react';

const items = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  label: `Item ${i + 1}`,
  actionLabel: 'Select Item',
}));

const MobileWheelNav: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrolleable = scrollerRef.current;
    if (!scrolleable) return;

    const navigation_list_group = scrolleable.querySelector('.navigation__list-group') as HTMLElement | null;
    const navigation_list = scrolleable.querySelector('.navigation__list') as HTMLElement | null;
    const navigation_line = scrolleable.querySelector('.navigation__line') as HTMLElement | null;

    if (!navigation_list_group || !navigation_list || !navigation_line) return;

    const itemsLength = navigation_list_group.querySelectorAll('.navigation__list-item').length;
    const itemsInView = Math.max(1, itemsLength / 10 - 1);

    let moveItems = 0;
    let movePointTo = 0;

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));
    const bound = (item: Element, prop: 'height' | 'width') => (item as HTMLElement).getBoundingClientRect()[prop];

    const transitionPoint = (delta: number) => {
      const lineHeight = bound(navigation_line, 'height');
      const linePerItemsViews = delta * lineHeight / itemsInView;
      movePointTo += linePerItemsViews;
      movePointTo = clamp(movePointTo, 0, lineHeight);
      navigation_line.style.setProperty('--yPos', movePointTo + 'px');
    };

    const transitionItems = (delta: number) => {
      const height = bound(navigation_list, 'height');
      const totalHeight = (navigation_list_group.getBoundingClientRect().height) - height;
      moveItems += -delta * height;
      moveItems = clamp(moveItems, -totalHeight, 0);
      navigation_list_group.style.transform = `translate3d(0,${moveItems}px,0)`;
    };

    const wheelHandler = (e: WheelEvent) => {
      const delta = Math.sign(e.deltaY);
      transitionPoint(delta);
      transitionItems(delta);
    };

    scrolleable.addEventListener('wheel', wheelHandler as any, { passive: true });
    return () => scrolleable.removeEventListener('wheel', wheelHandler as any);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-start justify-center p-6 md:hidden">
      <div className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl">
        <div ref={scrollerRef} className="navigation__scrolleable p-6 flex">
          <div className="navigation__line" style={{ width: 2, background: '#153462', minHeight: 240 }} />
          <div className="navigation__list ml-4" style={{ height: '320px', overflow: 'hidden' }}>
            <ul className="navigation__list-group">
              {items.map((it) => (
                <li key={it.id} className="navigation__list-item py-3 flex items-center justify-between border-b border-slate-100">
                  <span className="text-[#153462] font-black">{it.label}</span>
                  <button className="text-sm text-[#f68921] font-bold" onClick={() => { onClose(); alert(`Selected ${it.label}`); }}>{it.actionLabel}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 border-t text-right">
          <button onClick={onClose} className="px-4 py-2 bg-[#153462] text-white rounded-lg font-bold">Close</button>
        </div>
      </div>
    </div>
  );
};

export default MobileWheelNav;
