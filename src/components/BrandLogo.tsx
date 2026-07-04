type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

const logoSrc = "/brand/adultgen-logo.png";

export default function BrandLogo({ compact = false, className = "" }: BrandLogoProps) {
  if (!compact) {
    return (
      <span className={`inline-flex items-center gap-3 ${className}`}>
        <img
          src={logoSrc}
          alt=""
          className="h-16 w-16 select-none object-contain"
          draggable={false}
        />
        <span className="text-xl font-semibold tracking-tight text-white">AdultGen AI</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative h-9 w-9 shrink-0 overflow-hidden" aria-hidden="true">
        <img
          src={logoSrc}
          alt=""
          className="h-full w-full select-none object-contain"
          draggable={false}
        />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-white">
        AdultGen AI
      </span>
    </span>
  );
}
