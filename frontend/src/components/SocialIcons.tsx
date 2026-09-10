import type { SocialLink } from "../types";

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

const icons: Record<string, string> = {
  facebook: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6L16 12h-3V10c0-.6.4-1 1-1z",
  instagram:
    "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zm10 2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2zm-5 3.2A3.8 3.8 0 1112 16.8 3.8 3.8 0 0112 8.2zm0 1.6a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4zM17.2 6.5a.9.9 0 11-1.8 0 .9.9 0 011.8 0z",
  x: "M4 4l6.7 8.7L4.3 20H7l5-6.2L16.8 20H20l-6.9-9L19.6 4H17L12.3 9.9 8 4z",
  tiktok:
    "M14 4c.4 2.4 1.8 4 4.2 4.3v2.5c-1.5 0-2.8-.4-4.2-1.2v6.6A5.3 5.3 0 118.6 11v2.6a2.8 2.8 0 102.2 2.7V4h3.2z",
  linkedin:
    "M6.5 9H4v11h2.5V9zM5.2 4A1.5 1.5 0 103.7 5.5 1.5 1.5 0 005.2 4zM20 20h-2.5v-5.6c0-1.8-.8-2.4-1.8-2.4s-2 .8-2 2.5V20H11.2V9H13.7v1.5c.6-1 1.8-1.8 3.4-1.8 2.4 0 4 1.5 4 4.7V20z",
  youtube:
    "M22 12.2s0-3.2-.4-4.6c-.2-.8-.8-1.4-1.6-1.6C18.4 5.6 12 5.6 12 5.6s-6.4 0-8 .4c-.8.2-1.4.8-1.6 1.6C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.8.8 1.4 1.6 1.6 1.6.4 8 .4 8 .4s6.4 0 8-.4c.8-.2 1.4-.8 1.6-1.6.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.5 3.3z",
  telegram:
    "M21 4.5L3.4 11.2c-1.2.4-1.2 1.2-.2 1.5l4.5 1.4 1.7 5.3c.2.6.3.8 1 .8.5 0 .7-.2 1-.6l2.4-2.3 4.9 3.6c.9.5 1.5.2 1.8-.8L22.4 6c.3-1.2-.4-1.8-1.4-1.5z",
  other: "M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2zm0-4h-2V7h2z",
};

export function SocialIcons({ links, light = false }: { links: SocialLink[]; light?: boolean }) {
  if (links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          title={link.label}
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            light ? "bg-white/10 text-white hover:bg-white/20" : "bg-cordoba-soft text-cordoba"
          }`}
        >
          <Icon path={icons[link.platform] ?? icons.other} />
        </a>
      ))}
    </div>
  );
}
