import { CircleHelp, LogOut, MapPin, MessageCircle, Settings, Tags } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { Logo } from "./Logo";
import type { ReactNode } from "react";

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="bg-cordoba-deep p-5 text-white">
          <Logo inverted />
          <p className="mt-6 text-xs tracking-widest text-gold">لوحة التحكم</p>
          <nav className="mt-4 flex flex-col gap-1 text-sm">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"}`
              }
            >
              <Tags className="h-4 w-4" />
              أسعار العملات
            </NavLink>
            <NavLink
              to="/admin/faq"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"}`
              }
            >
              <CircleHelp className="h-4 w-4" />
              الأسئلة والأجوبة
            </NavLink>
            <NavLink
              to="/admin/branches"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"}`
              }
            >
              <MapPin className="h-4 w-4" />
              الفروع والمحافظات
            </NavLink>
            <NavLink
              to="/admin/contact"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"}`
              }
            >
              <MessageCircle className="h-4 w-4" />
              واتساب والتواصل
            </NavLink>
            <NavLink
              to="/admin/account"
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"}`
              }
            >
              <Settings className="h-4 w-4" />
              البريد وكلمة المرور
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="mt-8 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </aside>
        <main className="p-5 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm text-muted">مرحباً {admin?.name}</p>
              <h1 className="text-2xl font-extrabold text-cordoba">{title}</h1>
            </div>
            <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-cordoba">مدير</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
