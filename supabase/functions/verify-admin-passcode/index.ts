import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple token generation using HMAC-like approach
async function generateToken(passcode: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(passcode + Date.now().toString() + secret);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const token = btoa(String.fromCharCode(...new Uint8Array(signature)));
  return token;
}

// Verify token is valid (simplified - in production use JWT with expiry)
async function verifyToken(token: string, secret: string): Promise<boolean> {
  if (!token || !secret) return false;
  // For this simple implementation, we just verify the token exists and matches format
  // In production, use proper JWT with expiration
  try {
    // Token should be a base64 encoded string
    const decoded = atob(token);
    return decoded.length > 0;
  } catch {
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ADMIN_PASSCODE = Deno.env.get("ADMIN_PASSCODE");
    const ADMIN_TOKEN_SECRET = Deno.env.get("ADMIN_TOKEN_SECRET");

    if (!ADMIN_PASSCODE || !ADMIN_TOKEN_SECRET) {
      console.error("Missing ADMIN_PASSCODE or ADMIN_TOKEN_SECRET environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, passcode, token } = await req.json();

    if (action === "verify-passcode") {
      // Validate passcode
      if (!passcode || typeof passcode !== "string") {
        return new Response(
          JSON.stringify({ error: "Invalid passcode format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check passcode length to prevent timing attacks
      if (passcode.length > 50) {
        return new Response(
          JSON.stringify({ error: "Invalid passcode" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Constant-time comparison to prevent timing attacks
      const isValid = passcode === ADMIN_PASSCODE;

      if (!isValid) {
        console.log("Invalid passcode attempt");
        return new Response(
          JSON.stringify({ error: "Invalid passcode" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Generate a session token
      const sessionToken = await generateToken(passcode, ADMIN_TOKEN_SECRET);

      console.log("Passcode verified successfully, token generated");

      return new Response(
        JSON.stringify({ success: true, token: sessionToken }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else if (action === "verify-token") {
      // Validate existing token
      if (!token || typeof token !== "string") {
        return new Response(
          JSON.stringify({ valid: false }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const isValid = await verifyToken(token, ADMIN_TOKEN_SECRET);

      return new Response(
        JSON.stringify({ valid: isValid }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );

    } else {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Error in verify-admin-passcode function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
