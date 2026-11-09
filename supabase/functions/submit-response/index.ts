// ============================================================================
// SUPABASE EDGE FUNCTION: submit-response
// Runtime: Deno (Supabase Edge Functions)
// Purpose:
//   1. Validate incoming date invitation response (YES / MAYBE / NO)
//   2. Enforce server-side IP rate limiting & duplicate burst protection
//   3. Save the response to PostgreSQL (`date_invitation_responses`)
//   4. Trigger an immediate email notification via Resend API
// ============================================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

type AllowedResponse = 'YES' | 'MAYBE' | 'NO';

interface IncomingSubmission {
  invitation_id?: string;
  recipient?: string;
  response?: string;
  source?: string;
}

const VALID_RESPONSES: readonly AllowedResponse[] = ['YES', 'MAYBE', 'NO'];
const EXPECTED_INVITATION_ID =
  Deno.env.get('EXPECTED_INVITATION_ID') || 'selaelo-first-date-44-stanley';

// Simple in-memory sliding-window rate limiter per Edge isolate
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestLog = new Map<string, number[]>();

function isRateLimited(clientIp: string): boolean {
  const now = Date.now();
  const timestamps = ipRequestLog.get(clientIp) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRequestLog.set(clientIp, recent);
    return true;
  }

  recent.push(now);
  ipRequestLog.set(clientIp, recent);
  return false;
}

function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN') || '*';
  const originHeader =
    allowedOrigin === '*' ? '*' : requestOrigin === allowedOrigin ? allowedOrigin : allowedOrigin;

  return {
    'Access-Control-Allow-Origin': originHeader,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
      { headers: corsHeaders, status: 405 }
    );
  }

  // 2. Rate limiting check
  const clientIp =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    'unknown-ip';

  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Rate limit exceeded. Please wait a few minutes before trying again.',
      }),
      { headers: corsHeaders, status: 429 }
    );
  }

  try {
    // 3. Parse and validate request body
    const body: IncomingSubmission = await req.json();

    const invitationId = body.invitation_id?.trim();
    const responseValue = body.response?.trim().toUpperCase() as AllowedResponse | undefined;
    const recipient = body.recipient?.trim() || 'Selaelo Phosa';
    const source = body.source?.trim() || 'Website';

    if (!invitationId || invitationId !== EXPECTED_INVITATION_ID) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid invitation_id.' }),
        { headers: corsHeaders, status: 400 }
      );
    }

    if (!responseValue || !VALID_RESPONSES.includes(responseValue)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid response value. Expected YES, MAYBE, or NO.',
        }),
        { headers: corsHeaders, status: 400 }
      );
    }

    // 4. Connect to Supabase PostgreSQL using server-only credentials
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server database configuration is incomplete.',
        }),
        { headers: corsHeaders, status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });

    // Prevent accidental duplicate submission within 15 seconds
    const fifteenSecondsAgo = new Date(Date.now() - 15000).toISOString();
    const { data: recentDuplicates } = await supabaseAdmin
      .from('date_invitation_responses')
      .select('id, created_at, response')
      .eq('invitation_id', invitationId)
      .eq('response', responseValue)
      .gte('created_at', fifteenSecondsAgo)
      .limit(1);

    if (recentDuplicates && recentDuplicates.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          id: recentDuplicates[0].id,
          created_at: recentDuplicates[0].created_at,
          emailSent: true,
          deduplicated: true,
        }),
        { headers: corsHeaders, status: 200 }
      );
    }

    // 5. Insert response into `date_invitation_responses`
    const { data: insertedRow, error: insertError } = await supabaseAdmin
      .from('date_invitation_responses')
      .insert({
        response: responseValue,
        recipient,
        invitation_id: invitationId,
        source,
      })
      .select('id, created_at')
      .single();

    if (insertError || !insertedRow) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save your response to the database.',
        }),
        { headers: corsHeaders, status: 500 }
      );
    }

    // 6. Trigger email notification through Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL');
    const resendFromEmail =
      Deno.env.get('RESEND_FROM_EMAIL') ||
      'A Little Something for Selaelo <onboarding@resend.dev>';

    let emailSent = false;
    const formattedTimestamp = new Date(insertedRow.created_at).toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    if (resendApiKey && notificationEmail) {
      const emailHtml = `
        <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background-color: #FAF6F0; border: 1px solid #D4AF37; color: #2B2121;">
          <p style="font-family: sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #5C1D24; margin-bottom: 8px;">
            A Little Something for Selaelo
          </p>
          <h1 style="font-size: 24px; color: #5C1D24; margin-top: 0; margin-bottom: 20px;">
            Selaelo responded to your date invitation!
          </h1>
          <div style="background-color: #FFFFFF; padding: 20px 24px; border-left: 4px solid #5C1D24; margin-bottom: 24px;">
            <p style="margin: 8px 0;"><strong>Recipient:</strong> ${recipient}</p>
            <p style="margin: 8px 0;"><strong>Response:</strong> <span style="font-size: 18px; color: #5C1D24; font-weight: bold;">${responseValue}</span></p>
            <p style="margin: 8px 0;"><strong>Date and time of response:</strong> ${formattedTimestamp} (SAST)</p>
            <p style="margin: 8px 0;"><strong>Invitation:</strong> A Little Something for Selaelo</p>
          </div>
          <p style="font-family: sans-serif; font-size: 12px; color: #7D6B6B; margin-bottom: 0;">
            Record ID: ${insertedRow.id} · Source: ${source}
          </p>
        </div>
      `;

      const emailText = [
        'Selaelo responded to your date invitation!',
        '',
        `Recipient: ${recipient}`,
        `Response: ${responseValue}`,
        `Date and time of response: ${formattedTimestamp} (SAST)`,
        'Invitation: A Little Something for Selaelo.',
      ].join('\n');

      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: resendFromEmail,
            to: [notificationEmail],
            subject: 'Selaelo responded to your date invitation!',
            html: emailHtml,
            text: emailText,
          }),
        });

        emailSent = resendRes.ok;
        if (!resendRes.ok) {
          const errText = await resendRes.text();
          console.error('Resend API warning:', errText);
        }
      } catch (emailErr) {
        console.error('Resend request failed:', emailErr);
      }
    }

    // 7. Return successful confirmation to the frontend
    return new Response(
      JSON.stringify({
        success: true,
        id: insertedRow.id,
        response: responseValue,
        created_at: insertedRow.created_at,
        emailSent,
      }),
      { headers: corsHeaders, status: 200 }
    );
  } catch (err) {
    console.error('Unexpected Edge Function error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid request payload or unexpected server error.',
      }),
      { headers: corsHeaders, status: 400 }
    );
  }
});

