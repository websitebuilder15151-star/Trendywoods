export function Logo({ light = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''}`}>
      <img src="/logo.png" alt="" />
      <span>
        Trendy Woods
        <small>Furnitures</small>
      </span>
    </span>
  )
}
