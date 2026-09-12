import { ArrowUpLeft, BadgeCheck, Landmark } from "lucide-react";
import { hashHref } from "../base";
import { PhoneText } from "../components/PhoneText";
import { useSite } from "../site";

export function Hero() {
  const { waLink, phoneDisplay, branches, governorates, mainBranchLabel, mainBranchCity, mainBranchText } = useSite();
  const stats = [
    { value: branches.length ? `+${branches.length}` : "—", label: "فرعاً معتمداً" },
    { value: governorates.length ? String(governorates.length) : "—", label: "محافظة سورية" },
    { value: "24/7", label: "تواصل مباشر" },
    { value: "يومياً", label: "تحديث الأسعار" },
  ];

  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-6 lg:pb-24 lg:pt-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-cordoba/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-cordoba/15 bg-white/70 px-3 py-1 text-xs font-bold text-cordoba">
            شركة قرطبة للصرافة والحوالات
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.25] text-ink md:text-6xl">
            ثقتكم وجهتنا،
            <span className="block text-cordoba">وسرعتنا وعدنا</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted md:text-lg">
            نرحب بكم في الشركة الرائدة في تقديم خدمات التحويل المالي والصرافة بأمان وسرعة، مع تغطية شاملة لمختلف
            المحافظات السورية. نضع بين أيديكم فريقاً محترفاً وخدمات متطورة تلبي جميع احتياجاتكم المحلية والدولية.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink("مرحباً، أرغب بإرسال حوالة عبر قرطبة")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cordoba px-6 py-3 font-bold text-white shadow-xl shadow-cordoba/20 transition hover:bg-cordoba-mid"
            >
              أرسل حوالتك الآن
              <ArrowUpLeft className="h-4 w-4" />
            </a>
            <a
              href={hashHref("rates")}
              className="inline-flex items-center gap-2 rounded-full border border-cordoba/20 bg-white px-6 py-3 font-bold text-cordoba"
            >
              أسعار الصرف اليوم
            </a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-muted">
            <BadgeCheck className="h-5 w-5 text-cordoba-mid" />
            الرقم الموحد <PhoneText value={phoneDisplay} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-6 rounded-[2.5rem] bg-gradient-to-br from-cordoba to-cordoba-deep" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/80 p-6 shadow-[0_30px_80px_rgba(12,59,46,0.18)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-gold">CORDOBA DESK</p>
                <p className="mt-1 text-lg font-extrabold text-cordoba">منصة الحوالات والصرافة</p>
              </div>
              <Landmark className="h-8 w-8 text-gold" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-cream p-4">
                  <p className="text-2xl font-extrabold text-cordoba">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-cordoba-deep p-5 text-white">
              <p className="text-sm text-white/70">{mainBranchLabel || "الفرع الرئيسي"}</p>
              <p className="mt-1 text-lg font-bold">{mainBranchCity}</p>
              {mainBranchText && (
                <p className="mt-3 text-sm leading-7 text-white/70">{mainBranchText}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
