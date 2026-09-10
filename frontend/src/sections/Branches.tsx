import { useMemo, useState } from "react";
import { ExternalLink, MapPin, Phone, Search, Share2 } from "lucide-react";
import { useSite } from "../site";
import { SectionHeading } from "../components/SectionHeading";
import { PhoneText } from "../components/PhoneText";
import { googleMapsEmbedUrl, googleMapsViewUrl, hasMapLocation } from "../lib/maps";
import type { Branch } from "../types";

const defaultMapSrc = "https://maps.google.com/maps?q=Syria&hl=ar&z=6&output=embed";

export function Branches() {
  const { governorates, branches } = useSite();
  const [query, setQuery] = useState("");
  const [govId, setGovId] = useState("الكل");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapBranchId, setMapBranchId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const govName = (id: string) => governorates.find((item) => item.id === id)?.name ?? "";

  const filtered = useMemo(() => {
    return branches.filter((branch) => {
      const matchGov = govId === "الكل" || branch.governorateId === govId;
      const haystack = `${govName(branch.governorateId)} ${branch.address} ${branch.manager} ${branch.phone}`;
      return matchGov && haystack.includes(query.trim());
    });
  }, [branches, govId, query, governorates]);

  const selected = branches.find((item) => item.id === selectedId) ?? filtered[0] ?? branches[0] ?? null;
  const mapBranch =
    (mapBranchId ? branches.find((item) => item.id === mapBranchId) : null) ??
    branches.find(hasMapLocation) ??
    null;
  const mapSrc = mapBranch && hasMapLocation(mapBranch) ? googleMapsEmbedUrl(mapBranch.lat, mapBranch.lng) : defaultMapSrc;

  if (branches.length === 0) return null;

  function showOnMap(branch: Branch) {
    if (!hasMapLocation(branch)) return;
    setMapBranchId(branch.id);
  }

  function focusBranch(branch: Branch) {
    setSelectedId(branch.id);
    setGovId(branch.governorateId);
    showOnMap(branch);
  }

  function focusGovernorate(id: string) {
    setGovId(id);
    if (id === "الكل") {
      const first = branches[0];
      setSelectedId(first?.id ?? null);
      if (first) showOnMap(first);
      return;
    }
    const first = branches.find((item) => item.governorateId === id);
    setSelectedId(first?.id ?? null);
    if (first) showOnMap(first);
  }

  async function shareBranch(branch: Branch) {
    if (!hasMapLocation(branch)) return;
    const url = googleMapsViewUrl(branch.lat, branch.lng);
    const title = `فرع قرطبة — ${govName(branch.governorateId)}`;
    const text = branch.address;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(url, "_blank", "noreferrer");
    }
  }

  return (
    <section id="branches" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          kicker="فروعنا"
          title="فروعنا تغطي المدن السورية الرئيسية"
          subtitle="اضغط على أي فرع لعرضه على خرائط غوغل، أو افتح الموقع وشاركه"
        />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-[1.8rem] border border-cordoba/10 bg-white">
            <iframe
              title="خرائط غوغل لفروع قرطبة"
              src={mapSrc}
              className="h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            {mapBranch && hasMapLocation(mapBranch) && (
              <div className="flex flex-wrap gap-2 border-t border-black/5 p-3">
                <a
                  href={googleMapsViewUrl(mapBranch.lat, mapBranch.lng)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-cordoba px-3 py-2 text-sm font-bold text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح في خرائط غوغل
                </a>
                <button
                  type="button"
                  onClick={() => void shareBranch(mapBranch)}
                  className="inline-flex items-center gap-1 rounded-full bg-cream px-3 py-2 text-sm font-bold text-cordoba"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? "تم نسخ الرابط" : "مشاركة الموقع"}
                </button>
              </div>
            )}
          </div>
          <div className="rounded-[1.8rem] bg-white p-5 shadow-sm">
            <div className="relative mb-3">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ابحث عن محافظة أو عنوان أو رقم"
                className="w-full rounded-2xl border border-black/10 bg-cream py-2.5 pr-10 pl-3 outline-none"
              />
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => focusGovernorate("الكل")}
                className={`rounded-full px-3 py-1 text-sm ${govId === "الكل" ? "bg-cordoba text-white" : "bg-cream text-ink"}`}
              >
                الكل
              </button>
              {governorates.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => focusGovernorate(item.id)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    govId === item.id ? "bg-cordoba text-white" : "bg-cream text-ink"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="max-h-[300px] space-y-3 overflow-auto pe-1">
              {filtered.map((branch) => {
                const onMap = hasMapLocation(branch);
                return (
                  <article
                    key={branch.id}
                    className={`rounded-2xl border p-4 ${
                      selected?.id === branch.id ? "border-cordoba bg-cordoba-soft" : "border-black/5"
                    }`}
                  >
                    <button type="button" onClick={() => focusBranch(branch)} className="w-full text-right">
                      <p className="flex items-center gap-2 text-sm font-bold text-cordoba">
                        <MapPin className="h-4 w-4" />
                        {govName(branch.governorateId)}
                      </p>
                      <p className="mt-1 text-sm leading-7">{branch.address}</p>
                      {branch.manager && <p className="mt-1 text-xs text-muted">مسؤول المكتب: {branch.manager}</p>}
                      {branch.phone && (
                        <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-cordoba-mid">
                          <Phone className="h-3.5 w-3.5" />
                          <PhoneText value={branch.phone} />
                        </span>
                      )}
                    </button>
                    {onMap && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={googleMapsViewUrl(branch.lat, branch.lng)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-cordoba"
                        >
                          فتح في غوغل
                        </a>
                        <button type="button" onClick={() => void shareBranch(branch)} className="text-xs font-bold text-cordoba">
                          مشاركة
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
