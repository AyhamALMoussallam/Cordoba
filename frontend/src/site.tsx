import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import { formatPhoneDisplay, phoneTel, whatsappHref } from "./lib/contact";
import type { Branch, FaqItem, Governorate, Rate, SocialLink } from "./types";

interface SiteContextValue {
  whatsapp: string;
  mainBranchLabel: string;
  mainBranchCity: string;
  mainBranchText: string;
  socialLinks: SocialLink[];
  governorates: Governorate[];
  branches: Branch[];
  rates: Rate[];
  ratesUpdatedAt: string;
  faqs: FaqItem[];
  phoneDisplay: string;
  phoneHref: string;
  waLink: (message?: string) => string;
  refresh: () => Promise<void>;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [whatsapp, setWhatsapp] = useState("");
  const [mainBranchLabel, setMainBranchLabel] = useState("الفرع الرئيسي");
  const [mainBranchCity, setMainBranchCity] = useState("دمشق، سوريا");
  const [mainBranchText, setMainBranchText] = useState(
    "شبكة فروع منتشرة لتسليم الحوالات وصرف العملات بسرعة وخصوصية عالية.",
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [rates, setRates] = useState<Rate[]>([]);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState("");
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

  const refresh = useCallback(async () => {
    try {
      const [settings, locations, ratesData, faqsData] = await Promise.all([
        api.settings(),
        api.locations(),
        api.rates(),
        api.faqs(),
      ]);
      setWhatsapp(settings.whatsapp);
      setMainBranchLabel(settings.mainBranchLabel || "الفرع الرئيسي");
      setMainBranchCity(settings.mainBranchCity || "");
      setMainBranchText(settings.mainBranchText || "");
      setSocialLinks(settings.socialLinks ?? []);
      setGovernorates(locations.governorates);
      setBranches(locations.branches);
      setRates(ratesData.rates);
      setRatesUpdatedAt(ratesData.updatedAt);
      setFaqs(faqsData.faqs);
    } catch {
      setSocialLinks([]);
      setGovernorates([]);
      setBranches([]);
      setRates([]);
      setRatesUpdatedAt("");
      setFaqs([]);
    }
  }, []);

  useEffect(() => {
    void refresh();

    function onVisible() {
      if (document.visibilityState === "visible") void refresh();
    }

    function onPageShow(event: PageTransitionEvent) {
      if (event.persisted) void refresh();
    }

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [refresh]);

  const value = useMemo<SiteContextValue>(
    () => ({
      whatsapp,
      mainBranchLabel,
      mainBranchCity,
      mainBranchText,
      socialLinks,
      governorates,
      branches,
      rates,
      ratesUpdatedAt,
      faqs,
      phoneDisplay: formatPhoneDisplay(whatsapp),
      phoneHref: phoneTel(whatsapp),
      waLink: (message?: string) => whatsappHref(whatsapp, message),
      refresh,
    }),
    [whatsapp, mainBranchLabel, mainBranchCity, mainBranchText, socialLinks, governorates, branches, rates, ratesUpdatedAt, faqs, refresh],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSite must be used within SiteProvider");
  }
  return context;
}
