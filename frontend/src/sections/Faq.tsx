import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { useSite } from "../site";

export function Faq() {
  const { faqs } = useSite();
  const [open, setOpen] = useState(0);

  useEffect(() => {
    setOpen((current) => {
      if (faqs.length === 0) return -1;
      if (current < 0 || current >= faqs.length) return 0;
      return current;
    });
  }, [faqs]);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <SectionHeading
          kicker="أسئلة وأجوبة"
          title="أهم الأسئلة التي قد تخطر على بالك، مع إجابات واضحة وسريعة"
          subtitle="إذا لديك سؤال آخر لا تتردد بالاتصال بنا"
        />
        <div className="overflow-hidden rounded-[1.6rem] bg-white shadow-sm">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.id} className={isOpen ? "border-b-2 border-cordoba-mid" : "border-b border-black/5"}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-right"
                >
                  <span className="font-bold">{item.question}</span>
                  {isOpen ? <Minus className="h-5 w-5 text-cordoba" /> : <Plus className="h-5 w-5 text-muted" />}
                </button>
                <div className={`faq-content ${isOpen ? "open" : ""}`}>
                  <p className="overflow-hidden px-5 pb-5 leading-8 text-muted">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
