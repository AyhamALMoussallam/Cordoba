import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { PhoneText } from "../components/PhoneText";
import type { Application, Position } from "../types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" });
}

export function CareerAdminPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [title, setTitle] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const [positionData, applicationData] = await Promise.all([api.positions(), api.applications()]);
    setPositions(positionData.positions);
    setApplications(applicationData.applications);
  }

  useEffect(() => {
    void load().catch(() => setError("تعذر تحميل بيانات الوظائف"));
  }, []);

  function startCreate() {
    setEditingId(null);
    setTitle("");
  }

  function startEdit(position: Position) {
    setEditingId(position.id);
    setTitle(position.title);
  }

  async function savePosition(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const data = await api.updatePosition(editingId, title);
        setPositions((current) => current.map((item) => (item.id === editingId ? data.position : item)));
        setMessage("تم حفظ الوظيفة");
      } else {
        const data = await api.createPosition(title);
        setPositions((current) => [...current, data.position]);
        setMessage("تمت إضافة الوظيفة");
      }
      startCreate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الوظيفة");
    } finally {
      setSaving(false);
    }
  }

  async function removePosition(id: string) {
    if (!confirm("حذف هذه الوظيفة؟ الطلبات السابقة تبقى ظاهرة بعنوانها.")) return;
    try {
      await api.deletePosition(id);
      setPositions((current) => current.filter((item) => item.id !== id));
      if (positionFilter === id) setPositionFilter("");
      if (editingId === id) startCreate();
      setMessage("تم حذف الوظيفة");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حذف الوظيفة");
    }
  }

  async function downloadCv(item: Application) {
    try {
      await api.downloadApplicationCv(item.id, item.cvName || "cv.pdf");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تنزيل السيرة الذاتية");
    }
  }

  async function removeApplication(id: string) {
    if (!confirm("حذف هذا الطلب وملف السيرة الذاتية؟")) return;
    try {
      await api.deleteApplication(id);
      setApplications((current) => current.filter((item) => item.id !== id));
      setMessage("تم حذف الطلب");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حذف الطلب");
    }
  }

  const orphanTitles = [
    ...new Set(
      applications
        .filter((item) => !item.positionId || !positions.some((position) => position.id === item.positionId))
        .map((item) => item.positionTitle),
    ),
  ].sort((left, right) => left.localeCompare(right, "ar"));

  const visibleApplications = applications
    .filter((item) => {
      if (!positionFilter) return true;
      if (positionFilter.startsWith("title:")) return item.positionTitle === positionFilter.slice("title:".length);
      return item.positionId === positionFilter;
    })
    .sort((left, right) => {
      const byTitle = left.positionTitle.localeCompare(right.positionTitle, "ar");
      if (byTitle !== 0) return byTitle;
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });

  return (
    <AdminLayout title="الوظائف والطلبات">
      {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="mb-6 rounded-[1.6rem] bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-cordoba">طلبات التقديم</h2>
            <p className="mt-1 text-sm text-muted">{visibleApplications.length} طلب</p>
          </div>
          <label className="text-sm font-bold">
            الوظيفة
            <select
              value={positionFilter}
              onChange={(event) => setPositionFilter(event.target.value)}
              className="mt-2 block min-w-56 rounded-xl border border-black/10 bg-white px-3 py-2 font-medium"
            >
              <option value="">كل الوظائف</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.title}
                </option>
              ))}
              {orphanTitles.map((item) => (
                <option key={`title:${item}`} value={`title:${item}`}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        {applications.length === 0 ? (
          <p className="text-sm text-muted">لا توجد طلبات بعد.</p>
        ) : visibleApplications.length === 0 ? (
          <p className="text-sm text-muted">لا توجد طلبات لهذه الوظيفة.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-black/10 text-right text-muted">
                  <th className="px-2 py-3 font-bold">الاسم</th>
                  <th className="px-2 py-3 font-bold">البريد</th>
                  <th className="px-2 py-3 font-bold">الهاتف</th>
                  <th className="px-2 py-3 font-bold">الوظيفة</th>
                  <th className="px-2 py-3 font-bold">تاريخ التقديم</th>
                  <th className="px-2 py-3 font-bold">السيرة الذاتية</th>
                  <th className="px-2 py-3 font-bold" />
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((item) => (
                  <tr key={item.id} className="border-b border-black/5 align-top">
                    <td className="px-2 py-3 font-bold text-cordoba">{item.name}</td>
                    <td className="px-2 py-3">
                      <a href={`mailto:${item.email}`} className="text-cordoba underline" dir="ltr">
                        {item.email}
                      </a>
                    </td>
                    <td className="px-2 py-3">
                      <PhoneText value={item.phone} />
                    </td>
                    <td className="px-2 py-3">{item.positionTitle}</td>
                    <td className="px-2 py-3 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="px-2 py-3">
                      <button type="button" className="font-bold text-cordoba" onClick={() => void downloadCv(item)}>
                        {item.cvName || "تنزيل PDF"}
                      </button>
                    </td>
                    <td className="px-2 py-3">
                      <button type="button" className="font-bold text-red-600" onClick={() => void removeApplication(item.id)}>
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mb-6 rounded-[1.6rem] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-cordoba">{editingId ? "تعديل وظيفة" : "إضافة وظيفة"}</h2>
          {editingId && (
            <button type="button" onClick={startCreate} className="text-sm font-bold text-muted">
              وظيفة جديدة
            </button>
          )}
        </div>
        <form onSubmit={(event) => void savePosition(event)} className="grid gap-4">
          <label className="text-sm font-bold">
            اسم الوظيفة
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-cordoba py-3 font-bold text-white disabled:opacity-60"
          >
            {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "إضافة الوظيفة"}
          </button>
        </form>
      </section>

      <section className="rounded-[1.6rem] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-extrabold text-cordoba">الوظائف الظاهرة في صفحة التقديم</h2>
        <div className="space-y-3">
          {positions.map((item) => (
            <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/5 p-4">
              <p className="font-bold text-cordoba">{item.title}</p>
              <div className="flex gap-3 text-sm">
                <button type="button" className="font-bold text-cordoba" onClick={() => startEdit(item)}>
                  تعديل
                </button>
                <button type="button" className="font-bold text-red-600" onClick={() => void removePosition(item.id)}>
                  حذف
                </button>
              </div>
            </article>
          ))}
          {positions.length === 0 && <p className="text-sm text-muted">لا توجد وظائف بعد. أضف وظيفة ليختارها المتقدمون.</p>}
        </div>
      </section>
    </AdminLayout>
  );
}
