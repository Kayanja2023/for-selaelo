import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export interface CelebrationProps {
  reducedMotion?: boolean;
}

interface PetalParticle {
  id: number;
  leftPercent: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  kind: 'petal' | 'gold-fleck' | 'blush-dot';
}

/**
 * Renders gentle floating white lily petals and champagne-gold confetti flecks
 * for the celebratory YES response experience.
 */
export const Celebration: React.FC<CelebrationProps> = ({
  reducedMotion = false,
}) => {
  const particles = useMemo<PetalParticle[]>(() => {
    const kinds: PetalParticle['kind'][] = ['petal', 'gold-fleck', 'blush-dot'];
    return Array.from({ length: 22 }, (_, idx) => ({
      id: idx,
      leftPercent: (idx * 4.5 + 3) % 96,
      delay: (idx % 6) * 0.45,
      duration: 6 + (idx % 5) * 1.1,
      size: 10 + (idx % 4) * 4,
      rotation: (idx * 37) % 360,
      kind: kinds[idx % kinds.length],
    }));
  }, []);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            y: -30,
            x: 0,
            rotate: p.rotation,
          }}
          animate={{
            opacity: [0, 0.85, 0.85, 0],
            y: ['0%', '420%'],
            x: [0, p.id % 2 === 0 ? 22 : -22, 0],
            rotate: [p.rotation, p.rotation + 140],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: `${p.leftPercent}%`,
            top: '-24px',
          }}
          className="absolute"
        >
          {p.kind === 'petal' && (
            <svg
              width={p.size + 6}
              height={p.size + 10}
              viewBox="0 0 20 28"
              fill="none"
            >
              <path
                d="M10 1 C4 8, 2 18, 10 27 C18 18, 16 8, 10 1 Z"
                fill="#FFFFFF"
                stroke="#D4AF37"
                strokeWidth="0.8"
                strokeOpacity="0.55"
              />
            </svg>
          )}

          {p.kind === 'gold-fleck' && (
            <div
              style={{ width: p.size * 0.55, height: p.size * 0.55 }}
              className="rounded-full bg-champagne/75 shadow-sm"
            />
          )}

          {p.kind === 'blush-dot' && (
            <div
              style={{ width: p.size * 0.65, height: p.size * 0.45 }}
              className="rounded-full bg-rose-dusty/55"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

