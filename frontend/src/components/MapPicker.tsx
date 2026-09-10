import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../api";

export function branchIcon(active = false) {
  const size = active ? 20 : 16;
  const color = active ? "#D4A017" : "#1B6B1C";
  return L.divIcon({
    className: "cordoba-pin",
    html: `<div style="width:${size}px;height:${size}px;border-radius:999px;background:${color};border:3px solid #D4A017;box-shadow:0 6px 16px rgba(27,107,28,.35)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface SearchHit {
  label: string;
  lat: number;
  lng: number;
}

export function MapPicker({
  lat,
  lng,
  onChange,
}: {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const start: [number, number] = lat && lng ? [lat, lng] : [35.0, 38.0];
    const map = L.map(containerRef.current, {
      center: start,
      zoom: lat && lng ? 14 : 6.2,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    if (lat && lng) {
      markerRef.current = L.marker([lat, lng], { icon: branchIcon(true), draggable: true }).addTo(map);
      markerRef.current.on("dragend", () => {
        const pos = markerRef.current?.getLatLng();
        if (pos) onChangeRef.current(pos.lat, pos.lng);
      });
    }

    map.on("click", (event) => {
      onChangeRef.current(event.latlng.lat, event.latlng.lng);
    });

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 200);
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (lat == null || lng == null) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }
    if (!markerRef.current) {
      markerRef.current = L.marker([lat, lng], { icon: branchIcon(true), draggable: true }).addTo(map);
      markerRef.current.on("dragend", () => {
        const pos = markerRef.current?.getLatLng();
        if (pos) onChangeRef.current(pos.lat, pos.lng);
      });
    } else {
      markerRef.current.setLatLng([lat, lng]);
    }
    map.setView([lat, lng], Math.max(map.getZoom(), 14));
  }, [lat, lng]);

  async function runSearch(term = query) {
    const value = term.trim();
    if (value.length < 2) {
      setHits([]);
      setStatus("اكتب حرفين على الأقل ثم اضغط بحث");
      return;
    }
    setSearching(true);
    setStatus("");
    try {
      const data = await api.geocode(value);
      setHits(data.results);
      setOpen(true);
      setStatus(data.results.length === 0 ? "لا توجد نتائج لهذا البحث" : "");
    } catch {
      setHits([]);
      setOpen(true);
      setStatus("تعذر البحث حالياً، حاول مرة أخرى");
    } finally {
      setSearching(false);
    }
  }

  function chooseHit(hit: SearchHit) {
    onChange(hit.lat, hit.lng);
    mapRef.current?.flyTo([hit.lat, hit.lng], 16, { duration: 0.7 });
    setQuery(hit.label);
    setHits([]);
    setOpen(false);
    setStatus("");
  }

  return (
    <div>
      <p className="mb-2 text-sm text-muted">
        ابحث عن المكان ثم ثبّت الدبوس بالنقر أو السحب. يمكنك أيضاً حفظ الفرع بدون موقع على الخريطة.
      </p>
      <div className="relative mb-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setStatus("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.stopPropagation();
                  void runSearch(event.currentTarget.value);
                }
                if (event.key === "Escape") setOpen(false);
              }}
              placeholder="مثال: حلب الفرقان، دمشق المالكي..."
              className="w-full rounded-xl border border-black/10 bg-white py-2.5 pr-10 pl-3 outline-none"
              autoComplete="off"
            />
          </div>
          <button
            type="button"
            onClick={() => void runSearch()}
            disabled={searching}
            className="rounded-xl bg-cordoba px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {searching ? "..." : "بحث"}
          </button>
        </div>
        {status && <p className="mt-1 text-xs text-muted">{status}</p>}
        {open && hits.length > 0 && (
          <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-black/10 bg-white shadow-lg">
            {hits.map((hit) => (
              <li key={`${hit.lat}-${hit.lng}-${hit.label}`}>
                <button
                  type="button"
                  onClick={() => chooseHit(hit)}
                  className="w-full px-3 py-2 text-right text-sm leading-6 hover:bg-cordoba-soft"
                >
                  {hit.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div ref={containerRef} className="h-64 overflow-hidden rounded-2xl border border-cordoba/10" />
    </div>
  );
}
