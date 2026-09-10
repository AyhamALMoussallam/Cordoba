/** Public URL prefix: `/` on artisan serve / Vite, `/cordoba/` on XAMPP. */
export function publicBase() {
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path === "/cordoba" || path.startsWith("/cordoba/")) return "/cordoba/";
    return "/";
  }
  return import.meta.env.BASE_URL;
}

export const BASE_URL = publicBase();

export function hashHref(id: string) {
  return `${publicBase()}#${id.replace(/^#/, "")}`;
}

export function publicAsset(path: string) {
  return `${publicBase()}${path.replace(/^\//, "")}`;
}

export function routerBasename() {
  const base = publicBase().replace(/\/$/, "");
  return base || undefined;
}
