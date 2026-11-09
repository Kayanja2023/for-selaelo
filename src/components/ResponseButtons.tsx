import React from 'react';
import { Loader2, Heart, Sparkles, Check, AlertCircle, Eye } from 'lucide-react';
import { InvitationResponseType, SubmissionResult } from '../types/invitation';

export interface ResponseButtonsProps {
  labels: {
    yes: string;
    maybe: string;
    no: string;
  };
  isSubmitting: boolean;
  pendingResponse: InvitationResponseType | null;
  submissionError: string | null;
  submissionErrorCode: SubmissionResult['errorCode'] | null;
  onSelectResponse: (response: InvitationResponseType) => void;
  onPreviewUnrecorded: (response: InvitationResponseType) => void;
}

export const ResponseButtons: React.FC<ResponseButtonsProps> = ({
  labels,
  isSubmitting,
  pendingResponse,
  submissionError,
  submissionErrorCode,
  onSelectResponse,
  onPreviewUnrecorded,
}) => {
  return (
    <div className="w-full mt-9">
      <p className="text-center font-handwritten text-2xl text-ink-muted mb-5">
        Your honest answer is the only right one:
      </p>

      {/* Three Equally Accessible, Stationary, Respectful Response Options */}
      <div
        role="group"
        aria-label="Date invitation response options"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4"
      >
        {/* Option 1: YES */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSelectResponse('YES')}
          aria-busy={isSubmitting && pendingResponse === 'YES'}
          className="group relative flex items-center justify-center gap-2.5 w-full min-h-[54px] px-5 py-3.5 rounded-xl bg-burgundy text-ivory font-medium text-sm sm:text-base shadow-paper hover:bg-burgundy-light active:scale-[0.99] transition-all duration-200 disabled:opacity-65 disabled:cursor-not-allowed"
        >
          {isSubmitting && pendingResponse === 'YES' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-champagne-light" aria-hidden="true" />
              <span>Saving response...</span>
            </>
          ) : (
            <>
              <Heart
                className="w-4 h-4 text-champagne-light transition-transform duration-200 group-hover:scale-110"
                aria-hidden="true"
              />
              <span>{labels.yes}</span>
            </>
          )}
        </button>

        {/* Option 2: MAYBE */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSelectResponse('MAYBE')}
          aria-busy={isSubmitting && pendingResponse === 'MAYBE'}
          className="group relative flex items-center justify-center gap-2 w-full min-h-[54px] px-5 py-3.5 rounded-xl bg-blush/90 text-burgundy border border-rose-dusty/60 font-medium text-sm sm:text-base shadow-sm hover:bg-blush-warm active:scale-[0.99] transition-all duration-200 disabled:opacity-65 disabled:cursor-not-allowed"
        >
          {isSubmitting && pendingResponse === 'MAYBE' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-burgundy" aria-hidden="true" />
              <span>Saving response...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-burgundy/80" aria-hidden="true" />
              <span>{labels.maybe}</span>
            </>
          )}
        </button>

        {/* Option 3: NO (Respectful, stationary, equally accessible) */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onSelectResponse('NO')}
          aria-busy={isSubmitting && pendingResponse === 'NO'}
          className="group relative flex items-center justify-center gap-2 w-full min-h-[54px] px-5 py-3.5 rounded-xl bg-ivory text-ink border border-champagne/55 font-medium text-sm sm:text-base shadow-sm hover:bg-ivory-warm active:scale-[0.99] transition-all duration-200 disabled:opacity-65 disabled:cursor-not-allowed"
        >
          {isSubmitting && pendingResponse === 'NO' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-ink-muted" aria-hidden="true" />
              <span>Saving response...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-ink-soft" aria-hidden="true" />
              <span>{labels.no}</span>
            </>
          )}
        </button>
      </div>

      {/* Transparent Backend / Network Status Feedback */}
      {submissionError && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-6 rounded-xl bg-[#FDF8F6] border border-rose-deep/45 p-4 sm:p-5 text-left shadow-sm"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="w-5 h-5 text-burgundy shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 text-sm">
              <p className="font-semibold text-burgundy">
                {submissionErrorCode === 'BACKEND_NOT_CONFIGURED'
                  ? 'Backend Not Configured Yet (Response Not Recorded)'
                  : 'Unable to Record Response Right Now'}
              </p>
              <p className="mt-1 text-ink-muted leading-relaxed">
                {submissionError}
              </p>

              {pendingResponse && (
                <div className="mt-3.5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => onSelectResponse(pendingResponse)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-burgundy text-ivory text-xs font-medium hover:bg-burgundy-light transition-colors"
                  >
                    Retry submitting “{pendingResponse}”
                  </button>

                  <button
                    type="button"
                    onClick={() => onPreviewUnrecorded(pendingResponse)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ivory-paper border border-champagne/60 text-ink text-xs font-medium hover:bg-ivory-warm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-burgundy" aria-hidden="true" />
                    <span>
                      Preview “{pendingResponse}” experience (Unrecorded demo mode)
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

