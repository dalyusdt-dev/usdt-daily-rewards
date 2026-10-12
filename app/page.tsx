
'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export default function Home() {
  const [language, setLanguage] = useState<'ku' | 'en'>('ku');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  const [busy, setBusy] = useState(false);

  const ku = language === 'ku';

  async function signUp() {
    if (!supabase) {
      setMessage('Supabase environment variables are missing.');
      return;
    }

    setBusy(true);
    setMessage('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setBusy(false);
    setMessage(
      error
        ? error.message
        : ku
          ? 'تۆمارکردن سەرکەوتوو بوو. ئیمەیڵەکەت بپشکنە.'
          : 'Registration submitted. Check your email.'
    );
  }

  async function signIn() {
    if (!supabase) {
      setMessage('Supabase environment variables are missing.');
      return;
    }

    setBusy(true);
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setUser(data.user.email ?? email);
    setMessage(ku ? 'بە سەرکەوتوویی چوویتە ژوورەوە.' : 'Signed in successfully.');
  }

  async function signOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setUser('');
    setMessage(ku ? 'چوویتە دەرەوە.' : 'Signed out.');
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0b1220',
        color: '#f8fafc',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
      }}
      dir={ku ? 'rtl' : 'ltr'}
    >
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 36,
          }}
        >
          <strong style={{ fontSize: 20, color: '#4ade80' }}>
            USDT Daily Rewards
          </strong>

          <button
            onClick={() => setLanguage(ku ? 'en' : 'ku')}
            style={buttonStyle}
          >
            {ku ? 'English' : 'کوردی'}
          </button>
        </header>

        <section
          style={{
            background: '#172033',
            padding: 28,
            borderRadius: 18,
            border: '1px solid #29364b',
          }}
        >
          <h1 style={{ fontSize: 27, marginTop: 0 }}>
            {ku ? 'بەخێربێیت' : 'Welcome'}
          </h1>

          <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
            {ku
              ? 'هەژمارێک دروست بکە یان بچۆ ژوورەوە بۆ بەکارهێنانی ئەپەکە.'
              : 'Create an account or sign in to use the application.'}
          </p>

          {!user ? (
            <>
              <label htmlFor="email">
                {ku ? 'ئیمەیڵ' : 'Email'}
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />

              <label htmlFor="password">
                {ku ? 'وشەی نهێنی' : 'Password'}
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={ku ? 'لانیکەم ٨ پیت' : 'At least 8 characters'}
                style={inputStyle}
              />

              <button
                onClick={signIn}
                disabled={busy || !email || !password}
                style={{ ...buttonStyle, width: '100%', marginTop: 16 }}
              >
                {busy
                  ? '...'
                  : ku
                    ? 'چوونە ژوورەوە'
                    : 'Sign in'}
              </button>

              <button
                onClick={signUp}
                disabled={busy || !email || password.length < 8}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  marginTop: 10,
                  background: '#166534',
                }}
              >
                {ku ? 'دروستکردنی هەژمار' : 'Create account'}
              </button>
            </>
          ) : (
            <>
              <p>
                {ku ? 'بەخێربێیت:' : 'Signed in as:'} {user}
              </p>

              <p style={{ color: '#fbbf24', lineHeight: 1.8 }}>
                {ku
                  ? 'داواکارییەکانی وەرگرتنی USDT و پەکەجەکان هێشتا چالاک نین.'
                  : 'USDT deposits and packages are not enabled yet.'}
              </p>

              <button onClick={signOut} style={buttonStyle}>
                {ku ? 'چوونە دەرەوە' : 'Sign out'}
              </button>
            </>
          )}

          {message && (
            <p
              role="status"
              style={{
                marginTop: 20,
                padding: 12,
                borderRadius: 8,
                background: '#0b1220',
                overflowWrap: 'anywhere',
                lineHeight: 1.7,
              }}
            >
              {message}
            </p>
          )}
        </section>

        <footer
          style={{
            marginTop: 24,
            color: '#94a3b8',
            fontSize: 13,
            lineHeight: 1.8,
            textAlign: 'center',
          }}
        >
          {ku
            ? 'ئاگاداری: هیچ قازانجێک گەرەنتی نییە. پێش هەر پارەدانێک پشتڕاستکردنەوە و پاراستنی هەژمارەکەت بپشکنە.'
            : 'Notice: No returns are guaranteed. Verify security and payment details before sending funds.'}
        </footer>
      </div>
    </main>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: 13,
  marginTop: 8,
  marginBottom: 18,
  borderRadius: 8,
  border: '1px solid #475569',
  background: '#0b1220',
  color: '#f8fafc',
  fontSize: 16,
};

const buttonStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#2563eb',
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
};
