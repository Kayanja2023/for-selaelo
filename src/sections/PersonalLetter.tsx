import React from 'react';
import { InvitationConfig } from '../types/invitation';
import { Letter } from '../components/Letter';
import { DecorativeLilies } from '../components/DecorativeLilies';

export interface PersonalLetterProps {
  config: InvitationConfig;
  reducedMotion: boolean;
  onContinue: () => void;
}

export const PersonalLetter: React.FC<PersonalLetterProps> = ({
  config,
  reducedMotion,
  onContinue,
}) => {
  return (
    <section
      id="stage-letter"
      aria-label="Stage 2: The Personal Letter"
      className="relative py-14 sm:py-20 scroll-mt-16"
    >
      <DecorativeLilies
        variant="divider"
        reducedMotion={reducedMotion}
        className="mb-10"
      />

      <Letter
        dateHeader={config.letter.dateHeader}
        salutation={config.letter.salutation}
        paragraphs={config.letter.paragraphs}
        signOffIntro={config.letter.signOffIntro}
        signOffName={config.letter.signOffName}
        caffeineFootnote={config.letter.caffeineFootnote}
        ctaText={config.letter.ctaText}
        reducedMotion={reducedMotion}
        onContinue={onContinue}
      />
    </section>
  );
};
