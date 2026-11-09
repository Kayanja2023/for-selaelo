import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { invitationConfig } from '../config/invitation';
import {
  InvitationResponseType,
  SubmissionPayload,
  SubmissionResult,
} from '../types/invitation';

const VALID_RESPONSES: readonly InvitationResponseType[] = ['YES', 'MAYBE', 'NO'];

// Minimum cooldown between submissions from the same session (ms)
const SUBMISSION_COOLDOWN_MS = 4000;
let lastSubmissionTimestamp = 0;
let inFlightPromise: Promise<SubmissionResult> | null = null;

/**
 * Resolves the configured recipient inbox email for FormSubmit AJAX delivery.
 */
export function getConfiguredNotificationEmail(): string | null {
  const email = invitationConfig.sender.notificationEmail?.trim();
  if (!email || email === 'andile@example.com' || !email.includes('@')) {
    return null;
  }
  return email;
}

/**
 * Resolves the active Web3Forms access key (from .env or central config).
 */
export function getWeb3FormsAccessKey(): string | null {
  const envKey = (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined)?.trim();
  const configKey = invitationConfig.sender.web3FormsAccessKey?.trim();
  const key = envKey || configKey;

  if (!key || key === 'your-web3forms-access-key') {
    return null;
  }
  return key;
}

/**
 * Checks whether Supabase frontend credentials have been configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const customFunctionUrl = import.meta.env.VITE_SUBMIT_FUNCTION_URL as string | undefined;

  if (customFunctionUrl && !customFunctionUrl.includes('your-project-ref')) {
    return true;
  }

  if (!url || !anonKey) {
    return false;
  }

  if (
    url.includes('your-project-ref.supabase.co') ||
    anonKey === 'your-supabase-anon-public-key' ||
    url.trim() === '' ||
    anonKey.trim() === ''
  ) {
    return false;
  }

  return true;
}

/**
 * Returns true if Supabase, Web3Forms, or a real notification email inbox is configured.
 */
export function isBackendConfigured(): boolean {
  return (
    isSupabaseConfigured() ||
    Boolean(getWeb3FormsAccessKey()) ||
    Boolean(getConfiguredNotificationEmail())
  );
}

let supabaseClientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseClientInstance) {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    if (url && anonKey) {
      supabaseClientInstance = createClient(url, anonKey, {
        auth: { persistSession: false },
      });
    }
  }
  return supabaseClientInstance;
}

/**
 * Validates outgoing payload before sending to the backend.
 */
export function validateSubmissionPayload(
  payload: SubmissionPayload
): { valid: boolean; error?: string } {
  if (!payload.invitation_id || payload.invitation_id !== invitationConfig.invitationId) {
    return { valid: false, error: 'Invalid invitation identifier.' };
  }

  if (!VALID_RESPONSES.includes(payload.response)) {
    return { valid: false, error: 'Invalid response selection. Must be YES, MAYBE, or NO.' };
  }

  if (!payload.recipient || payload.recipient.trim().length < 2) {
    return { valid: false, error: 'Recipient name is required.' };
  }

  return { valid: true };
}

/**
 * Submits Selaelo's response via:
 * 1. Supabase Edge Function (if VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY are set)
 * 2. Web3Forms (if VITE_WEB3FORMS_ACCESS_KEY is set)
 * 3. FormSubmit AJAX direct-to-inbox (`andilemlwanga@gmail.com`)
 */
