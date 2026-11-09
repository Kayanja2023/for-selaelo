import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  MapPin,
  Film,
  Calendar,
  Clock,
  RotateCcw,
  Info,
} from 'lucide-react';
import {
  InvitationConfig,
  InvitationResponseType,
  SubmissionResult,
} from '../types/invitation';
import { Celebration } from '../components/Celebration';
import { ClosingMessage } from '../components/ClosingMessage';
import {
  DecorativeLilies,
  WhiteLilyBlossomSvg,
  WhiteLilySprigSvg,
} from '../components/DecorativeLilies';

export interface ResponseExperienceProps {
  config: InvitationConfig;
  responseType: InvitationResponseType;
  submissionResult: SubmissionResult | null;
  isUnrecordedPreview: boolean;
  reducedMotion: boolean;
  onChangeResponse: () => void;
}

export const ResponseExperience: React.FC<ResponseExperienceProps> = ({
  config,
  responseType,
  submissionResult,
  isUnrecordedPreview,
  reducedMotion,
  onChangeResponse,
}) => {
  const pathCopy = config.responses[responseType];
  const isYes = responseType === 'YES';

  return (
    <section
      id="stage-response"
      aria-label={`Response Experience: ${responseType}`}
      className="relative py-14 sm:py-20 scroll-mt-16 overflow-hidden"
    >
      {/* Celebratory Floating Lily Petals & Champagne Confetti for YES */}
      {isYes && <Celebration reducedMotion={reducedMotion} />}

      <div className="relative z-10 w-full max-w-2xl mx-auto px-4">
        <DecorativeLilies
          variant="divider"
          reducedMotion={reducedMotion}
          className="mb-8"
        />

        <motion.div
          initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="invitation-card-surface rounded-2xl p-6 sm:p-10 md:p-12 text-center border border-champagne/45 shadow-invitation"
        >
          {/* Submission Verification Status Badge */}
          <div className="flex justify-center mb-6">
            {!isUnrecordedPreview && submissionResult?.success ? (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-light/80 border border-sage/50 text-sage-deep text-xs font-medium tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-deep" aria-hidden="true" />
                <span>
                  {pathCopy.badgeText} · Saved
                  {submissionResult.emailSent ? ' & notification sent' : ''}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-light/70 border border-champagne/60 text-ink-muted text-xs font-medium">
                <Info className="w-3.5 h-3.5 text-burgundy" aria-hidden="true" />
                <span>
                  Unrecorded Preview Mode
                </span>
              </span>
            )}
          </div>

          {/* Botanical Artwork Header */}
          <div className="flex justify-center mb-4">
            {isYes ? (
              <WhiteLilySprigSvg className="w-24 h-24 sm:w-28 sm:h-28" />
            ) : (
              <WhiteLilyBlossomSvg className="w-16 h-16 sm:w-20 sm:h-20" />
            )}
          </div>

          {/* Main Response Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl text-burgundy font-semibold tracking-tight">
            {pathCopy.heading}
          </h2>

          {/* Response Message Paragraphs */}
          <div className="mt-5 space-y-3.5 max-w-lg mx-auto">
            {pathCopy.paragraphs.map((line, idx) => (
              <p
                key={idx}
                className="font-serif text-base sm:text-lg text-ink/90 leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>

          {/* YES Path: Beautiful Keepsake Date Summary Artwork */}
          {isYes && (
            <div className="mt-8 bg-ivory/90 rounded-xl p-5 sm:p-6 border border-champagne/45 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-champagne/30 pb-3 mb-4">
                <span className="text-[11px] uppercase tracking-[0.22em] text-burgundy font-semibold">
                  Our Evening Itinerary
                </span>
                <span className="font-handwritten text-xl text-burgundy">
                  For {config.recipient.firstName} &amp; {config.sender.firstName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-burgundy shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-ink">Destination:</strong>{' '}
                    {config.dateDetails.location}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Film className="w-4 h-4 text-burgundy shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-ink">Plan:</strong>{' '}
                    {config.dateDetails.movieDescription}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-burgundy shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-ink">Date:</strong>{' '}
                    {config.dateDetails.proposedDate}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-burgundy shrink-0" aria-hidden="true" />
                  <span>
                    <strong className="text-ink">Time:</strong>{' '}
                    {config.dateDetails.proposedTime}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Option to revisit or change selection */}
          <div className="mt-7 pt-4 border-t border-champagne/25 flex justify-center">
            <button
              type="button"
              onClick={onChangeResponse}
              className="inline-flex items-center gap-1.5 text-xs text-ink-soft hover:text-burgundy transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Return to the invitation card</span>
            </button>
          </div>
        </motion.div>

        {/* Stage 6: Personal Closing Experience */}
        <ClosingMessage
          closingConfig={config.closing}
          responseType={responseType}
          pathClosingNote={pathCopy.closingNote}
        />
      </div>
    </section>
  );
};
