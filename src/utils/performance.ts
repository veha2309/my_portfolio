export type QualityPreference = 'auto' | 'lite' | 'full';

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

const preferenceKey = 'portfolio-quality';

function connection(): NetworkInformation | undefined {
  return (navigator as Navigator & { connection?: NetworkInformation }).connection;
}

export function getQualityPreference(): QualityPreference {
  const query = new URLSearchParams(window.location.search).get('quality');
  if (query === 'lite' || query === 'full') return query;
  const saved = localStorage.getItem(preferenceKey);
  return saved === 'lite' || saved === 'full' ? saved : 'auto';
}

export function setQualityPreference(preference: QualityPreference): void {
  if (preference === 'auto') localStorage.removeItem(preferenceKey);
  else localStorage.setItem(preferenceKey, preference);

  const url = new URL(window.location.href);
  url.searchParams.delete('quality');
  window.location.replace(`${url.pathname}${url.search}${url.hash}`);
}

/** Auto mode deliberately favors reliability over decorative motion. */
export function shouldUseLiteMode(): boolean {
  const preference = getQualityPreference();
  if (preference === 'lite') return true;
  if (preference === 'full') return false;

  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const network = connection();
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || window.matchMedia('(pointer: coarse)').matches
    || window.matchMedia('(max-width: 820px)').matches
    || navigator.hardwareConcurrency <= 6
    || (memory !== undefined && memory <= 6)
    || network?.saveData === true
    || network?.effectiveType === 'slow-2g'
    || network?.effectiveType === '2g';
}

export function applyPerformanceMode(): boolean {
  const lite = shouldUseLiteMode();
  document.documentElement.classList.toggle('performance-lite', lite);
  document.documentElement.dataset.performanceTier = lite ? 'lite' : 'full';
  document.documentElement.dataset.qualityPreference = getQualityPreference();
  return lite;
}

export function watchPerformanceMode(): () => void {
  const queries = [
    window.matchMedia('(prefers-reduced-motion: reduce)'),
    window.matchMedia('(pointer: coarse)'),
    window.matchMedia('(max-width: 820px)'),
  ];
  const network = connection();
  const update = () => applyPerformanceMode();
  queries.forEach((query) => query.addEventListener('change', update));
  network?.addEventListener?.('change', update);
  return () => {
    queries.forEach((query) => query.removeEventListener('change', update));
    network?.removeEventListener?.('change', update);
  };
}
