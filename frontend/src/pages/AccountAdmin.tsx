import { useState, type FormEvent } from "react";
import { api } from "../api";
import { useAuth } from "../auth";
import { AdminLayout } from "../components/AdminLayout";

export function AccountAdminPage() {
  const { admin, setAdmin } = useAuth();
  const [email, setEmail] = useState(admin?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password && password !== confirmPassword) {
      setError("كلمتا المرور الجديدتان غير متطابقتين");
      return;
    }

    const nextEmail = email.trim().toLowerCase();
    const emailChanged = nextEmail !== admin?.email;
    if (!emailChanged && !password) {
      setError("لم يتم تغيير أي بيانات");
      return;
    }

    setSaving(true);
    try {
      const data = await api.updateAccount({
        currentPassword,
        email: emailChanged ? nextEmail : undefined,
        password: password || undefined,
      });
      setAdmin(data.admin);
      setEmail(data.admin.email);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setMessage("تم حفظ بيانات الدخول");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الحساب");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout title="البريد وكلمة المرور">
      <form onSubmit={(event) => void onSubmit(event)} className="max-w-lg rounded-[1.6rem] bg-white p-6 shadow-sm">
        {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <label className="block text-sm font-bold">البريد الإلكتروني</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none"
        />

        <label className="mt-4 block text-sm font-bold">كلمة المرور الحالية</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none"
        />

        <label className="mt-4 block text-sm font-bold">كلمة المرور الجديدة</label>
        <input
          type="password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="اتركها فارغة إذا لا تريد تغييرها"
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none"
        />

        <label className="mt-4 block text-sm font-bold">تأكيد كلمة المرور الجديدة</label>
        <input
          type="password"
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 outline-none"
        />

        <p className="mt-3 text-xs text-muted">كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل وتحتوي حرفاً ورقماً.</p>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 w-full rounded-xl bg-cordoba py-3 font-bold text-white disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </form>
    </AdminLayout>
  );
}
