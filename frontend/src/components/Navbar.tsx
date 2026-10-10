import { ArrowUpLeft, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useSite } from "../site";
import { hashHref } from "../base";

const links: Array<{ label: string; href?: string; to?: string }> = [
  { href: hashHref("top"), label: "الرئيسية" },
  { href: hashHref("about"), label: "تعرف علينا" },
  { href: hashHref("services"), label: "خدماتنا" },
  { href: hashHref("rates"), label: "أسعار العملات" },
  { href: hashHref("branches"), label: "الفروع" },
  { to: "/career", label: "انضم إلينا" },
  { href: hashHref("contact"), label: "اتصل بنا" },
];

function NavItems({ className, onNavigate }: { className: string; onNavigate?: () => void }) {
  return links.map((link) =>
    link.to ? (
      <Link key={link.label} to={link.to} onClick={onNavigate} className={className}>
        {link.label}
      </Link>
    ) : (
      <a key={link.label} href={link.href} onClick={onNavigate} className={className}>
        {link.label}
      </a>
    ),
  );
}

export function Navbar() {
  const { waLink } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white">
      <Link to="/admin/login" className="absolute left-0 top-0 z-50 px-4 py-2 text-xs text-white">
        لوحة التحكم
      </Link>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-3 pt-8 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-[15px] font-medium text-ink/80 lg:flex">
          <NavItems className="transition hover:text-cordoba" />
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
        <div className="border-t border-cordoba/10 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3 text-base font-medium">
            <NavItems className="py-1" onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
