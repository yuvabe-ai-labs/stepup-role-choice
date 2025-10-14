import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Credentials': 'true',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, email, password, rememberMe } = await req.json();
    
    console.log('[secure-auth] Action:', action, 'RememberMe:', rememberMe);

    if (action === 'signIn') {
      // Sign in user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('[secure-auth] Sign in error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('[secure-auth] Sign in successful for:', email);

      // Set session duration based on rememberMe
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day

      // Set HttpOnly cookie with session
      const headers = new Headers(corsHeaders);
      headers.set('Content-Type', 'application/json');
      headers.append(
        'Set-Cookie',
        `sb-access-token=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
      );
      headers.append(
        'Set-Cookie',
        `sb-refresh-token=${data.session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`
      );

      return new Response(
        JSON.stringify({ 
          success: true,
          user: data.user,
          session: data.session 
        }),
        { headers }
      );
    }

    if (action === 'signOut') {
      // Clear cookies
      const headers = new Headers(corsHeaders);
      headers.set('Content-Type', 'application/json');
      headers.append(
        'Set-Cookie',
        'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      );
      headers.append(
        'Set-Cookie',
        'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
      );

      console.log('[secure-auth] Sign out successful');

      return new Response(
        JSON.stringify({ success: true }),
        { headers }
      );
    }

    if (action === 'refresh') {
      // Get refresh token from cookie
      const cookies = req.headers.get('cookie') || '';
      const refreshToken = cookies
        .split(';')
        .find(c => c.trim().startsWith('sb-refresh-token='))
        ?.split('=')[1];

      if (!refreshToken) {
        return new Response(
          JSON.stringify({ error: 'No refresh token found' }),
          { 
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Refresh session
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        console.error('[secure-auth] Refresh error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      console.log('[secure-auth] Session refreshed successfully');

      // Update cookies with new session
      const headers = new Headers(corsHeaders);
      headers.set('Content-Type', 'application/json');
      headers.append(
        'Set-Cookie',
        `sb-access-token=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`
      );
      headers.append(
        'Set-Cookie',
        `sb-refresh-token=${data.session.refresh_token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`
      );

      return new Response(
        JSON.stringify({ 
          success: true,
          session: data.session 
        }),
        { headers }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[secure-auth] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
