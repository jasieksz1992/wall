export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="WALL Prefabrykacja">
      <div className="relative h-8 w-14" aria-hidden="true">
        <span className="absolute left-0 top-0 h-3.5 w-4 rounded-[2px] bg-wall-orange" />
        <span className="absolute left-5 top-0 h-3.5 w-4 rounded-[2px] bg-wall-orange" />
        <span className="absolute right-0 top-0 h-3.5 w-4 rounded-[2px] bg-wall-orange" />
        <span className="absolute left-0 top-3.5 h-3.5 w-4 rounded-[2px] bg-wall-orange" />
        <span className="absolute right-0 top-3.5 h-3.5 w-4 rounded-[2px] bg-wall-orange" />
        <span className="absolute left-5 top-7 h-1.5 w-4 rounded-b-[2px] bg-wall-orange" />
      </div>
      <div className="leading-none">
        <div className={`text-2xl font-black tracking-tight ${dark ? 'text-wall-ink' : 'text-white'}`}>WALL</div>
        <div className={`text-[9px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-zinc-500' : 'text-white/65'}`}>Prefabrykacja</div>
      </div>
    </div>
  )
}
