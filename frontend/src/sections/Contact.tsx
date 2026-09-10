import { Mail, MessageCircle, Phone } from "lucide-react";
import { EMAIL } from "../config";
import { PhoneText } from "../components/PhoneText";
import { SectionHeading } from "../components/SectionHeading";
import { useSite } from "../site";
import { formatPhoneDisplay } from "../lib/contact";

export function Contact() {
  const { waLink, phoneDisplay, phoneHref, whatsapp } = useSite();
  return (
    <section id="contact" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="اتصل بنا" title="فريق قرطبة جاهز لخدمتك مباشرة" />
        <div className="grid gap-4 md:grid-cols-3">
          <a href={`tel:${phoneHref}`} className="rounded-[1.6rem] bg-white p-6 shadow-sm transition hover:-translate-y-1">
            <Phone className="h-6 w-6 text-cordoba" />
            <h3 className="mt-4 font-extrabold">الرقم الموحد</h3>
            <p className="mt-2 text-muted">
              <PhoneText value={phoneDisplay} />
            </p>
          </a>
          <a
            href={waLink("مرحباً، أرغب بالتواصل مع شركة قرطبة")}
            target="_blank"
            rel="noreferrer"
            className="rounded-[1.6rem] bg-white p-6 shadow-sm transition hover:-translate-y-1"
          >
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
            <h3 className="mt-4 font-extrabold">واتساب</h3>
            <p className="mt-2 text-muted">
              محادثة فورية عبر <PhoneText value={formatPhoneDisplay(whatsapp)} />
            </p>
          </a>
          <a href={`mailto:${EMAIL}`} className="rounded-[1.6rem] bg-white p-6 shadow-sm transition hover:-translate-y-1">
            <Mail className="h-6 w-6 text-gold" />
            <h3 className="mt-4 font-extrabold">البريد الإلكتروني</h3>
            <p className="mt-2 text-muted">{EMAIL}</p>
          </a>
        </div>
      </div>
    </section>
  );
}
