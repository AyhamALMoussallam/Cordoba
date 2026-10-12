import { hashHref, publicAsset } from "../base";

interface LogoProps {
  inverted?: boolean;
  compact?: boolean;
}

export function Logo({ inverted = false, compact = false }: LogoProps) {
  const height = compact ? "h-8" : inverted ? "h-16" : "h-16 md:h-[4.5rem]";

  return (
    <a href={hashHref("top")} className="flex items-center">
      <img
        src={publicAsset("logo.png")}
        alt="Cordoba Money Transfer"
        className={`w-auto object-contain ${height}`}
      />
    </a>
  );
}
