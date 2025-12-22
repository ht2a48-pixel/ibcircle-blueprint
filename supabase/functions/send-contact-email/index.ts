import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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