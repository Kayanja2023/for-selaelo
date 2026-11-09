import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Coffee, Feather } from 'lucide-react';
import { WhiteLilyBlossomSvg } from './DecorativeLilies';

export interface LetterProps {
  dateHeader: string;
  salutation: string;
  paragraphs: string[];
  signOffIntro: string;
  signOffName: string;
  caffeineFootnote: string;
  ctaText: string;
  reducedMotion: boolean;
  onContinue: () => void;
}

export const Letter: React.FC<LetterProps> = ({
  dateHeader,
  salutation,
  paragraphs,
  signOffIntro,
  signOffName,
  caffeineFootnote,
  ctaText,
  reducedMotion,
  onContinue,
}) => {
  const [revealedCount, setRevealedCount] = useState<number>(
    reducedMotion ? paragraphs.length + 1 : 1
  );

  useEffect(() => {
    if (reducedMotion) {
      setRevealedCount(paragraphs.length + 1);
      return;
    }

    if (revealedCount <= paragraphs.length) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1);
      }, 650);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, paragraphs.length, reducedMotion]);

  const allRevealed = revealedCount > paragraphs.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <motion.article
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        aria-label="Personal letter to Selaelo"
        className="relative stationery-paper rounded-xl px-6 py-8 sm:px-12 sm:py-12 md:px-14 md:py-14 overflow-hidden"
      >
        {/* Decorative Washi Tape at Top Center */}
        <div
          className="washi-tape absolute -top-2.5 left-1/2 -translate-x-1/2 w-36 h-7 rotate-[-1deg] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle Coffee Cup Ring Watermark in Bottom Right Margin */}
        <svg
          viewBox="0 0 120 120"
          className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.07] pointer-events-none select-none"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="#5C1D24"
            strokeWidth="3.5"
            strokeDasharray="85 12 40 8"
          />
          <circle
            cx="62"
            cy="58"
            r="43"
            fill="none"
            stroke="#9E7B32"
            strokeWidth="1.5"
          />
        </svg>

        {/* Stationery Header */}
        <header className="flex items-center justify-between border-b border-champagne/35 pb-5 mb-7">
          <div className="flex items-center gap-2.5">
            <Feather className="w-4 h-4 text-burgundy/80" aria-hidden="true" />
            <span className="text-xs uppercase tracking-[0.22em] text-ink-soft font-medium">
              {dateHeader}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!allRevealed && (
              <button
                type="button"
                onClick={() => setRevealedCount(paragraphs.length + 1)}
                className="text-xs text-burgundy/80 underline underline-offset-4 hover:text-burgundy transition-colors"
              >
                Reveal full letter
              </button>
            )}
            <WhiteLilyBlossomSvg className="w-9 h-9" />
          </div>
        </header>

        {/* Handwritten Salutation */}
        <h2 className="font-handwritten text-3xl sm:text-4xl text-burgundy font-semibold mb-6">
          {salutation}
        </h2>

        {/* Progressive Text-Reveal Letter Body */}
        <div className="space-y-5 text-ink">
          {paragraphs.map((paragraph, index) => {
            const isVisible = index < revealedCount;
            const isPlayfulShortLine =
              paragraph.length < 48 || paragraph.includes("where's the fun");

            return (
              <motion.p
                key={index}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={
                  isVisible
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 10 }
                }
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className={
                  isPlayfulShortLine
                    ? 'font-handwritten text-2xl sm:text-[28px] leading-snug text-burgundy py-0.5'
                    : 'font-serif text-base sm:text-[18px] leading-[1.85] text-ink/90'
                }
              >
                {paragraph}
              </motion.p>
            );
          })}
        </div>

        {/* Handwritten Sign-Off */}
        <motion.footer
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={allRevealed ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 6 }}
          transition={{ duration: 0.6 }}
          className="mt-10 pt-6 border-t border-rose-dusty/25 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <p className="font-serif italic text-base sm:text-lg text-ink-muted">
              {signOffIntro}
            </p>
            <p className="font-handwritten text-4xl sm:text-5xl text-burgundy font-semibold mt-1">
              {signOffName}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-ink-soft italic">
            <Coffee className="w-3.5 h-3.5 text-champagne-deep" aria-hidden="true" />
            <span>{caffeineFootnote}</span>
          </div>
        </motion.footer>
      </motion.article>

      {/* Stage 2 -> Stage 3 CTA */}
      <motion.div
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reducedMotion ? 0 : 0.5, duration: 0.6 }}
        className="mt-9 flex justify-center"
      >
        <button
          type="button"
          onClick={onContinue}
          className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-burgundy text-ivory font-medium text-sm sm:text-base tracking-wide shadow-paper hover:bg-burgundy-light transition-all duration-300 hover:shadow-paper-lg"
        >
          <span>{ctaText}</span>
          <ArrowDown
            className="w-4 h-4 text-champagne-light transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </button>
      </motion.div>
    </div>
  );
};
