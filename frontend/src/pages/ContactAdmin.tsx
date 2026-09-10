import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { SOCIAL_PLATFORMS } from "../lib/contact";
import { useSite } from "../site";
import type { SocialLink } from "../types";

export function ContactAdminPage() {
  const { whatsapp, socialLinks, refresh } = useSite();
  const [number, setNumber] = useState(whatsapp);
  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNumber(whatsapp);
    setLinks(socialLinks);
  }, [whatsapp, socialLinks]);

  function addLink() {
    setLinks((current) => [
      ...current,
      { id: crypto.randomUUID(), platform: "facebook", label: "Facebook", url: "" },
    ]);
  }

  async function saveWhatsApp(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.updateSettings({ whatsapp: number });
      await refresh();
      setMessage("تم حفظ رقم واتساب");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الرقم");
    } finally {
      setSaving(false);
    }
  }

  async function saveSocial(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const cleaned = links.filter((link) => link.url.trim() && link.label.trim());
      await api.updateSettings({ socialLinks: cleaned });
      await refresh();
      setLinks(cleaned);
      setMessage("تم حفظ روابط التواصل");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الروابط");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="واتساب وروابط التواصل">
      {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={(event) => void saveWhatsApp(event)} className="mb-6 max-w-xl rounded-[1.6rem] bg-white p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-cordoba">رقم واتساب</h2>
        <p className="mt-1 text-sm text-muted">يظهر في الزر العائم، الترويسة، والتذييل وصفحة التواصل.</p>
        <input
          value={number}
          onChange={(event) => setNumber(event.target.value)}
          placeholder="9639989966700"
          className="mt-4 w-full rounded-xl border border-black/10 px-4 py-3"
        />
        <button type="submit" disabled={saving} className="mt-4 rounded-xl bg-cordoba px-5 py-3 font-bold text-white">
          حفظ الرقم
        </button>
      </form>

      <form onSubmit={(event) => void saveSocial(event)} className="max-w-3xl rounded-[1.6rem] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-cordoba">روابط وسائل التواصل</h2>
            <p className="mt-1 text-sm text-muted">تظهر في تذييل الموقع. اترك الرابط فارغاً ثم احفظ لإزالة العنصر.</p>
          </div>
          <button type="button" onClick={addLink} className="rounded-xl bg-cream px-4 py-2 text-sm font-bold text-cordoba">
            إضافة رابط
          </button>
        </div>
        <div className="space-y-3">
          {links.map((link, index) => (
            <div key={link.id} className="grid gap-2 rounded-2xl bg-cream p-3 md:grid-cols-[160px_1fr_1fr_auto]">
              <select
                value={link.platform}
                onChange={(event) => {
                  const platform = event.target.value;
                  const meta = SOCIAL_PLATFORMS.find((item) => item.id === platform);
                  setLinks((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, platform, label: platform === "other" ? item.label : meta?.label || item.label }
                        : item,
                    ),
                  );
                }}
                className="rounded-xl border border-black/10 px-3 py-2"
              >
                {SOCIAL_PLATFORMS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input
                value={link.label}
                onChange={(event) =>
                  setLinks((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, label: event.target.value } : item)),
                  )
                }
                placeholder="الاسم الظاهر"
                className="rounded-xl border border-black/10 px-3 py-2"
              />
              <input
                value={link.url}
                onChange={(event) =>
                  setLinks((current) =>
                    current.map((item, itemIndex) => (itemIndex === index ? { ...item, url: event.target.value } : item)),
                  )
                }
                placeholder="https://..."
                className="rounded-xl border border-black/10 px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setLinks((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                className="rounded-xl px-3 py-2 text-sm text-red-600"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
        <button type="submit" disabled={saving} className="mt-5 rounded-xl bg-cordoba px-5 py-3 font-bold text-white">
          حفظ الروابط
        </button>
      </form>
    </AdminLayout>
  );
}
