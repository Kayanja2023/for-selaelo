import React from 'react';
import { motion } from 'framer-motion';

export interface DecorativeLiliesProps {
  variant?: 'divider' | 'corner-tl' | 'corner-br' | 'sprig' | 'hero-cluster';
  className?: string;
  reducedMotion?: boolean;
}

/**
 * Hand-crafted SVG illustrations of White Lilies (Lilium candidum)
 * with muted sage foliage and champagne-gold stamens.
 */
export const DecorativeLilies: React.FC<DecorativeLiliesProps> = ({
  variant = 'divider',
  className = '',
  reducedMotion = false,
}) => {
  const floatTransition = reducedMotion
    ? undefined
    : {
        duration: 5.5,
        repeat: Infinity,
        repeatType: 'mirror' as const,
        ease: 'easeInOut' as const,
      };

  if (variant === 'divider') {
    return (
      <div
        className={`flex items-center justify-center gap-4 my-8 select-none ${className}`}
        aria-hidden="true"
      >
        <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-champagne/60 to-rose-dusty/60" />
        <motion.div
          animate={reducedMotion ? undefined : { y: [-2, 2, -2], rotate: [-1.5, 1.5, -1.5] }}
          transition={floatTransition}
          className="relative flex items-center justify-center"
        >
          <WhiteLilyBlossomSvg className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" />
        </motion.div>
        <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-champagne/60 to-rose-dusty/60" />
      </div>
    );
  }

  if (variant === 'sprig') {
    return (
      <motion.div
        animate={reducedMotion ? undefined : { y: [-3, 3, -3], rotate: [-2, 2, -2] }}
        transition={floatTransition}
        className={`inline-flex items-center justify-center select-none ${className}`}
        aria-hidden="true"
      >
        <WhiteLilySprigSvg className="w-20 h-20 sm:w-24 sm:h-24" />
      </motion.div>
    );
  }

  if (variant === 'corner-tl' || variant === 'corner-br') {
    const isBottomRight = variant === 'corner-br';
    return (
      <div
        className={`pointer-events-none select-none ${
          isBottomRight ? 'rotate-180' : ''
        } ${className}`}
        aria-hidden="true"
      >
        <CornerLilyEngravingSvg className="w-20 h-20 sm:w-24 sm:h-24 opacity-85" />
      </div>
    );
  }

  // 'hero-cluster'
  return (
    <motion.div
      animate={reducedMotion ? undefined : { y: [-4, 4, -4] }}
      transition={floatTransition}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <WhiteLilySprigSvg className="w-28 h-28 sm:w-36 sm:h-36" />
    </motion.div>
  );
};

export const WhiteLilyBlossomSvg: React.FC<{ className?: string }> = ({
  className = 'w-12 h-12',
}) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Muted sage leaves */}
    <path
      d="M60 106 C45 96, 28 84, 20 68 C38 72, 52 84, 60 98 Z"
      fill="#8A9A86"
      fillOpacity="0.78"
    />
    <path
      d="M60 106 C75 96, 92 84, 100 68 C82 72, 68 84, 60 98 Z"
      fill="#647560"
      fillOpacity="0.72"
    />
    {/* 6 White Lily Tepals */}
    <path
      d="M60 64 C44 54, 30 36, 30 18 C46 22, 56 38, 60 64 Z"
      fill="#FFFFFF"
      stroke="#C5A059"
      strokeWidth="0.9"
      strokeOpacity="0.55"
    />
    <path
      d="M60 64 C76 54, 90 36, 90 18 C74 22, 64 38, 60 64 Z"
      fill="#FFFFFF"
      stroke="#C5A059"
      strokeWidth="0.9"
      strokeOpacity="0.55"
    />
    <path
      d="M60 66 C50 42, 50 20, 60 6 C70 20, 70 42, 60 66 Z"
      fill="#FAF6F0"
      stroke="#D4AF37"
      strokeWidth="1"
      strokeOpacity="0.65"
    />
    <path
      d="M60 64 C40 68, 22 60, 14 44 C32 40, 48 48, 60 64 Z"
      fill="#FFFFFF"
      stroke="#C89B98"
      strokeWidth="0.9"
      strokeOpacity="0.5"
    />
    <path
      d="M60 64 C80 68, 98 60, 106 44 C88 40, 72 48, 60 64 Z"
      fill="#FFFFFF"
      stroke="#C89B98"
      strokeWidth="0.9"
      strokeOpacity="0.5"
    />
    <path
      d="M60 62 C51 76, 52 92, 60 102 C68 92, 69 76, 60 62 Z"
      fill="#FAF6F0"
      stroke="#C5A059"
      strokeWidth="0.9"
      strokeOpacity="0.55"
    />
    {/* Champagne gold stamens */}
    <path
      d="M60 62 C56 48, 52 38, 47 32"
      stroke="#C5A059"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M60 62 L60 28"
      stroke="#C5A059"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M60 62 C64 48, 68 38, 73 32"
      stroke="#C5A059"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <circle cx="46.5" cy="31" r="2.2" fill="#D4AF37" />
    <circle cx="60" cy="26.5" r="2.2" fill="#5C1D24" fillOpacity="0.8" />
    <circle cx="73.5" cy="31" r="2.2" fill="#D4AF37" />
  </svg>
);

