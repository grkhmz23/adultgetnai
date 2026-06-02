type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

const logoSrc = "/brand/adultgen-logo.png";

export default function BrandLogo({ compact = false, className = "" }: BrandLogoProps) {
  if (!compact) {
    return (
      <img
        src={logoSrc}
        alt="AdultGen AI"
        className={`h-auto w-[220px] max-w-full select-none ${className}`}
        draggable={false}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className="relative h-9 w-9 shrink-0 overflow-hidden"
        aria-hidden="true"
      >
        <img
          src={logoSrc}
          alt=""
          className="absolute -left-[34px] -top-[3px] h-[66px] w-[96px] max-w-none select-none"
          draggable={false}
        />
      </span>
      <span className="text-[15px] font-semibold tracking-tight text-[#121212]">
        AdultGen AI
      </span>
    </span>
  );
}
