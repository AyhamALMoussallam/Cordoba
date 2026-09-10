import { ArrowLeftRight, Globe2, WalletCards } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";

const services = [
  {
    icon: ArrowLeftRight,
    title: "التحويلات المالية الداخلية",
    text: "تحويل فوري بين جميع المحافظات السورية، تسليم مباشر أو من خلال وكلائنا المعتمدين.",
    tone: "bg-cordoba-soft text-cordoba",
  },
  {
    icon: Globe2,
    title: "التحويلات الخارجية",
    text: "تحويل أموال إلى معظم دول العالم بالتعاون مع شبكات تحويل عالمية.",
    tone: "bg-cordoba-mid/15 text-cordoba",
  },
  {
    icon: WalletCards,
    title: "خدمة صرف العملات",
    text: "أسعار صرف محدثة يومياً، وبيع وشراء العملات الأجنبية بدقة وأمان.",
    tone: "bg-gold-soft text-cordoba",
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="خدماتنا" title="خدمات مالية متكاملة بثقة تامة" />
        <div className="grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="rounded-[1.8rem] border border-black/5 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${service.tone}`}>
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-extrabold">{service.title}</h3>
              <p className="mt-3 leading-8 text-muted">{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