export const WhiteLilySprigSvg: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Stem */}
    <path
      d="M36 154 C62 128, 86 98, 114 58"
      stroke="#647560"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M78 108 C98 112, 118 106, 134 94"
      stroke="#647560"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Sage Leaves */}
    <path
      d="M55 132 C42 114, 40 94, 48 76 C60 92, 62 112, 55 132 Z"
      fill="#8A9A86"
      fillOpacity="0.75"
    />
    <path
      d="M72 116 C92 126, 114 126, 132 116 C114 106, 92 106, 72 116 Z"
      fill="#647560"
      fillOpacity="0.65"
    />
    {/* Unopened Lily Bud */}
    <path
      d="M126 98 C136 86, 152 82, 162 86 C154 98, 140 102, 126 98 Z"
      fill="#FAF6F0"
      stroke="#C5A059"
      strokeWidth="1"
    />
    {/* Main Blooming White Lily */}
    <g transform="translate(62, 10)">
      <path
        d="M52 54 C36 44, 22 26, 22 8 C38 12, 48 28, 52 54 Z"
        fill="#FFFFFF"
        stroke="#C5A059"
        strokeWidth="0.9"
      />
      <path
        d="M52 54 C68 44, 82 26, 82 8 C66 12, 56 28, 52 54 Z"
        fill="#FFFFFF"
        stroke="#C5A059"
        strokeWidth="0.9"
      />
      <path
        d="M52 56 C42 32, 42 12, 52 -2 C62 12, 62 32, 52 56 Z"
        fill="#FAF6F0"
        stroke="#D4AF37"
        strokeWidth="1"
      />
      <path
        d="M52 54 C32 58, 14 50, 6 34 C24 30, 40 38, 52 54 Z"
        fill="#FFFFFF"
        stroke="#C89B98"
        strokeWidth="0.9"
      />
      <path
        d="M52 54 C72 58, 90 50, 98 34 C80 30, 64 38, 52 54 Z"
        fill="#FFFFFF"
        stroke="#C89B98"
        strokeWidth="0.9"
      />
      <circle cx="44" cy="25" r="2" fill="#D4AF37" />
      <circle cx="52" cy="21" r="2.2" fill="#5C1D24" />
      <circle cx="60" cy="25" r="2" fill="#D4AF37" />
    </g>
  </svg>
);

const CornerLilyEngravingSvg: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 92 L8 22 C8 14, 14 8, 22 8 L92 8"
      stroke="#C5A059"
      strokeWidth="1.2"
      strokeOpacity="0.6"
    />
    <path
      d="M14 78 L14 26 C14 19, 19 14, 26 14 L78 14"
      stroke="#C89B98"
      strokeWidth="0.8"
      strokeOpacity="0.5"
    />
    {/* Delicate Corner Lily Motif */}
    <path
      d="M22 22 C30 16, 42 16, 48 22 C42 28, 30 28, 22 22 Z"
      fill="#FFFFFF"
      stroke="#C5A059"
      strokeWidth="0.9"
    />
    <path
      d="M22 22 C16 30, 16 42, 22 48 C28 42, 28 30, 22 22 Z"
      fill="#FFFFFF"
      stroke="#C5A059"
      strokeWidth="0.9"
    />
    <path
      d="M22 22 C28 28, 38 38, 44 44"
      stroke="#8A9A86"
      strokeWidth="1.1"
      strokeLinecap="round"
    />
    <circle cx="22" cy="22" r="2.5" fill="#D4AF37" />
  </svg>
);

