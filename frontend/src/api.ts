import type { Admin, Branch, FaqItem, Governorate, Rate, Settings, SocialLink } from "./types";

const TOKEN_KEY = "cordoba-admin-token";

function apiBase() {
  const fromEnv = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (import.meta.env.DEV) return "/api";
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path === "/cordoba" || path.startsWith("/cordoba/")) return "/cordoba/api";
  }
  return "/api";
}

function fail(message: string): never {
  throw new Error(message);
}

function readToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function writeToken(token: string | null) {
  if (!token) {
    sessionStorage.removeItem(TOKEN_KEY);
    return;
  }
  sessionStorage.setItem(TOKEN_KEY, token);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = readToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, { ...options, headers });
  } catch {
    fail("تعذر الاتصال بالخادم. تأكد أن Apache وMySQL يعملان من XAMPP");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    fail(typeof payload.message === "string" ? payload.message : "حدث خطأ");
  }
  return payload as T;
}

async function geocodeOpenStreetMap(q: string) {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&accept-language=ar&q=${encodeURIComponent(q)}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) fail("تعذر البحث حالياً، حاول مرة أخرى");
  const rows = (await response.json()) as Array<{ display_name?: string; lat?: string; lon?: string }>;
  return {
    results: rows
      .map((row) => ({
        label: row.display_name ?? "",
        lat: Number(row.lat),
        lng: Number(row.lon),
      }))
      .filter((row) => row.label && Number.isFinite(row.lat) && Number.isFinite(row.lng)),
  };
}

export const api = {
  rates: () => request<{ rates: Rate[]; updatedAt: string }>("/rates"),

  locations: () => request<{ governorates: Governorate[]; branches: Branch[] }>("/locations"),

  geocode: (q: string) => geocodeOpenStreetMap(q),

  settings: () => request<Settings>("/settings"),

  me: () => request<{ admin: Admin }>("/me"),

  login: async (email: string, password: string) => {
    const data = await request<{ admin: Admin; token: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    writeToken(data.token);
    return { admin: data.admin };
  },

  logout: async () => {
    try {
      await request<{ ok: true }>("/logout", { method: "POST" });
    } catch {
      // still clear the local session if the token is already invalid
    }
    writeToken(null);
    return { ok: true as const };
  },

  updateRate: (
    rateId: string,
    patch: { buy?: number; sell?: number; code?: string; nameAr?: string; flag?: string },
  ) =>
    request<{ rate: Rate }>(`/rates/${rateId}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),

  createRate: (payload: { code: string; nameAr: string; flag?: string; buy: number; sell: number }) =>
    request<{ rate: Rate }>("/rates", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteRate: (rateId: string) =>
    request<{ ok: true }>(`/rates/${rateId}`, { method: "DELETE" }),

  faqs: () => request<{ faqs: FaqItem[] }>("/faqs"),

  createFaq: (payload: { question: string; answer: string }) =>
    request<{ faq: FaqItem }>("/faqs", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateFaq: (faqId: string, payload: { question?: string; answer?: string }) =>
    request<{ faq: FaqItem }>(`/faqs/${faqId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteFaq: (faqId: string) =>
    request<{ ok: true }>(`/faqs/${faqId}`, { method: "DELETE" }),

  updateAccount: (payload: { currentPassword: string; email?: string; password?: string }) =>
    request<{ admin: Admin }>("/account", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  createGovernorate: (name: string) =>
    request<{ governorate: Governorate }>("/governorates", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),

  updateGovernorate: (govId: string, name: string) =>
    request<{ governorate: Governorate }>(`/governorates/${govId}`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),

  deleteGovernorate: (govId: string) =>
    request<{ ok: true }>(`/governorates/${govId}`, { method: "DELETE" }),

  createBranch: (payload: Omit<Branch, "id">) =>
    request<{ branch: Branch }>("/branches", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateBranch: (branchId: string, payload: Partial<Omit<Branch, "id">>) =>
    request<{ branch: Branch }>(`/branches/${branchId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteBranch: (branchId: string) =>
    request<{ ok: true }>(`/branches/${branchId}`, { method: "DELETE" }),

  updateSettings: (payload: {
    whatsapp?: string;
    mainBranchLabel?: string;
    mainBranchCity?: string;
    mainBranchText?: string;
    socialLinks?: SocialLink[];
  }) =>
    request<{ settings: Settings }>("/settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
