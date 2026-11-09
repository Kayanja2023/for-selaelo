import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from '../App';
import { invitationConfig } from '../config/invitation';
import {
  validateSubmissionPayload,
  submitInvitationResponse,
  resetSubmissionCooldownForTests,
} from '../services/responseService';

// Mock IntersectionObserver & scrollIntoView for jsdom
beforeEach(() => {
  resetSubmissionCooldownForTests();
  Element.prototype.scrollIntoView = vi.fn();

  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('A Little Something for Selaelo — Full Experience Suite', () => {
  it('renders Stage 1 (The Envelope) with recipient label, A Girl from Ermelo, and instruction', () => {
    render(<App />);
    expect(screen.getAllByText('For Selaelo').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/A Girl from Ermelo/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('A little something for you.')).toBeInTheDocument();
  });

  it('walks through Envelope -> Letter -> Scrapbook -> Date Invitation -> YES, MAYBE, NO Response Screens', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://testproject.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(
        JSON.stringify({
          success: true,
          id: '123e4567-e89b-12d3-a456-426614174000',
          created_at: new Date().toISOString(),
          emailSent: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    render(<App />);

    // Enable Still Mode (reduced motion) for instant transitions during test
    const stillModeBtn = screen.getByTitle('Toggle simplified animations');
    fireEvent.click(stillModeBtn);

    // 1. Open Envelope
    const openBtn = screen.getByRole('button', {
      name: /Break the seal & open letter/i,
    });
    fireEvent.click(openBtn);

    // 2. Verify Personal Letter appears with Plato Dirty Carribean footnote
    await waitFor(() => {
      expect(screen.getByText('Dear Selaelo,')).toBeInTheDocument();
    });
    expect(
      screen.getByText(/Now, I could have just sent you a normal message/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Andile.')).toBeInTheDocument();
    expect(screen.getByText('Plato Dirty Carribean')).toBeInTheDocument();

    // 3. Advance to Scrapbook
    const toScrapbookBtn = screen.getByRole('button', {
      name: /There's a little more/i,
    });
    fireEvent.click(toScrapbookBtn);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Someone who makes getting to know her a little more interesting/i
        )
      ).toBeInTheDocument();
    });

    // Verify both photographs & all 3 personal annotations render
    expect(
      screen.getByAltText('Portrait photograph of Selaelo')
    ).toBeInTheDocument();
    expect(
      screen.getByAltText('Portrait photograph of Andile')
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Some of us run on a Plato Dirty Carribean\. Others are busy building Power BI magic with the lovely Joy\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Important research finding: spending time together might actually be a good idea\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /A little golden detail for someone with an eye for the finer things\./i
      )
    ).toBeInTheDocument();

    // 4. Advance to Date Invitation
    const toInvitationBtn = screen.getByRole('button', {
      name: /Okay, here's what I wanted to ask/i,
    });
    fireEvent.click(toInvitationBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Selaelo, would you let me take you on a date?')
      ).toBeInTheDocument();
    });

    // Verify destination, Godzilla Minus Zero plan, and date/time details
    expect(screen.getByText('44 Stanley, Johannesburg')).toBeInTheDocument();
    expect(
      screen.getByText('Dinner followed by Godzilla Minus Zero.')
    ).toBeInTheDocument();
    expect(screen.getByText('Wed. Nov 11, 2026')).toBeInTheDocument();
    expect(screen.getByText('8:00pm SAST')).toBeInTheDocument();

    // 5A. Click YES response and verify celebratory screen + Closing signature
    const yesBtn = screen.getByRole('button', { name: /Yes, I'd love to!/i });
    fireEvent.click(yesBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Well, that just made my day! ♡')
      ).toBeInTheDocument();
    });
    expect(
      screen.getByText(
        /Made with a little creativity, a little caffeine, and genuine intention\./i
      )
    ).toBeInTheDocument();

    // 5B. Return and test MAYBE response screen
    resetSubmissionCooldownForTests();
    fireEvent.click(
      screen.getByRole('button', { name: /Return to the invitation card/i })
    );
    fireEvent.click(
      screen.getByRole('button', { name: /Maybe, let's see/i })
    );

    await waitFor(() => {
      expect(screen.getByText("That's perfectly okay. ♡")).toBeInTheDocument();
    });

    // 5C. Return and test NO response screen
    resetSubmissionCooldownForTests();
    fireEvent.click(
      screen.getByRole('button', { name: /Return to the invitation card/i })
    );
    fireEvent.click(screen.getByRole('button', { name: /No, thank you\./i }));

    await waitFor(() => {
      expect(
        screen.getByText('Thank you for being honest. ♡')
      ).toBeInTheDocument();
    });
  });

  it('validates outgoing submission payloads accurately', () => {
    const valid = validateSubmissionPayload({
      invitation_id: invitationConfig.invitationId,
      recipient: 'Selaelo Phosa',
      response: 'YES',
      source: 'Website',
      submitted_at: new Date().toISOString(),
    });
    expect(valid.valid).toBe(true);

    const invalidId = validateSubmissionPayload({
      invitation_id: 'wrong-id',
      recipient: 'Selaelo Phosa',
      response: 'YES',
      source: 'Website',
      submitted_at: new Date().toISOString(),
    });
    expect(invalidId.valid).toBe(false);
  });

  it('does not pretend backend saved response when credentials and email are empty', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');
    vi.stubEnv('VITE_WEB3FORMS_ACCESS_KEY', '');
    const originalEmail = invitationConfig.sender.notificationEmail;
    const originalW3fKey = invitationConfig.sender.web3FormsAccessKey;
    invitationConfig.sender.notificationEmail = '';
    invitationConfig.sender.web3FormsAccessKey = '';

    try {
      const result = await submitInvitationResponse('YES');
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('BACKEND_NOT_CONFIGURED');
    } finally {
      invitationConfig.sender.notificationEmail = originalEmail;
      invitationConfig.sender.web3FormsAccessKey = originalW3fKey;
    }
  });

  it('submits YES, MAYBE, and NO responses to the Edge Function and confirms success', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://testproject.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(
        JSON.stringify({
          success: true,
          id: '123e4567-e89b-12d3-a456-426614174000',
          created_at: new Date().toISOString(),
          emailSent: true,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const yesResult = await submitInvitationResponse('YES');
    expect(yesResult.success).toBe(true);
    expect(yesResult.emailSent).toBe(true);

    resetSubmissionCooldownForTests();
    const maybeResult = await submitInvitationResponse('MAYBE');
    expect(maybeResult.success).toBe(true);

    resetSubmissionCooldownForTests();
    const noResult = await submitInvitationResponse('NO');
    expect(noResult.success).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });
});
