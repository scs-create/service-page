import HeroSkyline from "@/components/sections/HeroSkyline";

// The SCS tower motif (the logo mark) as a sized mark: the exact HeroSkyline vector, never redrawn
// (docs/v2/02-DECISIONS.md §4). `rule` adds the gold baseline used under the 116px mobile hero mark.
export default function TowerMark({ height = 116, rule = false, className = "" }: { height?: number; rule?: boolean; className?: string }) {
  return (
    <span className={`inline-flex flex-col items-center ${className}`} style={{ width: Math.round((height * 284.2) / 315.5) }}>
      <span className="block w-full" style={{ height }}>
        <HeroSkyline className="h-full w-full" />
      </span>
      {rule && <span aria-hidden="true" className="mt-2 block h-1 w-full rounded-sm bg-accent" />}
    </span>
  );
}
