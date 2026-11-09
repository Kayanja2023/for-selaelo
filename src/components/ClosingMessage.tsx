import React from 'react';
import { Coffee, Heart, Sparkles } from 'lucide-react';
import { InvitationConfig, InvitationResponseType } from '../types/invitation';
import { WhiteLilyBlossomSvg } from './DecorativeLilies';

export interface ClosingMessageProps {
  closingConfig: InvitationConfig['closing'];
  responseType: InvitationResponseType;
  pathClosingNote: string;
}

export const ClosingMessage: React.FC<ClosingMessageProps> = ({
  closingConfig,
  responseType,
  pathClosingNote,
}) => {
  const isYes = responseType === 'YES';

  return (
    <footer
      aria-label="Personal closing signature"
      className="mt-12 pt-10 border-t border-champagne/35 text-center max-w-xl mx-auto px-4"
    >
      <div className="flex justify-center mb-4">
        <WhiteLilyBlossomSvg className="w-11 h-11 opacity-90" />
      </div>

      {/* Path-Specific Warm or Celebratory Note */}
      <p
        className={`text-sm sm:text-base italic font-serif mb-6 ${
          isYes ? 'text-burgundy font-medium' : 'text-ink-muted'
        }`}
      >
        {pathClosingNote}
      </p>

      {/* Main Personal Signature Card */}
      <div
        className={`rounded-xl px-6 py-5 border shadow-sm ${
          isYes
            ? 'bg-gradient-to-br from-ivory via-blush/40 to-champagne-light/30 border-champagne/55'
            : 'bg-ivory/80 border-champagne/35'
        }`}
      >
        <p className="font-serif text-base sm:text-lg text-ink leading-relaxed">
          “{closingConfig.signatureQuote}”
        </p>

        <p className="font-handwritten text-3xl sm:text-4xl text-burgundy font-semibold mt-2">
          {closingConfig.signatureAuthor}
        </p>

        <div className="mt-4 pt-3 border-t border-champagne/25 flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Coffee className="w-3 h-3 text-champagne-deep" aria-hidden="true" />
            <span>Crafted for Selaelo</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            {isYes ? (
              <Heart className="w-3 h-3 text-burgundy" aria-hidden="true" />
            ) : (
              <Sparkles className="w-3 h-3 text-champagne-deep" aria-hidden="true" />
            )}
            <span>{closingConfig.botanicalFootnote}</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

