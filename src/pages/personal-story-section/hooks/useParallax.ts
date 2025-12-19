import { useScroll, useTransform, MotionValue } from 'framer-motion';
import { RefObject } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export const useParallax = (
  ref: RefObject<HTMLElement>,
  options: ParallaxOptions = {}
): MotionValue<number> => {
  const { speed = 0.5, direction = 'vertical' } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const range = direction === 'vertical' ? [-100, 100] : [-50, 50];
  const transform = useTransform(
    scrollYProgress,
    [0, 1],
    [range[0] * speed, range[1] * speed]
  );

  return transform;
};

export const useHorizontalScroll = () => {
  const { scrollYProgress } = useScroll();

  return {
    scrollYProgress,
    opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0.8]),
    scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.98, 0.95])
  };
};