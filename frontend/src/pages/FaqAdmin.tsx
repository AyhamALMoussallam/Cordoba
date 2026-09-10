import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { useSite } from "../site";
import type { FaqItem } from "../types";

const emptyForm = { question: "", answer: "" };

export function FaqAdminPage() {
  const { refresh } = useSite();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api.faqs();
    setFaqs(data.faqs);
  }

  useEffect(() => {
    void load().catch(() => setError("تعذر تحميل الأسئلة"));
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function startEdit(item: FaqItem) {
    setEditingId(item.id);
    setForm({ question: item.question, answer: item.answer });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const data = await api.updateFaq(editingId, form);
        setFaqs((current) => current.map((item) => (item.id === editingId ? data.faq : item)));
        setMessage("تم حفظ السؤال");
      } else {
        const data = await api.createFaq(form);
        setFaqs((current) => [...current, data.faq]);
        setMessage("تمت إضافة السؤال");
      }
      setForm(emptyForm);
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ السؤال");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("حذف هذا السؤال؟")) return;
    try {
      await api.deleteFaq(id);
      setFaqs((current) => current.filter((item) => item.id !== id));
      if (editingId === id) startCreate();
      await refresh();
      setMessage("تم حذف السؤال");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حذف السؤال");
    }
  }

  return (
    <AdminLayout title="إدارة الأسئلة والأجوبة">
      {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="mb-6 rounded-[1.6rem] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-cordoba">{editingId ? "تعديل سؤال" : "إضافة سؤال"}</h2>
          {editingId && (
            <button type="button" onClick={startCreate} className="text-sm font-bold text-muted">
              سؤال جديد
            </button>
          )}
        </div>
        <form onSubmit={(event) => void save(event)} className="grid gap-4">
          <label className="text-sm font-bold">
            السؤال
            <input
              required
              value={form.question}
              onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium"
            />
          </label>
          <label className="text-sm font-bold">
            الجواب
            <textarea
              required
              rows={5}
              value={form.answer}
              onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium leading-7"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cordoba py-3 font-bold text-white disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "إضافة السؤال"}
          </button>
        </form>
      </section>

      <section className="rounded-[1.6rem] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-extrabold text-cordoba">الأسئلة الحالية</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <article key={item.id} className="rounded-2xl border border-black/5 p-4">
              <p className="font-bold text-cordoba">{item.question}</p>
              <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
              <div className="mt-3 flex gap-3 text-sm">
                <button type="button" className="font-bold text-cordoba" onClick={() => startEdit(item)}>
                  تعديل
                </button>
                <button type="button" className="font-bold text-red-600" onClick={() => void remove(item.id)}>
                  حذف
                </button>
              </div>
            </article>
          ))}
          {faqs.length === 0 && <p className="text-sm text-muted">لا توجد أسئلة بعد.</p>}
        </div>
      </section>
    </AdminLayout>
  );
}
