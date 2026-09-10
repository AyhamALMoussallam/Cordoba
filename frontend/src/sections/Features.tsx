import { Headphones, ShieldCheck, Timer, TrendingUp } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";

const features = [
  {
    icon: Timer,
    title: "سرعة في تنفيذ التحويلات",
    text: "تسعد قرطبة بخدمتكم في مختلف المدن السورية عبر شبكة فروعنا المنتشرة.",
  },
  {
    icon: TrendingUp,
    title: "أسعار صرف منافسة",
    text: "أسعار تنافسية تواكب الأسواق الخارجية والرسمية لأسعار العملات.",
  },
  {
    icon: ShieldCheck,
    title: "التزام بالشفافية والأنظمة",
    text: "نلتزم تجاه عملائنا بالشفافية الكاملة وحماية الأنظمة المالية وإدارتها.",
  },
  {
    icon: Headphones,
    title: "دعم مباشر على مدار الساعة",
    text: "دعم فني يومي عبر الموقع، مع خدمة عملاء مدربة ومتابعة فورية.",
  },
];

export function Features() {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="مميزاتنا" title="نتمتع بالعديد من المميزات التي تهدف لراحتك" />
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="flex gap-4 rounded-[1.6rem] bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cordoba text-gold">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">{feature.title}</h3>
                <p className="mt-2 leading-7 text-muted">{feature.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
