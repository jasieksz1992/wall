export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="WALL Prefabrykacja">
      <div className="grid grid-cols-3 gap-1" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="h-2.5 w-2.5 rounded-[2px] bg-wall-orange" />
        ))}
      </div>
      <div className="leading-none">
        <div className={`text-2xl font-black tracking-tight ${dark ? 'text-wall-ink' : 'text-white'}`}>WALL</div>
        <div className={`text-[9px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-zinc-500' : 'text-white/65'}`}>Prefabrykacja</div>
      </div>
    </div>
  )
}
