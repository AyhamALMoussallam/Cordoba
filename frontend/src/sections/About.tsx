import { Compass, Target } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { useSite } from "../site";

export function About() {
  const { waLink } = useSite();
  return (
    <section id="about" className="py-16 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <div className="rounded-[2rem] bg-cordoba px-6 py-10 text-center text-white shadow-xl shadow-cordoba/20 md:px-12">
          <p className="text-lg leading-10 md:text-xl">
            تأسست شركة قرطبة للصرافة والحوالات لتكون واحدة من أبرز الشركات المالية في سوريا، بخبرة تمتد لسنوات في
            مجال الصرافة وتحويل الأموال داخلياً وخارجياً.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="تعرف علينا" title="رؤية واضحة ورسالة تُبنى على الأمان" />
        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-cordoba/10 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cordoba-soft text-cordoba">
              <Compass className="h-6 w-6" />
            </div>
            <p className="mt-5 text-sm font-bold text-cordoba-mid">رؤيتنا</p>
            <h3 className="mt-2 text-2xl font-extrabold">الخيار الأول في سوريا</h3>
            <p className="mt-3 leading-8 text-muted">
              أن نكون الخيار الأول والمفضل للعملاء في الخدمات المالية والصرافة داخل سوريا، عبر حلول مبتكرة وخدمات
              تتسم بالشفافية والأمان والسرعة.
            </p>
          </article>
          <article className="rounded-[2rem] border border-gold/20 bg-gold-soft/50 p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-soft text-cordoba">
              <Target className="h-6 w-6" />
            </div>
            <p className="mt-5 text-sm font-bold text-gold">رسالتنا</p>
            <h3 className="mt-2 text-2xl font-extrabold">أمان أولاً، ثم التوسع المدروس</h3>
            <p className="mt-3 leading-8 text-muted">
              تقديم خدمات تحويل وصرافة بأعلى درجات الأمان، مع التوسع المدروس في حلول مالية مبتكرة تواكب احتياجات
              السوق.
            </p>
          </article>
        </div>
        <div className="mt-8 text-center">
          <a
            href={waLink("مرحباً، أرغب بمعرفة المزيد عن خدمات قرطبة")}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-bold text-cordoba hover:underline"
          >
            اعرف أكثر عبر واتساب
          </a>
        </div>
      </div>
    </section>
  );
}
