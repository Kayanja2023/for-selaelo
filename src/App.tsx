import React, { useState } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { invitationConfig } from './config/invitation';
import { useInvitation } from './hooks/useInvitation';
import { ExperienceStage } from './types/invitation';
import { Introduction } from './sections/Introduction';
import { PersonalLetter } from './sections/PersonalLetter';
import { MemoryScrapbook } from './sections/MemoryScrapbook';
import { DateInvitation } from './sections/DateInvitation';
import { ResponseExperience } from './sections/ResponseExperience';
import { WhiteLilyBlossomSvg } from './components/DecorativeLilies';

const STAGE_LABELS: { stage: ExperienceStage; label: string }[] = [
  { stage: 'ENVELOPE', label: 'Envelope' },
  { stage: 'LETTER', label: 'Letter' },
  { stage: 'SCRAPBOOK', label: 'Scrapbook' },
  { stage: 'INVITATION', label: 'Invitation' },
  { stage: 'RESPONSE', label: 'Response' },
];

export const App: React.FC = () => {
  const {
    currentStage,
    unlockedStages,
    isEnvelopeOpen,
    prefersReducedMotion,
    isSubmitting,
    pendingResponse,
    selectedResponse,
    submissionResult,
    submissionError,
    submissionErrorCode,
    isUnrecordedPreview,
    openEnvelope,
    goToStage,
    advanceToScrapbook,
    advanceToInvitation,
    submitResponse,
    previewResponseWithoutBackend,
    resetResponseSelection,
  } = useInvitation();

  const [manualReducedMotion, setManualReducedMotion] = useState<boolean>(false);
  const effectiveReducedMotion = prefersReducedMotion || manualReducedMotion;

  const isLetterUnlocked = unlockedStages.includes('LETTER');
  const isScrapbookUnlocked = unlockedStages.includes('SCRAPBOOK');
  const isInvitationUnlocked = unlockedStages.includes('INVITATION');
  const isResponseUnlocked =
    unlockedStages.includes('RESPONSE') && selectedResponse !== null;

  return (
    <div className="min-h-screen flex flex-col justify-between text-ink selection:bg-blush-warm selection:text-burgundy">
      {/* Subtle Top Editorial Progress & Accessibility Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-ivory/85 border-b border-champagne/30 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Monogram */}
          <div className="flex items-center gap-2">
            <WhiteLilyBlossomSvg className="w-7 h-7 shrink-0" />
            <span className="font-serif italic text-sm sm:text-base text-burgundy font-medium">
              For {invitationConfig.recipient.firstName}
            </span>
          </div>

          {/* Unlocked Chapter Breadcrumbs */}
          <nav
            aria-label="Story progress"
            className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-0.5"
          >
            {STAGE_LABELS.map(({ stage, label }, idx) => {
              const unlocked =
                stage === 'RESPONSE'
                  ? isResponseUnlocked
                  : unlockedStages.includes(stage);

              if (!unlocked) return null;

              const isCurrent = currentStage === stage;

              return (
                <React.Fragment key={stage}>
                  {idx > 0 && (
                    <span
                      className="text-champagne-deep/60 text-xs select-none"
                      aria-hidden="true"
                    >
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => goToStage(stage)}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`px-2.5 py-1 rounded-full text-xs transition-colors whitespace-nowrap ${
                      isCurrent
                        ? 'bg-burgundy text-ivory font-medium shadow-sm'
                        : 'text-ink-muted hover:text-burgundy hover:bg-blush/50'
                    }`}
                  >
                    {label}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Accessible Reduced Motion Toggle */}
          <button
            type="button"
            onClick={() => setManualReducedMotion((prev) => !prev)}
            aria-pressed={effectiveReducedMotion}
            title="Toggle simplified animations"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-champagne/45 text-[11px] text-ink-soft hover:text-burgundy hover:border-burgundy/40 transition-colors shrink-0"
          >
            {effectiveReducedMotion ? (
              <>
                <Eye className="w-3 h-3 text-burgundy" aria-hidden="true" />
                <span className="hidden sm:inline">Still mode</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-champagne-deep" aria-hidden="true" />
                <span className="hidden sm:inline">Motion on</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Choreographed Multi-Stage Experience */}
      <main className="flex-1 pb-20">
        {/* STAGE 1: THE ENVELOPE */}
        <Introduction
          config={invitationConfig}
          isEnvelopeOpen={isEnvelopeOpen}
          reducedMotion={effectiveReducedMotion}
          onOpenEnvelope={openEnvelope}
        />

        {/* STAGE 2: THE PERSONAL LETTER */}
        {isLetterUnlocked && (
          <PersonalLetter
            config={invitationConfig}
            reducedMotion={effectiveReducedMotion}
            onContinue={advanceToScrapbook}
          />
        )}

        {/* STAGE 3: THE SCRAPBOOK */}
        {isScrapbookUnlocked && (
          <MemoryScrapbook
            config={invitationConfig}
            reducedMotion={effectiveReducedMotion}
            onContinue={advanceToInvitation}
          />
        )}

        {/* STAGE 4: THE DATE INVITATION */}
        {isInvitationUnlocked && (
          <DateInvitation
            config={invitationConfig}
            reducedMotion={effectiveReducedMotion}
            isSubmitting={isSubmitting}
            pendingResponse={pendingResponse}
            submissionError={submissionError}
            submissionErrorCode={submissionErrorCode}
            onSelectResponse={submitResponse}
            onPreviewUnrecorded={previewResponseWithoutBackend}
          />
        )}

        {/* STAGE 5 & 6: THE RESPONSE EXPERIENCE & PERSONAL CLOSING */}
        {isResponseUnlocked && selectedResponse && (
          <ResponseExperience
            config={invitationConfig}
            responseType={selectedResponse}
            submissionResult={submissionResult}
            isUnrecordedPreview={isUnrecordedPreview}
            reducedMotion={effectiveReducedMotion}
            onChangeResponse={resetResponseSelection}
          />
        )}
      </main>
    </div>
  );
};

export default App;

