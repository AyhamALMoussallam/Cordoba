import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import { AdminLayout } from "../components/AdminLayout";
import { useSite } from "../site";
import type { Rate } from "../types";

type Draft = { buy: string; sell: string; code: string; nameAr: string; flag: string };

const emptyNew = { code: "", nameAr: "", flag: "", buy: "", sell: "" };

function toDraft(rate: Rate): Draft {
  return {
    buy: String(rate.buy),
    sell: String(rate.sell),
    code: rate.code,
    nameAr: rate.nameAr,
    flag: rate.flag,
  };
}

export function RatesAdminPage() {
  const { refresh } = useSite();
  const [rates, setRates] = useState<Rate[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [newRate, setNewRate] = useState(emptyNew);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    void api.rates().then((data) => {
      setRates(data.rates);
      setDrafts(Object.fromEntries(data.rates.map((rate) => [rate.id, toDraft(rate)])));
    });
  }, []);

  function parsePrices(buyRaw: string, sellRaw: string) {
    const buy = Number(buyRaw);
    const sell = Number(sellRaw);
    if (!Number.isFinite(buy) || !Number.isFinite(sell) || buy < 0 || sell < 0) {
      return null;
    }
    return { buy, sell };
  }

  async function save(id: string) {
    const draft = drafts[id];
    if (!draft) return;
    const prices = parsePrices(draft.buy, draft.sell);
    if (!prices) {
      setError("أدخل أسعاراً رقمية صحيحة");
      return;
    }
    if (!draft.code.trim() || !draft.nameAr.trim()) {
      setError("أدخل رمز العملة واسمها");
      return;
    }

    setSavingId(id);
    setError("");
    setMessage("");
    try {
      const data = await api.updateRate(id, {
        ...prices,
        code: draft.code,
        nameAr: draft.nameAr,
        flag: draft.flag,
      });
      setRates((current) => current.map((rate) => (rate.id === id ? data.rate : rate)));
      setDrafts((current) => ({ ...current, [id]: toDraft(data.rate) }));
      await refresh();
      setMessage("تم حفظ السعر بنجاح");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ السعر");
    } finally {
      setSavingId(null);
    }
  }

  async function add(event: FormEvent) {
    event.preventDefault();
    const prices = parsePrices(newRate.buy, newRate.sell);
    if (!prices) {
      setError("أدخل أسعاراً رقمية صحيحة");
      return;
    }
    if (!newRate.code.trim() || !newRate.nameAr.trim()) {
      setError("أدخل رمز العملة واسمها");
      return;
    }

    setAdding(true);
    setError("");
    setMessage("");
    try {
      const data = await api.createRate({
        code: newRate.code,
        nameAr: newRate.nameAr,
        flag: newRate.flag,
        buy: prices.buy,
        sell: prices.sell,
      });
      setRates((current) => [...current, data.rate].sort((a, b) => a.sortOrder - b.sortOrder));
      setDrafts((current) => ({ ...current, [data.rate.id]: toDraft(data.rate) }));
      setNewRate(emptyNew);
      await refresh();
      setMessage("تمت إضافة العملة");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إضافة العملة");
    } finally {
      setAdding(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("حذف هذه العملة من جدول الأسعار؟")) return;
    setError("");
    setMessage("");
    try {
      await api.deleteRate(id);
      setRates((current) => current.filter((rate) => rate.id !== id));
      setDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      await refresh();
      setMessage("تم حذف العملة");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حذف العملة");
    }
  }

  return (
    <AdminLayout title="تعديل أسعار العملات">
      {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form
        onSubmit={(event) => void add(event)}
        className="mb-6 grid gap-3 rounded-[1.6rem] bg-white p-5 shadow-sm md:grid-cols-[80px_120px_1fr_120px_120px_auto]"
      >
        <h2 className="text-lg font-extrabold text-cordoba md:col-span-6">إضافة عملة</h2>
        <input
          value={newRate.flag}
          onChange={(event) => setNewRate((current) => ({ ...current, flag: event.target.value }))}
          placeholder="علم"
          className="rounded-xl border border-black/10 px-3 py-2 text-center"
        />
        <input
          value={newRate.code}
          onChange={(event) => setNewRate((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
          placeholder="USD"
          className="rounded-xl border border-black/10 px-3 py-2"
        />
        <input
          value={newRate.nameAr}
          onChange={(event) => setNewRate((current) => ({ ...current, nameAr: event.target.value }))}
          placeholder="اسم العملة"
          className="rounded-xl border border-black/10 px-3 py-2"
        />
        <input
          value={newRate.sell}
          onChange={(event) => setNewRate((current) => ({ ...current, sell: event.target.value }))}
          placeholder="البيع"
          className="rounded-xl border border-black/10 px-3 py-2"
        />
        <input
          value={newRate.buy}
          onChange={(event) => setNewRate((current) => ({ ...current, buy: event.target.value }))}
          placeholder="الشراء"
          className="rounded-xl border border-black/10 px-3 py-2"
        />
        <button
          type="submit"
          disabled={adding}
          className="rounded-xl bg-cordoba px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {adding ? "جاري الإضافة" : "إضافة"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-[1.6rem] bg-white shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-cream text-sm">
            <tr>
              <th className="px-4 py-3">العملة</th>
              <th className="px-4 py-3">البيع</th>
              <th className="px-4 py-3">الشراء</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rates.map((rate) => (
              <tr key={rate.id} className="border-t border-black/5">
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={drafts[rate.id]?.flag ?? ""}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [rate.id]: { ...(current[rate.id] ?? toDraft(rate)), flag: event.target.value },
                        }))
                      }
                      className="w-14 rounded-xl border border-black/10 px-2 py-2 text-center"
                    />
                    <input
                      value={drafts[rate.id]?.code ?? ""}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [rate.id]: { ...(current[rate.id] ?? toDraft(rate)), code: event.target.value.toUpperCase() },
                        }))
                      }
                      className="w-20 rounded-xl border border-black/10 px-2 py-2 font-bold"
                    />
                    <input
                      value={drafts[rate.id]?.nameAr ?? ""}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [rate.id]: { ...(current[rate.id] ?? toDraft(rate)), nameAr: event.target.value },
                        }))
                      }
                      className="min-w-40 flex-1 rounded-xl border border-black/10 px-3 py-2 font-bold"
                    />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <input
                    value={drafts[rate.id]?.sell ?? ""}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [rate.id]: { ...(current[rate.id] ?? toDraft(rate)), sell: event.target.value },
                      }))
                    }
                    className="w-32 rounded-xl border border-black/10 px-3 py-2"
                  />
                </td>
                <td className="px-4 py-4">
                  <input
                    value={drafts[rate.id]?.buy ?? ""}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [rate.id]: { ...(current[rate.id] ?? toDraft(rate)), buy: event.target.value },
                      }))
                    }
                    className="w-32 rounded-xl border border-black/10 px-3 py-2"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void save(rate.id)}
                      disabled={savingId === rate.id}
                      className="rounded-xl bg-cordoba px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {savingId === rate.id ? "جاري الحفظ" : "حفظ"}
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(rate.id)}
                      className="rounded-xl px-4 py-2 text-sm font-bold text-red-600"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
