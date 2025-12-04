'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ReactNode } from 'react';

interface ReCaptchaProviderProps {
  children: ReactNode;
}

export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // If no reCAPTCHA key, just render children without protection
  if (!recaptchaKey) {
    console.warn('reCAPTCHA site key not configured. Bot protection disabled.');
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={recaptchaKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: 'head',
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
