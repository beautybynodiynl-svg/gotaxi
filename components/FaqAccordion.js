export default function FaqAccordion({ items }) {
  return (
    <div className="divide-y divide-line">
      {items.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-[16px] font-semibold sm:text-[17px]">{f.q}</span>
            <span className="relative h-5 w-5 shrink-0 text-amber">
              <span className="absolute left-1/2 top-1/2 h-[2px] w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
              <span className="absolute left-1/2 top-1/2 h-3.5 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current transition-transform duration-200 group-open:rotate-90" />
            </span>
          </summary>
          <p className="pb-4 pr-8 text-[14.5px] text-muted sm:text-[15px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
