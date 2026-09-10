import { ArrowUpLeft, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useSite } from "../site";
import { hashHref } from "../base";

const links = [
  { href: hashHref("top"), label: "الرئيسية" },
  { href: hashHref("about"), label: "تعرف علينا" },
  { href: hashHref("services"), label: "خدماتنا" },
  { href: hashHref("rates"), label: "أسعار العملات" },
  { href: hashHref("branches"), label: "الفروع" },
  { href: hashHref("contact"), label: "اتصل بنا" },
];

export function Navbar() {
  const { waLink } = useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? "bg-cream/90 shadow-[0_10px_40px_rgba(27,107,28,0.10)] backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-[15px] font-medium text-ink/80 lg:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-cordoba">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={waLink("مرحباً، أرغب بإرسال حوالة عبر قرطبة")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-cordoba px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-cordoba/20 transition hover:bg-cordoba-mid"
          >
            أرسل حوالتك الآن
            <ArrowUpLeft className="h-4 w-4" />
          </a>
          <button
            type="button"
            className="rounded-full p-2 text-cordoba lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="القائمة"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-cordoba/10 bg-cream px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-base font-medium">
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="py-1">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
