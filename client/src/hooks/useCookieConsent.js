import { useState, useEffect } from 'react';

const COOKIE_KEY = 'dw_cookie_consent';

export function useCookieConsent() {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (saved) {
      try { setConsent(JSON.parse(saved)); } catch { setConsent(null); }
    }
  }, []);

  const hasMarketing = consent?.marketing === true;
  const hasAnalytics = consent?.analytics === true;

  return { consent, hasMarketing, hasAnalytics };
}
