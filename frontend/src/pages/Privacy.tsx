import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { WhatsAppButton } from "../components/WhatsAppButton";

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <section className="bg-cordoba-soft">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
          <h1 className="text-3xl font-extrabold text-cordoba-deep md:text-4xl">سياسة الخصوصية</h1>
          <p className="mt-3 text-sm font-medium text-cordoba-mid">
            <Link to="/" className="hover:underline">
              الرئيسة
            </Link>
            <span className="mx-1.5 text-cordoba-deep/40">|</span>
            <span className="text-cordoba">سياسة الخصوصية</span>
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-4xl px-4 py-14 leading-9 text-ink lg:px-8">
        <p>
          في شركة قرطبة للصرافة والتحويلات المالية، نحرص على حماية خصوصيتكم واحترام بياناتكم.
        </p>
        <p className="mt-6">نود أن نوضح لزوار موقعنا الإلكتروني أن:</p>
        <ul className="mt-4 list-disc space-y-2 pe-6">
          <li>لا نقوم بجمع أي معلومات شخصية عبر الموقع.</li>
          <li>لا نستخدم ملفات تعريف الارتباط (Cookies).</li>
          <li>لا يتم تعقّب أو حفظ أي بيانات تتعلق بنشاطات المستخدمين داخل الموقع.</li>
        </ul>
        <p className="mt-8">
          تم تصميم هذا الموقع ليكون مصدرًا للمعلومات فقط، دون الحاجة لتقديم أي بيانات شخصية.
        </p>
        <p className="mt-6">
          إذا تم تحديث هذه السياسة في المستقبل نتيجة إضافة خدمات جديدة تتطلب جمع معلومات، فسنقوم بإعلام الزوار
          بوضوح عبر هذه الصفحة.
        </p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
