import { useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import {
  ExperienceStage,
  InvitationResponseType,
  SubmissionResult,
} from '../types/invitation';
import {
  isBackendConfigured,
  submitInvitationResponse,
} from '../services/responseService';

const STAGE_ORDER: readonly ExperienceStage[] = [
  'ENVELOPE',
  'LETTER',
  'SCRAPBOOK',
  'INVITATION',
  'RESPONSE',
];

export interface UseInvitationReturn {
  currentStage: ExperienceStage;
  unlockedStages: ExperienceStage[];
  isEnvelopeOpen: boolean;
  prefersReducedMotion: boolean;
  backendConfigured: boolean;
  isSubmitting: boolean;
  pendingResponse: InvitationResponseType | null;
  selectedResponse: InvitationResponseType | null;
  submissionResult: SubmissionResult | null;
  submissionError: string | null;
  submissionErrorCode: SubmissionResult['errorCode'] | null;
  isUnrecordedPreview: boolean;
  openEnvelope: () => void;
  goToStage: (stage: ExperienceStage) => void;
  advanceToScrapbook: () => void;
  advanceToInvitation: () => void;
  submitResponse: (response: InvitationResponseType) => Promise<void>;
  previewResponseWithoutBackend: (response: InvitationResponseType) => void;
  resetResponseSelection: () => void;
}

export function useInvitation(): UseInvitationReturn {
  const framerReducedMotion = useReducedMotion();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    Boolean(framerReducedMotion)
  );

  useEffect(() => {
    setPrefersReducedMotion(Boolean(framerReducedMotion));
  }, [framerReducedMotion]);

  const [currentStage, setCurrentStage] = useState<ExperienceStage>('ENVELOPE');
  const [unlockedStages, setUnlockedStages] = useState<ExperienceStage[]>(['ENVELOPE']);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pendingResponse, setPendingResponse] = useState<InvitationResponseType | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<InvitationResponseType | null>(null);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionErrorCode, setSubmissionErrorCode] =
    useState<SubmissionResult['errorCode'] | null>(null);
  const [isUnrecordedPreview, setIsUnrecordedPreview] = useState<boolean>(false);

  const unlockAndScrollTo = useCallback((targetStage: ExperienceStage) => {
    setUnlockedStages((prev) => {
      const targetIdx = STAGE_ORDER.indexOf(targetStage);
      const nextUnlocked = new Set(prev);
      for (let i = 0; i <= targetIdx; i++) {
        nextUnlocked.add(STAGE_ORDER[i]);
      }
      return Array.from(nextUnlocked);
    });
    setCurrentStage(targetStage);

    // Smoothly scroll to the target section once rendered
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById(`stage-${targetStage.toLowerCase()}`);
        if (element) {
          element.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }
      }, 80);
    });
  }, [prefersReducedMotion]);

  const openEnvelope = useCallback(() => {
    setIsEnvelopeOpen(true);
    const delay = prefersReducedMotion ? 50 : 950;
    setTimeout(() => {
      unlockAndScrollTo('LETTER');
    }, delay);
  }, [prefersReducedMotion, unlockAndScrollTo]);

  const advanceToScrapbook = useCallback(() => {
    unlockAndScrollTo('SCRAPBOOK');
  }, [unlockAndScrollTo]);

  const advanceToInvitation = useCallback(() => {
    unlockAndScrollTo('INVITATION');
  }, [unlockAndScrollTo]);

  const goToStage = useCallback(
    (stage: ExperienceStage) => {
      if (unlockedStages.includes(stage)) {
        setCurrentStage(stage);
        const element = document.getElementById(`stage-${stage.toLowerCase()}`);
        if (element) {
          element.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start',
          });
        }
      }
    },
    [unlockedStages, prefersReducedMotion]
  );

  const submitResponse = useCallback(
    async (response: InvitationResponseType) => {
      if (isSubmitting) return;

      setIsSubmitting(true);
      setPendingResponse(response);
      setSubmissionError(null);
      setSubmissionErrorCode(null);
      setIsUnrecordedPreview(false);

      const result = await submitInvitationResponse(response);

      setIsSubmitting(false);
      setSubmissionResult(result);

      if (result.success) {
        // Only transition to the confirmed response screen AFTER the backend confirms success
        setSelectedResponse(response);
        unlockAndScrollTo('RESPONSE');
      } else {
        setSubmissionError(
          result.errorMessage || 'Could not submit your response. Please try again.'
        );
        setSubmissionErrorCode(result.errorCode || 'SERVER_ERROR');
      }
    },
    [isSubmitting, unlockAndScrollTo]
  );

  const previewResponseWithoutBackend = useCallback(
    (response: InvitationResponseType) => {
      setIsUnrecordedPreview(true);
      setSelectedResponse(response);
      setSubmissionError(null);
      unlockAndScrollTo('RESPONSE');
    },
    [unlockAndScrollTo]
  );

  const resetResponseSelection = useCallback(() => {
    setSelectedResponse(null);
    setPendingResponse(null);
    setSubmissionError(null);
    setSubmissionErrorCode(null);
    setIsUnrecordedPreview(false);
    unlockAndScrollTo('INVITATION');
  }, [unlockAndScrollTo]);

  return {
    currentStage,
    unlockedStages,
    isEnvelopeOpen,
    prefersReducedMotion,
    backendConfigured: isBackendConfigured(),
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
  };
}

