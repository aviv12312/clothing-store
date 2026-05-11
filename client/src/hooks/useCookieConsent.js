import { useEffect, useState } from 'react';

const COOKIE_KEY = 'dw_cookie_consent';

const readConsent = () => {
  if (typeof window === 'undefined') return null;

  const saved = localStorage.getItem(COOKIE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

export function useCookieConsent() {
  const [consent, setConsent] = useState(readConsent);

  useEffect(() => {
    const refreshConsent = () => setConsent(readConsent());

    window.addEventListener('storage', refreshConsent);
    window.addEventListener('dw-cookie-consent-change', refreshConsent);

    return () => {
      window.removeEventListener('storage', refreshConsent);
      window.removeEventListener('dw-cookie-consent-change', refreshConsent);
    };
  }, []);

  const hasMarketing = consent?.marketing === true;
  const hasAnalytics = consent?.analytics === true;

  return { consent, hasMarketing, hasAnalytics };
}
