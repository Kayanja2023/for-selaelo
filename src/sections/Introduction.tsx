import React from 'react';
import { InvitationConfig } from '../types/invitation';
import { Envelope } from '../components/Envelope';
import { DecorativeLilies } from '../components/DecorativeLilies';

export interface IntroductionProps {
  config: InvitationConfig;
  isEnvelopeOpen: boolean;
  reducedMotion: boolean;
  onOpenEnvelope: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({
  config,
  isEnvelopeOpen,
  reducedMotion,
  onOpenEnvelope,
}) => {
  return (
    <section
      id="stage-envelope"
      aria-label="Stage 1: The Envelope"
      className="relative min-h-[88vh] flex flex-col items-center justify-center py-12 sm:py-16 overflow-hidden"
    >
      {/* Subtle Ambient Botanical Sprigs */}
      <DecorativeLilies
        variant="hero-cluster"
        reducedMotion={reducedMotion}
        className="hidden md:block absolute top-8 left-8 opacity-40 -rotate-12"
      />
      <DecorativeLilies
        variant="hero-cluster"
        reducedMotion={reducedMotion}
        className="hidden md:block absolute bottom-8 right-8 opacity-40 rotate-12"
      />

      <Envelope
        recipientLabel={config.recipient.envelopeLabel}
        envelopeSubtitle={config.recipient.envelopeSubtitle}
        instructionText={config.recipient.envelopeInstruction}
        senderName={config.sender.firstName}
        isOpen={isEnvelopeOpen}
        reducedMotion={reducedMotion}
        onOpen={onOpenEnvelope}
      />
    </section>
  );
};
