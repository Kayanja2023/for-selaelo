import React from 'react';
import {
  InvitationConfig,
  InvitationResponseType,
  SubmissionResult,
} from '../types/invitation';
import { InvitationCard } from '../components/InvitationCard';
import { DecorativeLilies } from '../components/DecorativeLilies';

export interface DateInvitationProps {
  config: InvitationConfig;
  reducedMotion: boolean;
  isSubmitting: boolean;
  pendingResponse: InvitationResponseType | null;
  submissionError: string | null;
  submissionErrorCode: SubmissionResult['errorCode'] | null;
  onSelectResponse: (response: InvitationResponseType) => void;
  onPreviewUnrecorded: (response: InvitationResponseType) => void;
}

export const DateInvitation: React.FC<DateInvitationProps> = ({
  config,
  reducedMotion,
  isSubmitting,
  pendingResponse,
  submissionError,
  submissionErrorCode,
  onSelectResponse,
  onPreviewUnrecorded,
}) => {
  return (
    <section
      id="stage-invitation"
      aria-label="Stage 4: The Date Invitation"
      className="relative py-14 sm:py-20 scroll-mt-16"
    >
      <DecorativeLilies
        variant="divider"
        reducedMotion={reducedMotion}
        className="mb-10"
      />

      <InvitationCard
        dateDetails={config.dateDetails}
        reducedMotion={reducedMotion}
        isSubmitting={isSubmitting}
        pendingResponse={pendingResponse}
        submissionError={submissionError}
        submissionErrorCode={submissionErrorCode}
        onSelectResponse={onSelectResponse}
        onPreviewUnrecorded={onPreviewUnrecorded}
      />
    </section>
  );
};

