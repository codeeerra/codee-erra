export interface Product {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  featured: boolean;
  createdAt: Date | string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  createdAt: Date | string;
}

export interface UpcomingProject {
  id: string;
  title: string;
  description: string;
  status: "planning" | "development" | "testing" | "launch";
  createdAt: Date | string;
}

export interface AboutContent {
  id?: string;
  companyInfo: string;
  mission: string;
  vision: string;
  founderStory: string;
  images: string[];
}

export interface SiteSettings {
  id?: string;
  logoUrl: string;
  companyName: string;
}

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  productName: string;
  inquiryType: "purchase" | "partnership" | "demo" | "custom";
  budget: string;
  message: string;
  createdAt: Date | string;
  status: "new" | "contacted" | "closed";
}
