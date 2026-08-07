import { getQualityPreference, setQualityPreference } from '../utils/performance';
import type { QualityPreference } from '../utils/performance';

export default function QualityControl() {
  const preference = getQualityPreference();
  const activeTier = document.documentElement.dataset.performanceTier === 'lite' ? 'Lite' : 'Full';

  return <label className="quality-control">
    <span>Display <b>{preference === 'auto' ? `Auto · ${activeTier}` : activeTier}</b></span>
    <select
      aria-label="Display quality"
      defaultValue={preference}
      onChange={(event) => setQualityPreference(event.target.value as QualityPreference)}
    >
      <option value="auto">Auto</option>
      <option value="lite">Lite</option>
      <option value="full">Full</option>
    </select>
  </label>;
}
