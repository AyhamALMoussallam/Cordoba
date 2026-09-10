import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function PrivacyPage() {
  return (
    <div className="pattern-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 leading-8">
        <p className="text-sm text-cordoba-mid">
          <Link to="/">العودة للرئيسية</Link>
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-cordoba">سياسة الخصوصية</h1>
        <p className="mt-6 text-muted">
          تجمع شركة قرطبة للصرافة والحوالات بيانات التواصل اللازمة لتنفيذ الحوالات وخدمة العملاء فقط، ولا نشارك هذه
          البيانات مع أطراف ثالثة إلا في الحدود التي تتطلبها الأنظمة المالية المعمول بها.
        </p>
        <p className="mt-4 text-muted">
          لوحة التحكم الإدارية محمية بتسجيل دخول لحساب مدير واحد، ولا يمكن للزوار الوصول إلى تعديل الأسعار.
        </p>
      </main>
      <Footer />
    </div>
  );
}