export async function submitInvitationResponse(
  response: InvitationResponseType
): Promise<SubmissionResult> {
  if (inFlightPromise) {
    return inFlightPromise;
  }

  const now = Date.now();
  if (now - lastSubmissionTimestamp < SUBMISSION_COOLDOWN_MS) {
    return {
      success: false,
      errorCode: 'RATE_LIMITED',
      errorMessage: 'Please wait a moment before submitting again.',
    };
  }

  const payload: SubmissionPayload = {
    invitation_id: invitationConfig.invitationId,
    recipient: invitationConfig.recipient.fullName,
    response,
    source: 'Website',
    submitted_at: new Date().toISOString(),
  };

  const validation = validateSubmissionPayload(payload);
  if (!validation.valid) {
    return {
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errorMessage: validation.error || 'Invalid submission data.',
    };
  }

  const supabaseReady = isSupabaseConfigured();
  const web3FormsKey = getWeb3FormsAccessKey();
  const notificationEmail = getConfiguredNotificationEmail();

  if (!supabaseReady && !web3FormsKey && !notificationEmail) {
    return {
      success: false,
      errorCode: 'BACKEND_NOT_CONFIGURED',
      errorMessage:
        'Backend notification inbox is not configured yet. Set sender.notificationEmail in src/config/invitation.ts.',
    };
  }

  inFlightPromise = (async (): Promise<SubmissionResult> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const formattedSastTime = new Date(payload.submitted_at).toLocaleString('en-ZA', {
        timeZone: 'Africa/Johannesburg',
        dateStyle: 'full',
        timeStyle: 'long',
      });

      // PATH 1: Supabase Edge Function + PostgreSQL + Resend
      if (supabaseReady) {
        const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)?.replace(/\/$/, '');
        const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
        const endpoint =
          (import.meta.env.VITE_SUBMIT_FUNCTION_URL as string) ||
          `${supabaseUrl}/functions/v1/submit-response`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(anonKey
              ? {
                  Authorization: `Bearer ${anonKey}`,
                  apikey: anonKey,
                }
              : {}),
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.status === 429) {
          return {
            success: false,
            errorCode: 'RATE_LIMITED',
            errorMessage: 'Too many attempts in a short period. Please wait a minute and try again.',
          };
        }

        const data = await res.json().catch(() => null);

        if (!res.ok || !data?.success) {
          return {
            success: false,
            errorCode: res.status >= 400 && res.status < 500 ? 'VALIDATION_ERROR' : 'SERVER_ERROR',
            errorMessage:
              data?.error ||
              `Could not record your response right now (HTTP ${res.status}). Please try again.`,
          };
        }

        lastSubmissionTimestamp = Date.now();

        return {
          success: true,
          submissionId: data.id,
          emailSent: Boolean(data.emailSent),
          recordedAt: data.created_at || payload.submitted_at,
        };
      }

      // PATH 2: Web3Forms API
      if (web3FormsKey) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            subject: `Selaelo responded "${payload.response}" to your date invitation! ♡`,
            from_name: 'A Little Something for Selaelo',
            recipient: payload.recipient,
            response: payload.response,
            date_and_time_sast: formattedSastTime,
            proposed_date: `${invitationConfig.dateDetails.proposedDate} at ${invitationConfig.dateDetails.proposedTime}`,
            venue_and_plan: `${invitationConfig.dateDetails.location} — ${invitationConfig.dateDetails.movieDescription}`,
            invitation_id: payload.invitation_id,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.success) {
          return {
            success: false,
            errorCode: 'SERVER_ERROR',
            errorMessage:
              data?.message || 'Could not send your response right now. Please try again.',
          };
        }

        lastSubmissionTimestamp = Date.now();
        return {
          success: true,
          submissionId: `w3f-${Date.now()}`,
          emailSent: true,
          recordedAt: payload.submitted_at,
        };
      }

      // PATH 3: Zero-Key Direct Inbox Delivery via FormSubmit AJAX (`andilemlwanga@gmail.com`)
      const formSubmitEndpoint = `https://formsubmit.co/ajax/${encodeURIComponent(
        notificationEmail!
      )}`;

      const res = await fetch(formSubmitEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Selaelo responded "${payload.response}" to your date invitation! ♡`,
          _template: 'box',
          _captcha: 'false',
          Recipient: payload.recipient,
          Response: payload.response,
          'Date & Time of Response': `${formattedSastTime} (SAST)`,
          'Proposed Date': `${invitationConfig.dateDetails.proposedDate} at ${invitationConfig.dateDetails.proposedTime}`,
          'Venue & Plan': `${invitationConfig.dateDetails.location} — ${invitationConfig.dateDetails.movieDescription}`,
          Invitation: 'A Little Something for Selaelo',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.status === 429) {
        return {
          success: false,
          errorCode: 'RATE_LIMITED',
          errorMessage: 'Too many attempts in a short period. Please wait a minute and try again.',
        };
      }

      const data = await res.json().catch(() => null);
      const isOk = res.ok && (data?.success === 'true' || data?.success === true);

      if (!isOk) {
        return {
          success: false,
          errorCode: 'SERVER_ERROR',
          errorMessage:
            data?.message ||
            'Could not send your response right now. Please check your connection and try again.',
        };
      }

      lastSubmissionTimestamp = Date.now();
      return {
        success: true,
        submissionId: `fs-${Date.now()}`,
        emailSent: true,
        recordedAt: payload.submitted_at,
      };
    } catch (error) {
      const isAbort = error instanceof DOMException && error.name === 'AbortError';
      return {
        success: false,
        errorCode: 'NETWORK_ERROR',
        errorMessage: isAbort
          ? 'The connection timed out while saving your response. Please check your internet connection and try again.'
          : 'Unable to reach the server right now. Please check your connection or try again in a moment.',
      };
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

/**
 * Resets client-side rate limit timer (used in automated test suites).
 */
export function resetSubmissionCooldownForTests(): void {
  lastSubmissionTimestamp = 0;
  inFlightPromise = null;
}
