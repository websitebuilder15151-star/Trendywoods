export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="3" width="20" height="3" />
        <rect x="4" y="8.5" width="16" height="3" />
        <rect x="2" y="14" width="20" height="3" />
        <rect x="5" y="19.5" width="14" height="2" />
      </svg>
      Trendywoods
    </span>
  )
}
