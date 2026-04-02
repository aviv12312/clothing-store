import { useState } from 'react';

const COOKIE_KEY = 'dw_cookie_consent';

const readConsent = () => {
  const saved = localStorage.getItem(COOKIE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export function useCookieConsent() {
  const [consent] = useState(readConsent);

  const hasMarketing = consent?.marketing === true;
  const hasAnalytics = consent?.analytics === true;

  return { consent, hasMarketing, hasAnalytics };
}
