import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

async function generateToken(secret: string, role: "admin" | "owner"): Promise<{ token: string; expiresAt: number }> {
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
  const encoder = new TextEncoder();
  const payload = JSON.stringify({ exp: expiresAt, iat: Date.now(), role });
  const payloadB64 = btoa(payload);
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return { token: `${payloadB64}.${signatureB64}`, expiresAt };
}

async function verifyToken(token: string, secret: string, requiredRole?: "admin" | "owner"): Promise<{ valid: boolean; expired?: boolean; role?: string }> {
  if (!token || !secret) return { valid: false };
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };
    const [payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw", encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
    );
    const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
    const isValidSignature = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(payloadB64));
    if (!isValidSignature) return { valid: false };
    const payload = JSON.parse(atob(payloadB64));
    if (!payload.exp || typeof payload.exp !== "number") return { valid: false };
    if (Date.now() > payload.exp) return { valid: false, expired: true };
    if (requiredRole && payload.role !== requiredRole) return { valid: false };
    return { valid: true, role: payload.role };
  } catch {
    return { valid: false };
  }
}

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ADMIN_PASSCODE = Deno.env.get("ADMIN_PASSCODE");
    const OWNER_PASSCODE = Deno.env.get("OWNER_PASSCODE");
    const ADMIN_TOKEN_SECRET = Deno.env.get("ADMIN_TOKEN_SECRET");

    if (!ADMIN_PASSCODE || !ADMIN_TOKEN_SECRET) {
      return new Response(JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { action, passcode, token } = body;

    if (action === "verify-passcode") {
      if (!passcode || typeof passcode !== "string" || passcode.length > 50) {
        return new Response(JSON.stringify({ error: "Invalid passcode" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (passcode !== ADMIN_PASSCODE) {
        return new Response(JSON.stringify({ error: "Invalid passcode" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { token: sessionToken, expiresAt } = await generateToken(ADMIN_TOKEN_SECRET, "admin");
      return new Response(JSON.stringify({ success: true, token: sessionToken, expiresAt }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "verify-owner-passcode") {
      if (!OWNER_PASSCODE) {
        return new Response(JSON.stringify({ error: "Owner access not configured" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (!passcode || typeof passcode !== "string" || passcode.length > 50) {
        return new Response(JSON.stringify({ error: "Invalid passcode" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (passcode !== OWNER_PASSCODE) {
        return new Response(JSON.stringify({ error: "Invalid passcode" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { token: sessionToken, expiresAt } = await generateToken(ADMIN_TOKEN_SECRET, "owner");
      return new Response(JSON.stringify({ success: true, token: sessionToken, expiresAt }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "verify-token") {
      if (!token || typeof token !== "string") {
        return new Response(JSON.stringify({ valid: false }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const result = await verifyToken(token, ADMIN_TOKEN_SECRET);
      return new Response(JSON.stringify({ valid: result.valid, expired: result.expired, role: result.role }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "submit-teacher-report") {
      // Requires admin (teacher) token
      const auth = await verifyToken(token ?? "", ADMIN_TOKEN_SECRET, "admin");
      if (!auth.valid) {
        return new Response(JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { report } = body;
      if (!report || typeof report !== "object") {
        return new Response(JSON.stringify({ error: "Missing report" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const teacher_name = typeof report.teacher_name === "string" ? report.teacher_name.trim().slice(0, 100) : null;
      const student_name = report.student_name;
      const subject = report.subject;
      const topics_covered = report.topics_covered;
      const class_date = report.class_date;
      const class_time = report.class_time;
      const class_length_minutes = Number(report.class_length_minutes);
      const report_text = report.report_text;

      let classes_completed: number | null = null;
      if (report.classes_completed !== null && report.classes_completed !== undefined && report.classes_completed !== "") {
        const n = Number(report.classes_completed);
        if (!Number.isFinite(n) || n < 0 || n > 10000 || !Number.isInteger(n)) {
          return new Response(JSON.stringify({ error: "Invalid classes_completed" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        classes_completed = n;
      }

      if (!isNonEmptyString(student_name, 200) ||
          !isNonEmptyString(subject, 100) ||
          !isNonEmptyString(topics_covered, 2000) ||
          !isNonEmptyString(class_date, 20) ||
          !isNonEmptyString(class_time, 20) ||
          !isNonEmptyString(report_text, 10000) ||
          !Number.isFinite(class_length_minutes) ||
          class_length_minutes <= 0 || class_length_minutes > 600) {
        return new Response(JSON.stringify({ error: "Invalid report fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { error: insertError } = await supabase.from("teacher_reports").insert({
        teacher_name,
        student_name: student_name.trim(),
        subject: subject.trim(),
        topics_covered: topics_covered.trim(),
        class_date,
        class_time,
        class_length_minutes,
        classes_completed,
        report_text: report_text.trim(),
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(JSON.stringify({ error: "Failed to save report" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "list-teacher-reports") {
      // Owner only
      const auth = await verifyToken(token ?? "", ADMIN_TOKEN_SECRET, "owner");
      if (!auth.valid) {
        return new Response(JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data, error } = await supabase
        .from("teacher_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) {
        console.error("List error:", error);
        return new Response(JSON.stringify({ error: "Failed to load reports" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ reports: data ?? [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "list-teacher-reports-admin") {
      // Admin (teacher) token — used by the Saved Reports screen so teachers can adjust schedule fields
      const auth = await verifyToken(token ?? "", ADMIN_TOKEN_SECRET, "admin");
      if (!auth.valid) {
        return new Response(JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { data, error } = await supabase
        .from("teacher_reports")
        .select("id, teacher_name, student_name, subject, class_date, class_time, class_length_minutes, classes_completed, created_at")
        .order("class_date", { ascending: false })
        .limit(500);

      if (error) {
        console.error("List (admin) error:", error);
        return new Response(JSON.stringify({ error: "Failed to load reports" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ reports: data ?? [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "update-teacher-report-schedule") {
      // Admin (teacher) token — only schedule fields are editable
      const auth = await verifyToken(token ?? "", ADMIN_TOKEN_SECRET, "admin");
      if (!auth.valid) {
        return new Response(JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { reportId, updates } = body;
      if (!reportId || typeof reportId !== "string" || reportId.length > 100) {
        return new Response(JSON.stringify({ error: "Invalid report id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (!updates || typeof updates !== "object") {
        return new Response(JSON.stringify({ error: "Missing updates" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const class_date = updates.class_date;
      const class_time = updates.class_time;
      const class_length_minutes = Number(updates.class_length_minutes);

      // Validate: YYYY-MM-DD
      if (typeof class_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(class_date)) {
        return new Response(JSON.stringify({ error: "Invalid class_date" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      // Validate: HH:MM or HH:MM:SS
      if (typeof class_time !== "string" || !/^\d{2}:\d{2}(:\d{2})?$/.test(class_time)) {
        return new Response(JSON.stringify({ error: "Invalid class_time" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (!Number.isFinite(class_length_minutes) || class_length_minutes <= 0 || class_length_minutes > 600) {
        return new Response(JSON.stringify({ error: "Invalid class_length_minutes" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { error: updError } = await supabase
        .from("teacher_reports")
        .update({ class_date, class_time, class_length_minutes })
        .eq("id", reportId);

      if (updError) {
        console.error("Update schedule error:", updError);
        return new Response(JSON.stringify({ error: "Failed to update report" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "delete-teacher-report") {
      const auth = await verifyToken(token ?? "", ADMIN_TOKEN_SECRET, "owner");
      if (!auth.valid) {
        return new Response(JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const { reportId } = body;
      if (!reportId || typeof reportId !== "string" || reportId.length > 100) {
        return new Response(JSON.stringify({ error: "Invalid report id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { error: delError } = await supabase.from("teacher_reports").delete().eq("id", reportId);
      if (delError) {
        console.error("Delete error:", delError);
        return new Response(JSON.stringify({ error: "Failed to delete" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    console.error("Error in verify-admin-passcode function:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
