export interface Admin {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rate {
  id: string;
  code: string;
  nameAr: string;
  flag: string;
  buy: number;
  sell: number;
  sortOrder: number;
  updatedAt: string;
}

export interface Governorate {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  governorateId: string;
  address: string;
  manager: string;
  phone: string;
  lat: number | null;
  lng: number | null;
}

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export interface Settings {
  whatsapp: string;
  socialLinks: SocialLink[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}
