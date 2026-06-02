export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="WALL Prefabrykacja">
      <img src="/images/logo.png" alt="WALL Prefabrykacja" style={{ height: '60px'}} />
    </div>
  )
}
