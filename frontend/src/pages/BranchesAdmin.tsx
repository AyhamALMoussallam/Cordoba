import { useMemo, useState, type FormEvent } from "react";
import { api } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { MapPicker } from "../components/MapPicker";
import { useSite } from "../site";
import type { Branch } from "../types";

const emptyForm = {
  governorateId: "",
  address: "",
  manager: "",
  phone: "",
  lat: null as number | null,
  lng: null as number | null,
};

export function BranchesAdminPage() {
  const { governorates, branches, refresh } = useSite();
  const [govName, setGovName] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const visibleBranches = useMemo(
    () => (selectedGov ? branches.filter((item) => item.governorateId === selectedGov) : branches),
    [branches, selectedGov],
  );

  function flash(ok: string) {
    setMessage(ok);
    setError("");
    void refresh();
  }

  async function addGovernorate(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const data = await api.createGovernorate(govName);
      setGovName("");
      setSelectedGov(data.governorate.id);
      flash("تمت إضافة المحافظة");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إضافة المحافظة");
    }
  }

  async function renameGovernorate(id: string) {
    const current = governorates.find((item) => item.id === id);
    const name = prompt("اسم المحافظة", current?.name);
    if (!name) return;
    try {
      await api.updateGovernorate(id, name);
      flash("تم تعديل اسم المحافظة");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تعديل المحافظة");
    }
  }

  async function removeGovernorate(id: string) {
    if (!confirm("سيتم حذف المحافظة وكل فروعها. هل تريد المتابعة؟")) return;
    try {
      await api.deleteGovernorate(id);
      if (selectedGov === id) setSelectedGov("");
      flash("تم حذف المحافظة");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حذف المحافظة");
    }
  }

  function startEdit(branch: Branch) {
    setEditingId(branch.id);
    setForm({
      governorateId: branch.governorateId,
      address: branch.address,
      manager: branch.manager,
      phone: branch.phone,
      lat: branch.lat,
      lng: branch.lng,
    });
    setSelectedGov(branch.governorateId);
  }

  function startCreate() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      governorateId: selectedGov || governorates[0]?.id || "",
    });
  }

  async function saveBranch(event: FormEvent) {
    event.preventDefault();
    if (!form.governorateId) {
      setError("اختر المحافظة");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        governorateId: form.governorateId,
        address: form.address,
        manager: form.manager,
        phone: form.phone,
        lat: form.lat,
        lng: form.lng,
      };
      if (editingId) await api.updateBranch(editingId, payload);
      else await api.createBranch(payload);
      setForm({ ...emptyForm, governorateId: form.governorateId });
      setEditingId(null);
      flash(editingId ? "تم حفظ الفرع" : "تمت إضافة الفرع");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الفرع");
    } finally {
      setSaving(false);
    }
  }

  async function removeBranch(id: string) {
    if (!confirm("حذف هذا الفرع؟")) return;
    try {
      await api.deleteBranch(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      flash("تم حذف الفرع");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حذف الفرع");
    }
  }

  return (
    <AdminLayout title="إدارة الفروع والمحافظات">
      {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <section className="rounded-[1.6rem] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-cordoba">المحافظات</h2>
          <form onSubmit={(event) => void addGovernorate(event)} className="mt-4 flex gap-2">
            <input
              value={govName}
              onChange={(event) => setGovName(event.target.value)}
              placeholder="اسم محافظة جديدة"
              className="w-full rounded-xl border border-black/10 px-3 py-2"
            />
            <button type="submit" className="rounded-xl bg-cordoba px-3 py-2 text-sm font-bold text-white">
              إضافة
            </button>
          </form>
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setSelectedGov("")}
              className={`w-full rounded-xl px-3 py-2 text-right text-sm ${selectedGov === "" ? "bg-cordoba text-white" : "bg-cream"}`}
            >
              كل المحافظات ({branches.length})
            </button>
            {governorates.map((item) => {
              const count = branches.filter((branch) => branch.governorateId === item.id).length;
              return (
                <div key={item.id} className={`rounded-xl px-3 py-2 ${selectedGov === item.id ? "bg-cordoba-soft" : "bg-cream"}`}>
                  <button type="button" onClick={() => setSelectedGov(item.id)} className="w-full text-right font-bold">
                    {item.name} <span className="text-xs font-medium text-muted">({count})</span>
                  </button>
                  <div className="mt-1 flex gap-2 text-xs">
                    <button type="button" className="text-cordoba" onClick={() => void renameGovernorate(item.id)}>
                      تعديل
                    </button>
                    <button type="button" className="text-red-600" onClick={() => void removeGovernorate(item.id)}>
                      حذف
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[1.6rem] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-cordoba">{editingId ? "تعديل فرع" : "إضافة فرع"}</h2>
              {editingId && (
                <button type="button" onClick={startCreate} className="text-sm font-bold text-muted">
                  فرع جديد
                </button>
              )}
            </div>
            <form onSubmit={(event) => void saveBranch(event)} className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-bold">
                المحافظة
                <select
                  required
                  value={form.governorateId}
                  onChange={(event) => setForm((current) => ({ ...current, governorateId: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium"
                >
                  <option value="">اختر المحافظة</option>
                  {governorates.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                هاتف الفرع
                <input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium"
                />
              </label>
              <label className="text-sm font-bold md:col-span-2">
                العنوان
                <input
                  required
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium"
                />
              </label>
              <label className="text-sm font-bold md:col-span-2">
                مسؤول المكتب
                <input
                  value={form.manager}
                  onChange={(event) => setForm((current) => ({ ...current, manager: event.target.value }))}
                  className="mt-2 w-full rounded-xl border border-black/10 px-3 py-2 font-medium"
                />
              </label>
              <div className="md:col-span-2">
                <MapPicker
                  key={editingId ?? "new"}
                  lat={form.lat}
                  lng={form.lng}
                  onChange={(lat, lng) => setForm((current) => ({ ...current, lat, lng }))}
                />
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {form.lat != null && form.lng != null ? (
                    <p className="text-xs text-muted">
                      الموقع: {form.lat.toFixed(5)}, {form.lng.toFixed(5)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted">لا يوجد موقع على الخريطة حالياً</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, lat: null, lng: null }))}
                    className="text-xs font-bold text-cordoba"
                  >
                    بدون موقع على الخريطة
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cordoba py-3 font-bold text-white disabled:opacity-60 md:col-span-2"
              >
                {saving ? "جاري الحفظ..." : "حفظ الفرع"}
              </button>
            </form>
          </section>

          <section className="rounded-[1.6rem] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-extrabold text-cordoba">الفروع</h2>
            <div className="space-y-3">
              {visibleBranches.map((branch) => (
                <article key={branch.id} className="rounded-2xl border border-black/5 p-4">
                  <p className="font-bold text-cordoba">
                    {governorates.find((item) => item.id === branch.governorateId)?.name}
                  </p>
                  <p className="mt-1 text-sm">{branch.address}</p>
                  {(branch.lat == null || branch.lng == null) && (
                    <p className="mt-1 text-xs text-muted">بدون موقع على الخريطة</p>
                  )}
                  <div className="mt-3 flex gap-3 text-sm">
                    <button type="button" className="font-bold text-cordoba" onClick={() => startEdit(branch)}>
                      تحديد الموقع / تعديل
                    </button>
                    <button type="button" className="font-bold text-red-600" onClick={() => void removeBranch(branch.id)}>
                      حذف
                    </button>
                  </div>
                </article>
              ))}
              {visibleBranches.length === 0 && <p className="text-sm text-muted">لا توجد فروع في هذا التصفية.</p>}
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
