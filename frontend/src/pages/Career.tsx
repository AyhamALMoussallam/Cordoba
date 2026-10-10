import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { api } from "../api";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { WhatsAppButton } from "../components/WhatsAppButton";
import type { Position } from "../types";

const emptyForm = { name: "", email: "", phone: "", positionId: "" };

export function CareerPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [cv, setCv] = useState<File | null>(null);
  const [cvKey, setCvKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .positions()
      .then((data) => setPositions(data.positions))
      .catch(() => setError("تعذر تحميل الوظائف"))
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!cv) {
      setError("أرفق السيرة الذاتية بصيغة PDF");
      return;
    }
    const isPdf = cv.type === "application/pdf" || cv.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("السيرة الذاتية يجب أن تكون ملف PDF");
      return;
    }
    if (cv.size > 5 * 1024 * 1024) {
      setError("حجم الملف يجب ألا يتجاوز 5 ميغابايت");
      return;
    }

    setSaving(true);
    try {
      await api.apply({ ...form, cv });
      setForm(emptyForm);
      setCv(null);
      setCvKey((value) => value + 1);
      setMessage("تم استلام طلبك.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إرسال الطلب");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pattern-bg min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <p className="text-sm text-cordoba-mid">
          <Link to="/">العودة للرئيسية</Link>
        </p>
        <p className="mt-4 text-sm font-bold tracking-wide text-cordoba-mid">الوظائف</p>
        <div className="gold-line mt-2 !mx-0" />
        <h1 className="mt-4 text-3xl font-extrabold text-cordoba md:text-4xl">انضم الى فريق العمل في شركة قرطبة</h1>
        <p className="mt-3 leading-8 text-muted">
          املأ البيانات وأرفق سيرتك الذاتية بصيغة PDF. تظهر الوظائف المتاحة حسب ما يضيفه فريق قرطبة.
        </p>

        <section className="mt-8 rounded-[1.6rem] bg-white p-5 shadow-sm md:p-8">
          {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
          {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={(event) => void submit(event)} className="grid gap-4">
              <label className="text-sm font-bold">
                الاسم
                <input
                  required
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium"
                />
              </label>
              <label className="text-sm font-bold">
                البريد الإلكتروني
                <input
                  required
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-left font-medium"
                />
              </label>
              <label className="text-sm font-bold">
                رقم الهاتف
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 text-left font-medium"
                />
              </label>
              <label className="text-sm font-bold">
                الوظيفة
                <select
                  required
                  value={form.positionId}
                  onChange={(event) => setForm((current) => ({ ...current, positionId: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 bg-white px-3 py-2 font-medium"
                >
                  <option value="">{loading ? "جاري تحميل الوظائف..." : "اختر الوظيفة"}</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                السيرة الذاتية (PDF)
                <input
                  key={cvKey}
                  required
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(event) => setCv(event.target.files?.[0] ?? null)}
                  className="mt-2 block w-full text-sm font-medium file:me-3 file:rounded-full file:border-0 file:bg-cordoba-soft file:px-4 file:py-2 file:font-bold file:text-cordoba"
                />
              </label>
              <p className="flex items-center gap-2 text-xs text-muted">
                <FileText className="h-4 w-4" />
                ملف PDF واحد، بحد أقصى 5 ميغابايت.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-cordoba py-3 font-bold text-white shadow-lg shadow-cordoba/20 transition hover:bg-cordoba-mid disabled:opacity-60"
              >
                {saving ? "جاري الإرسال..." : "إرسال الطلب"}
              </button>
            </form>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
