import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { SocialIcons } from "./SocialIcons";
import { EMAIL } from "../config";
import { useSite } from "../site";
import { hashHref } from "../base";
import { PhoneText } from "./PhoneText";

export function Footer() {
  const { phoneDisplay, phoneHref, waLink, socialLinks } = useSite();

  return (
    <footer className="bg-cordoba-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <Logo inverted />
          <p className="mt-5 max-w-md text-sm leading-8 text-white/70">
            تقديم خدمات تحويل وصرافة بأعلى درجات الأمان، مع التوسّع المدروس في تقديم حلول مالية مبتكرة تغطي
            المحافظات السورية.
          </p>
          <div className="mt-5">
            <SocialIcons links={socialLinks} light />
          </div>
        </div>
        <div className="lg:col-span-3">
          <h3 className="mb-4 text-sm font-bold text-gold">أهم الروابط</h3>
          <div className="flex flex-col gap-2.5 text-sm text-white/75">
            <a href={hashHref("top")} className="hover:text-white">الرئيسية</a>
            <a href={hashHref("about")} className="hover:text-white">تعرف علينا</a>
            <a href={hashHref("rates")} className="hover:text-white">أسعار العملات</a>
            <a href={hashHref("branches")} className="hover:text-white">الفروع</a>
            <Link to="/privacy" className="hover:text-white">سياسة الخصوصية</Link>
          </div>
        </div>
        <div className="lg:col-span-4">
          <h3 className="mb-4 text-sm font-bold text-gold">معلومات التواصل</h3>
          <a href={`mailto:${EMAIL}`} className="mb-3 flex items-center gap-3 text-sm text-white/80 hover:text-white">
            <Mail className="h-4 w-4 text-gold" />
            {EMAIL}
          </a>
          <a href={`tel:${phoneHref}`} className="mb-3 flex items-center gap-3 text-sm text-white/80 hover:text-white">
            <Phone className="h-4 w-4 text-gold" />
            <PhoneText value={phoneDisplay} />
          </a>
          <a
            href={waLink("مرحباً، أرغب بالتواصل مع شركة قرطبة")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white"
          >
            تواصل عبر واتساب
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs text-white/45 lg:px-8">
          <p>© {new Date().getFullYear()} Cordoba Money Transfer. جميع الحقوق محفوظة.</p>
          <Link to="/admin/login" className="hover:text-white/80">
            لوحة التحكم
          </Link>
        </div>
      </div>
    </footer>
  );
}
