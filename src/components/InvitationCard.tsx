import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Film, Calendar, Clock } from 'lucide-react';
import {
  InvitationConfig,
  InvitationResponseType,
  SubmissionResult,
} from '../types/invitation';
import { DecorativeLilies, WhiteLilyBlossomSvg } from './DecorativeLilies';
import { ResponseButtons } from './ResponseButtons';

export interface InvitationCardProps {
  dateDetails: InvitationConfig['dateDetails'];
  reducedMotion: boolean;
  isSubmitting: boolean;
  pendingResponse: InvitationResponseType | null;
  submissionError: string | null;
  submissionErrorCode: SubmissionResult['errorCode'] | null;
  onSelectResponse: (response: InvitationResponseType) => void;
  onPreviewUnrecorded: (response: InvitationResponseType) => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  dateDetails,
  reducedMotion,
  isSubmitting,
  pendingResponse,
  submissionError,
  submissionErrorCode,
  onSelectResponse,
  onPreviewUnrecorded,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <motion.section
        initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.75, ease: 'easeOut' }}
        aria-labelledby="invitation-card-heading"
        className="relative invitation-card-surface rounded-2xl p-6 sm:p-10 md:p-12 overflow-hidden"
      >
        {/* Outer & Inner Subtle Decorative Borders */}
        <div
          className="absolute inset-3 sm:inset-4 rounded-xl border border-champagne/45 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-4 sm:inset-5 rounded-lg border border-rose-dusty/30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Delicate Corner Lily Engravings */}
        <DecorativeLilies
          variant="corner-tl"
          className="absolute top-2 left-2"
          reducedMotion={reducedMotion}
        />
        <DecorativeLilies
          variant="corner-br"
          className="absolute bottom-2 right-2"
          reducedMotion={reducedMotion}
        />

        {/* Card Content Container */}
        <div className="relative z-10 px-2 py-4 sm:px-6 sm:py-6 text-center">
          {/* Top White Lily Emblem & Eyebrow */}
          <div className="flex flex-col items-center mb-5">
            <WhiteLilyBlossomSvg className="w-14 h-14 sm:w-16 sm:h-16 mb-2" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-burgundy font-medium">
              {dateDetails.eyebrow}
            </span>
          </div>

          {/* Main Invitation Question */}
          <h2
            id="invitation-card-heading"
            className="font-serif text-3xl sm:text-4xl md:text-[42px] leading-[1.2] text-burgundy font-semibold tracking-tight max-w-lg mx-auto"
          >
            {dateDetails.mainHeading}
          </h2>

          {/* Supporting Message */}
          <p className="mt-5 font-serif text-base sm:text-lg text-ink/85 leading-relaxed max-w-xl mx-auto">
            {dateDetails.supportingMessage}
          </p>

          {/* Ornamental Gold Hairline Divider */}
          <div
            className="my-8 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="h-[1px] w-16 sm:w-24 bg-champagne/60" />
            <span className="text-champagne-deep text-xs">✦</span>
            <span className="h-[1px] w-16 sm:w-24 bg-champagne/60" />
          </div>

          {/* Proposed Date Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left bg-ivory/80 rounded-xl p-5 sm:p-6 border border-champagne/40 shadow-sm">
            {/* DESTINATION */}
            <div className="flex items-start gap-3.5 p-2">
              <div className="w-9 h-9 rounded-lg bg-blush/80 border border-rose-dusty/40 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-burgundy" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
                  {dateDetails.destinationLabel}
                </p>
                <p className="font-serif text-base sm:text-lg text-ink font-semibold mt-0.5">
                  {dateDetails.location}
                </p>
              </div>
            </div>

            {/* PLAN */}
            <div className="flex items-start gap-3.5 p-2">
              <div className="w-9 h-9 rounded-lg bg-blush/80 border border-rose-dusty/40 flex items-center justify-center shrink-0 mt-0.5">
                <Film className="w-4 h-4 text-burgundy" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
                  {dateDetails.planLabel}
                </p>
                <p className="font-serif text-base sm:text-lg text-ink font-semibold mt-0.5">
                  {dateDetails.movieDescription}
                </p>
              </div>
            </div>

            {/* DATE */}
            <div className="flex items-start gap-3.5 p-2 border-t border-champagne/25 pt-4">
              <div className="w-9 h-9 rounded-lg bg-blush/80 border border-rose-dusty/40 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4 text-burgundy" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
                  {dateDetails.dateLabel}
                </p>
                <p className="font-serif text-base sm:text-lg text-burgundy font-semibold mt-0.5">
                  {dateDetails.proposedDate}
                </p>
              </div>
            </div>

            {/* TIME */}
            <div className="flex items-start gap-3.5 p-2 border-t border-champagne/25 pt-4">
              <div className="w-9 h-9 rounded-lg bg-blush/80 border border-rose-dusty/40 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-burgundy" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft font-semibold">
                  {dateDetails.timeLabel}
                </p>
                <p className="font-serif text-base sm:text-lg text-burgundy font-semibold mt-0.5">
                  {dateDetails.proposedTime}
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Response Buttons */}
          <ResponseButtons
            labels={dateDetails.buttons}
            isSubmitting={isSubmitting}
            pendingResponse={pendingResponse}
            submissionError={submissionError}
            submissionErrorCode={submissionErrorCode}
            onSelectResponse={onSelectResponse}
            onPreviewUnrecorded={onPreviewUnrecorded}
          />
        </div>
      </motion.section>
    </div>
  );
};

