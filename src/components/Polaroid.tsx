import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PolaroidPhotoConfig } from '../types/invitation';
import { WhiteLilyBlossomSvg } from './DecorativeLilies';

export interface PolaroidProps {
  photo: PolaroidPhotoConfig;
  reducedMotion?: boolean;
}

export const Polaroid: React.FC<PolaroidProps> = ({
  photo,
  reducedMotion = false,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const isFeatured = photo.size === 'featured';

  return (
    <motion.figure
      initial={
        reducedMotion
          ? { opacity: 1, rotate: photo.rotation }
          : { opacity: 0, y: 24, rotate: photo.rotation * 1.4 }
      }
      whileInView={{ opacity: 1, y: 0, rotate: photo.rotation }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              rotate: 0,
              y: -4,
              transition: { duration: 0.3, ease: 'easeOut' },
            }
      }
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className={`relative bg-[#FDFBF8] rounded-sm shadow-polaroid border border-champagne/30 select-none ${
        isFeatured
          ? 'p-4 pb-8 sm:p-5 sm:pb-10 w-full max-w-md mx-auto'
          : 'p-3.5 pb-7 sm:p-4 sm:pb-9 w-full max-w-sm mx-auto'
      }`}
    >
      {/* Washi Tape or Corner Mount Decoration */}
      {photo.tapeStyle === 'top-center' && (
        <div
          className="washi-tape absolute -top-3.5 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-7 rotate-[-2deg] z-20 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {photo.tapeStyle === 'corners' && (
        <>
          <div
            className="washi-tape absolute -top-3 -left-3 w-20 h-6 rotate-[-32deg] z-20 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="washi-tape absolute -top-3 -right-3 w-20 h-6 rotate-[32deg] z-20 pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}

      {/* Subtle Pressed White Lily Botanical Sticker on Corner */}
      <div
        className="absolute -bottom-3 -right-3 z-20 bg-ivory/95 rounded-full p-1.5 shadow-sm border border-champagne/40 pointer-events-none"
        aria-hidden="true"
      >
        <WhiteLilyBlossomSvg className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      {/* Polaroid Photo Viewport (Portrait framing for both vertical photos) */}
      <div
        className={`relative w-full overflow-hidden bg-gradient-to-br from-ivory-paper via-blush/50 to-ivory-warm border border-champagne/25 ${
          isFeatured ? 'aspect-[4/4.6]' : 'aspect-[4/4.6]'
        }`}
      >
        {!imageFailed ? (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
          />
        ) : (
          /* Fallback artistic botanical frame if file is temporarily missing */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-ivory to-blush/60">
            <div className="w-20 h-20 rounded-full border border-champagne/60 flex items-center justify-center mb-3 bg-ivory/80">
              <span className="font-serif italic text-2xl text-burgundy">
                {photo.placeholderMonogram}
              </span>
            </div>
            <p className="font-serif text-base text-burgundy font-medium">
              {photo.frameTitle}
            </p>
            <p className="text-xs text-ink-soft mt-1 font-mono">
              {photo.placeholderNote}
            </p>
          </div>
        )}

        {/* Warm Vintage Film Gloss Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-burgundy/[0.03] via-transparent to-champagne/[0.06] pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Handwritten Polaroid Caption */}
      <figcaption className="mt-4 sm:mt-5 px-2 text-center">
        <p className="font-handwritten text-2xl sm:text-[26px] leading-snug text-ink font-medium">
          “{photo.caption}”
        </p>
      </figcaption>
    </motion.figure>
  );
};
