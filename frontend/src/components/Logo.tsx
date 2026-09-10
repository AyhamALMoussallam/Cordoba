import { hashHref, publicAsset } from "../base";

interface LogoProps {
  inverted?: boolean;
}

export function Logo({ inverted = false }: LogoProps) {
  return (
    <a href={hashHref("top")} className="flex items-center">
      <img
        src={publicAsset("logo.png")}
        alt="Cordoba Money Transfer"
        className={`w-auto object-contain ${inverted ? "h-16" : "h-16 md:h-[4.5rem]"}`}
      />
    </a>
  );
}
