import React from 'react';
import { InvitationConfig } from '../types/invitation';
import { Scrapbook } from '../components/Scrapbook';
import { DecorativeLilies } from '../components/DecorativeLilies';

export interface MemoryScrapbookProps {
  config: InvitationConfig;
  reducedMotion: boolean;
  onContinue: () => void;
}

export const MemoryScrapbook: React.FC<MemoryScrapbookProps> = ({
  config,
  reducedMotion,
  onContinue,
}) => {
  return (
    <section
      id="stage-scrapbook"
      aria-label="Stage 3: The Scrapbook"
      className="relative py-14 sm:py-20 scroll-mt-16"
    >
      <DecorativeLilies
        variant="divider"
        reducedMotion={reducedMotion}
        className="mb-10"
      />

      <Scrapbook
        eyebrow={config.scrapbook.sectionEyebrow}
        heading={config.scrapbook.sectionHeading}
        subheading={config.scrapbook.sectionSubheading}
        selaeloPhoto={config.scrapbook.photographs.selaelo}
        togetherPhoto={config.scrapbook.photographs.together}
        insideJokes={config.scrapbook.insideJokes}
        ctaText={config.scrapbook.ctaText}
        reducedMotion={reducedMotion}
        onContinue={onContinue}
      />
    </section>
  );
};

