import { useMemo, useState } from "react";
import { SectionHeading } from "../components/SectionHeading";
import { useSite } from "../site";

function formatRate(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function Rates() {
  const { rates, ratesUpdatedAt: updatedAt } = useSite();
  const [amount, setAmount] = useState("100");
  const [code, setCode] = useState("USD");
  const [side, setSide] = useState<"buy" | "sell">("sell");

  const selected = rates.find((rate) => rate.code === code) ?? rates[0];
  const result = useMemo(() => {
    if (!selected) return 0;
    const numeric = Number(amount) || 0;
    return numeric * selected[side];
  }, [amount, selected, side]);

  if (rates.length === 0) return null;

  return (
    <section id="rates" className="py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading kicker="أسعار العملات" title="أسعار الصرف المحدثة يومياً" />
        <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.8rem] bg-cordoba p-6 text-white shadow-xl shadow-cordoba/20">
            <p className="text-sm text-gold">حاسبة تحويل سريعة</p>
            <h3 className="mt-2 text-2xl font-extrabold">حوّل المبلغ إلى الليرة السورية</h3>
            <label className="mt-6 block text-sm text-white/70">المبلغ</label>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              type="number"
              min="0"
              className="mt-2 w-full rounded-2xl border-0 bg-white/10 px-4 py-3 text-lg outline-none"
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <select
                value={selected?.code ?? "USD"}
                onChange={(event) => setCode(event.target.value)}
                className="rounded-2xl bg-white/10 px-3 py-3 outline-none"
              >
                {rates.map((rate) => (
                  <option key={rate.id} value={rate.code} className="text-ink">
                    {rate.flag} {rate.nameAr}
                  </option>
                ))}
              </select>
              <select
                value={side}
                onChange={(event) => setSide(event.target.value as "buy" | "sell")}
                className="rounded-2xl bg-white/10 px-3 py-3 outline-none"
              >
                <option value="sell" className="text-ink">
                  شراء العملة من قرطبة
                </option>
                <option value="buy" className="text-ink">
                  بيع العملة إلى قرطبة
                </option>
              </select>
            </div>
            <div className="mt-6 rounded-2xl bg-white p-5 text-cordoba">
              <p className="text-sm text-muted">الناتج التقريبي</p>
              <p className="mt-1 text-3xl font-extrabold">{formatRate(Math.round(result))} ل.س</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-cordoba/10 bg-white shadow-sm overflow-x-auto">
            {updatedAt && (
              <p className="border-b border-black/5 bg-cream px-5 py-3 text-sm text-muted">
                آخر تعديل للأسعار:{" "}
                <span className="font-bold text-cordoba">
                  {new Date(updatedAt).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                  <span className="inline-block w-6" />
                  {new Date(updatedAt).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </p>
            )}
            <table className="w-full text-right">
              <thead className="bg-cordoba text-white">
                <tr>
                  <th className="px-5 py-4 font-bold">العملة</th>
                  <th className="px-5 py-4 font-bold">البيع</th>
                  <th className="px-5 py-4 font-bold">الشراء</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate, index) => (
                  <tr key={rate.id} className={index % 2 ? "bg-cream/70" : "bg-white"}>
                    <td className="px-5 py-4 font-bold">
                      <span className="ml-2">{rate.flag}</span>
                      {rate.nameAr}
                    </td>
                    <td className="px-5 py-4 tabular-nums">{formatRate(rate.sell)}</td>
                    <td className="px-5 py-4 tabular-nums">{formatRate(rate.buy)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
