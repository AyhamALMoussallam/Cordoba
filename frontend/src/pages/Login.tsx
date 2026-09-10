import { useState, type FormEvent } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "../components/Logo";

export function LoginPage() {
  const { admin, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && admin) {
    return <Navigate to="/admin" replace />;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر تسجيل الدخول");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cordoba-deep px-4">
      <form onSubmit={(event) => void onSubmit(event)} className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <Logo />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-cordoba">دخول لوحة التحكم</h1>
        <p className="mt-2 text-sm text-muted">مخصص لمدراء قرطبة فقط. لا يمكن للزوار الدخول إلى هذه الصفحة.</p>
        <Link to="/" className="mt-2 inline-block text-sm font-bold text-cordoba hover:underline">
          العودة إلى الموقع
        </Link>
        <label className="mt-6 block text-sm font-bold">البريد الإلكتروني</label>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
        />
        <label className="mt-4 block text-sm font-bold">كلمة المرور</label>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
        />
        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-2xl bg-cordoba py-3 font-bold text-white disabled:opacity-60"
        >
          {submitting ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}
