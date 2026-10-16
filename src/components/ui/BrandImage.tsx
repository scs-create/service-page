import Image from "next/image";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";

// Standard image treatment: next/image + subtle logo-blue tint. When no photo exists yet it shows a
// neutral block (and, on preview deploys only, the documented placeholder text).
type Props = { src?: string; alt: string; width: number; height: number; className?: string; placeholder?: string };

export default function BrandImage({ src, alt, width, height, className = "", placeholder }: Props) {
  if (!src) {
    return (
      <span aria-hidden="true" style={{ width, height }} className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary ${className}`}>
        {placeholder && <ClientPlaceholder text={placeholder} />}
      </span>
    );
  }
  return (
    <span style={{ width, height }} className={`relative block shrink-0 overflow-hidden ${className}`}>
      <Image src={src} alt={alt} width={width} height={height} className="h-full w-full object-cover" />
      <span aria-hidden="true" className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
    </span>
  );
}
