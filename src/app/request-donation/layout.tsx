'use client';

import { ReCaptchaProvider } from '@/components/ReCaptchaProvider';
import { ReactNode } from 'react';

export default function RequestDonationLayout({ children }: { children: ReactNode }) {
  return <ReCaptchaProvider>{children}</ReCaptchaProvider>;
}
