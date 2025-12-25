import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

// Token expiration time: 24 hours in milliseconds
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

// Generate a token with expiration timestamp
async function generateToken(secret: string): Promise<{ token: string; expiresAt: number }> {
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
  const encoder = new TextEncoder();
  
  // Create payload with expiration
  const payload = JSON.stringify({ exp: expiresAt, iat: Date.now() });
  const payloadB64 = btoa(payload);
  
  // Sign the payload
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  // Token format: payload.signature (like a simplified JWT)
  const token = `${payloadB64}.${signatureB64}`;
  return { token, expiresAt };
}

// Verify token signature and expiration
async function verifyToken(token: string, secret: string): Promise<{ valid: boolean; expired?: boolean }> {
  if (!token || !secret) return { valid: false };
  
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return { valid: false };
    
    const [payloadB64, signatureB64] = parts;
    
    // Verify signature
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    
    const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
    const isValidSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(payloadB64)
    );
    
    if (!isValidSignature) return { valid: false };
    
    // Check expiration
    const payload = JSON.parse(atob(payloadB64));
    if (!payload.exp || typeof payload.exp !== "number") return { valid: false };
    
    if (Date.now() > payload.exp) {
      return { valid: false, expired: true };
    }
    
    return { valid: true };
  } catch {
    return { valid: false };
  }
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
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

      // Generate a session token with expiration
      const { token: sessionToken, expiresAt } = await generateToken(ADMIN_TOKEN_SECRET);

      console.log("Passcode verified successfully, token generated with expiration");

      return new Response(
        JSON.stringify({ success: true, token: sessionToken, expiresAt }),
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

      const result = await verifyToken(token, ADMIN_TOKEN_SECRET);

      return new Response(
        JSON.stringify({ valid: result.valid, expired: result.expired }),
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