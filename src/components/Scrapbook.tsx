import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Coffee, LineChart, Sparkles } from 'lucide-react';
import { InsideJokeAnnotation, PolaroidPhotoConfig } from '../types/invitation';
import { Polaroid } from './Polaroid';
import { DecorativeLilies, WhiteLilySprigSvg } from './DecorativeLilies';

export interface ScrapbookProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  selaeloPhoto: PolaroidPhotoConfig;
  togetherPhoto: PolaroidPhotoConfig;
  insideJokes: InsideJokeAnnotation[];
  ctaText: string;
  reducedMotion: boolean;
  onContinue: () => void;
}

export const Scrapbook: React.FC<ScrapbookProps> = ({
  eyebrow,
  heading,
  subheading,
  selaeloPhoto,
  togetherPhoto,
  insideJokes,
  ctaText,
  reducedMotion,
  onContinue,
}) => {
  const caffeineNote = insideJokes.find((j) => j.id === 'caffeine') || insideJokes[0];
  const analyticsNote = insideJokes.find((j) => j.id === 'analytics') || insideJokes[1];
  const goldChainNote = insideJokes.find((j) => j.id === 'gold-chain') || insideJokes[2];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Editorial Section Header */}
      <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
        <span className="inline-block text-xs uppercase tracking-[0.24em] text-burgundy font-medium mb-2.5">
          {eyebrow}
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink font-semibold tracking-tight">
          {heading}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed">
          {subheading}
        </p>
      </div>

      {/* ROW 1: Selaelo's Polaroid + Caffeine/SQL Annotation + Gold Chain Annotation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
        {/* Photograph 1: Selaelo */}
        <div className="lg:col-span-6 flex justify-center">
          <Polaroid photo={selaeloPhoto} reducedMotion={reducedMotion} />
        </div>

        {/* Paired Handwritten Margin Notes */}
        <div className="lg:col-span-6 flex flex-col gap-6 sm:gap-7">
          {caffeineNote && (
            <ScrapbookAnnotationCard
              annotation={caffeineNote}
              reducedMotion={reducedMotion}
              icon={<Coffee className="w-4 h-4 text-burgundy" aria-hidden="true" />}
              accentType="caffeine"
            />
          )}

          {goldChainNote && (
            <ScrapbookAnnotationCard
              annotation={goldChainNote}
              reducedMotion={reducedMotion}
              icon={<Sparkles className="w-4 h-4 text-champagne-deep" aria-hidden="true" />}
              accentType="gold-chain"
            />
          )}
        </div>
      </div>

      {/* Tasteful White Lily Illustration Divider Between Scrapbook Spreads */}
      <DecorativeLilies
        variant="divider"
        reducedMotion={reducedMotion}
        className="my-12 sm:my-16"
      />

      {/* ROW 2: Data Analytics Research Note + Photograph 2 (Together - Larger Frame) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
        {/* Data Analytics Annotation + Botanical Sprig */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col items-center lg:items-end gap-6">
          {analyticsNote && (
            <ScrapbookAnnotationCard
              annotation={analyticsNote}
              reducedMotion={reducedMotion}
              icon={<LineChart className="w-4 h-4 text-burgundy" aria-hidden="true" />}
              accentType="analytics"
            />
          )}

          <div className="hidden lg:flex items-center gap-3 pr-4 opacity-85">
            <WhiteLilySprigSvg className="w-24 h-24" />
            <span className="font-handwritten text-xl text-ink-soft">
              White lilies, pressed for the page
            </span>
          </div>
        </div>

        {/* Photograph 2: Together (Larger Polaroid-style frame) */}
        <div className="lg:col-span-7 order-1 lg:order-2 flex justify-center">
          <Polaroid photo={togetherPhoto} reducedMotion={reducedMotion} />
        </div>
      </div>

      {/* Stage 3 -> Stage 4 CTA */}
      <div className="mt-14 sm:mt-16 flex flex-col items-center text-center">
        <DecorativeLilies
          variant="sprig"
          reducedMotion={reducedMotion}
          className="mb-3"
        />
        <button
          type="button"
          onClick={onContinue}
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-burgundy text-ivory font-medium text-sm sm:text-base tracking-wide shadow-paper hover:bg-burgundy-light transition-all duration-300 hover:shadow-paper-lg"
        >
          <span>{ctaText}</span>
          <ArrowDown
            className="w-4 h-4 text-champagne-light transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
};

interface ScrapbookAnnotationCardProps {
  annotation: InsideJokeAnnotation;
  icon: React.ReactNode;
  accentType: 'caffeine' | 'analytics' | 'gold-chain';
  reducedMotion: boolean;
}

const ScrapbookAnnotationCard: React.FC<ScrapbookAnnotationCardProps> = ({
  annotation,
  icon,
  accentType,
  reducedMotion,
}) => {
  return (
    <motion.aside
      initial={
        reducedMotion
          ? { opacity: 1, rotate: annotation.rotation }
          : { opacity: 0, y: 18, rotate: annotation.rotation }
      }
      whileInView={{ opacity: 1, y: 0, rotate: annotation.rotation }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={
        reducedMotion
          ? undefined
          : {
              rotate: 0,
              y: -2,
              transition: { duration: 0.25 },
            }
      }
      transition={{ duration: 0.55 }}
      aria-label={annotation.categoryLabel}
      className={`relative w-full max-w-md mx-auto rounded-lg p-5 sm:p-6 shadow-paper border ${
        accentType === 'gold-chain'
          ? 'bg-gradient-to-br from-[#FCF9F2] via-[#FAF4E4] to-[#F5EBD3] border-champagne/60'
          : accentType === 'analytics'
          ? 'bg-[#FCF9F5] border-rose-dusty/45'
          : 'bg-[#FBF7F0] border-champagne/40'
      }`}
    >
      {/* Top Pin / Tape Detail */}
      <div
        className="washi-tape absolute -top-2.5 right-6 w-20 h-5 rotate-[3deg] pointer-events-none"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-ink-soft font-medium">
          {icon}
          <span>{annotation.categoryLabel}</span>
        </span>

        {accentType === 'gold-chain' && <GoldChainMotifSvg />}
      </div>

      <p className="font-handwritten text-2xl sm:text-[27px] leading-snug text-burgundy font-semibold">
        “{annotation.note}”
      </p>

      {annotation.subtext && (
        <p className="mt-2.5 text-xs text-ink-soft font-sans italic border-t border-champagne/25 pt-2">
          {annotation.subtext}
        </p>
      )}
    </motion.aside>
  );
};

/**
 * Delicate champagne-gold link chain motif for the gold-chain annotation card
 */
const GoldChainMotifSvg: React.FC = () => (
  <svg
    viewBox="0 0 84 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-16 h-5 shrink-0"
    aria-hidden="true"
  >
    <rect
      x="2"
      y="5"
      width="22"
      height="12"
      rx="6"
      stroke="#D4AF37"
      strokeWidth="1.8"
    />
    <rect
      x="18"
      y="5"
      width="22"
      height="12"
      rx="6"
      stroke="#C5A059"
      strokeWidth="1.8"
    />
    <rect
      x="34"
      y="5"
      width="22"
      height="12"
      rx="6"
      stroke="#D4AF37"
      strokeWidth="1.8"
    />
    <rect
      x="50"
      y="5"
      width="22"
      height="12"
      rx="6"
      stroke="#C5A059"
      strokeWidth="1.8"
    />
  </svg>
);

