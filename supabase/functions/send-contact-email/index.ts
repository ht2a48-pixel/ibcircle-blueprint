import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://ibcircle.co.kr',
  'https://www.ibcircle.co.kr',
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
];

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') || '';
  
  // Check if origin is in allowed list or is a Lovable preview domain
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || 
    origin.includes('.lovableproject.com') ||
    origin.includes('.lovable.app');
  
  if (isAllowed) {
    return {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
  }
  
  // Return restrictive headers for unknown origins
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 submissions per hour per IP

// In-memory rate limit store (resets on function cold start, but provides basic protection)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getClientIP(req: Request): string {
  // Try various headers for client IP
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  // Fallback to a default identifier
  return "unknown";
}

function checkRateLimit(clientIP: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIP);
  
  // Clean up expired entries
  if (record && now > record.resetAt) {
    rateLimitStore.delete(clientIP);
  }
  
  const currentRecord = rateLimitStore.get(clientIP);
  
  if (!currentRecord) {
    // First request from this IP
    rateLimitStore.set(clientIP, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true };
  }
  
  if (currentRecord.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((currentRecord.resetAt - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment count
  currentRecord.count++;
  return { allowed: true };
}

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const sendEmail = async (to: string[], subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "IBCircle <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    const err: any = new Error(`Failed to send email: ${text}`);
    err.status = response.status;
    err.provider = 'resend';
    throw err;
  }

  return response.json();
};

const handler = async (req: Request): Promise<Response> => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "너무 많은 요청입니다. 잠시 후 다시 시도해주세요.",
          retryAfter: rateLimitResult.retryAfter 
        }),
        {
          status: 429,
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": String(rateLimitResult.retryAfter),
            ...corsHeaders 
          },
        }
      );
    }

    const { name, email, message }: ContactEmailRequest = await req.json();

    console.log("Received contact form submission");

    // Validate inputs - presence check
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "필수 항목을 모두 입력해주세요." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate input lengths
    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "입력 내용이 너무 깁니다." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "유효한 이메일 주소를 입력해주세요." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Sanitize inputs for HTML
    const escapeHtml = (text: string): string => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    };

    const safeName = escapeHtml(name.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeMessage = escapeHtml(message.trim());

    // Send notification email to the business
    const notificationResult = await sendEmail(
      ["ht2a4.8@gmail.com"],
      `새로운 문의: ${safeName}님`,
      `
        <h2>IBCircle 웹사이트 문의</h2>
        <p><strong>이름:</strong> ${safeName}</p>
        <p><strong>이메일:</strong> ${safeEmail}</p>
        <p><strong>문의 내용:</strong></p>
        <p>${safeMessage.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">이 이메일은 IBCircle 웹사이트 문의 양식에서 자동으로 발송되었습니다.</p>
      `
    );

    console.log("Notification email sent successfully");

    // Send confirmation email to the user
    // NOTE: Resend "testing" mode may block sending to arbitrary recipients (403).
    // We still consider the inquiry received as long as the notification email to the business succeeds.
    try {
      const confirmationResult = await sendEmail(
        [email],
        "문의가 접수되었습니다 - IBCircle",
        `
          <h2>${safeName}님, 문의해 주셔서 감사합니다!</h2>
          <p>귀하의 문의가 정상적으로 접수되었습니다.</p>
          <p>영업일 기준 24시간 이내에 답변 드리겠습니다.</p>
          <hr>
          <p><strong>보내신 내용:</strong></p>
          <p>${safeMessage.replace(/\n/g, '<br>')}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">IBCircle | 프리미엄 IB 교육 및 입시 컨설팅</p>
        `
      );

      console.log("Confirmation email sent:", confirmationResult);
    } catch (err: any) {
      // If Resend is in testing mode, it can reject non-owner recipients with 403.
      if (err?.status === 403) {
        console.warn("Confirmation email skipped (Resend testing mode restriction)");
      } else if (err?.status === 429) {
        console.warn("Confirmation email rate-limited; skipped");
      } else {
        // Don't fail the whole request if confirmation fails unexpectedly.
        console.warn("Confirmation email failed; inquiry still received", err);
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);

    // Propagate rate limiting properly (so client can show correct message)
    const status = typeof error?.status === 'number' ? error.status : 500;
    if (status === 429) {
      return new Response(
        JSON.stringify({ error: "요청이 많아 잠시 후 다시 시도해주세요." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Return generic error message to prevent information leakage
    return new Response(
      JSON.stringify({ error: "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);