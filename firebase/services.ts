import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, Timestamp, setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./config";
import { Product, NewsItem, UpcomingProject, AboutContent, SiteSettings, Inquiry } from "@/types";

// ─── Image Upload ────────────────────────────────────────────────────────────
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "codeeerra");

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Upload failed");
  }

  return data.secure_url;
}

export async function deleteImage(): Promise<void> {
  return;
}

// ─── Products ─────────────────────────────────────────────

const STORAGE_KEY = "codee_products";

function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}

function saveStoredProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export async function getProducts(): Promise<Product[]> {
  return getStoredProducts();
}

export async function getProduct(id: string): Promise<Product | null> {
  return getStoredProducts().find((p) => p.id === id) || null;
}

export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const products = getStoredProducts();

  const newProduct: Product = {
    id: Date.now().toString(),
    ...data,
  };

  products.unshift(newProduct);

  saveStoredProducts(products);

  return newProduct.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const products = getStoredProducts().map((p) =>
    p.id === id ? { ...p, ...data } : p
  );

  saveStoredProducts(products);
}

export async function deleteProduct(id: string): Promise<void> {
  const products = getStoredProducts().filter((p) => p.id !== id);

  saveStoredProducts(products);
}

// ─── News ─────────────────────────────────────────────

const NEWS_KEY = "codee_news";

function getStoredNews(): NewsItem[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(NEWS_KEY);

  return data ? JSON.parse(data) : [];
}

function saveStoredNews(news: NewsItem[]) {
  localStorage.setItem(NEWS_KEY, JSON.stringify(news));
}

export async function getNews(): Promise<NewsItem[]> {
  return getStoredNews();
}

export async function addNews(
  data: Omit<NewsItem, "id">
): Promise<string> {

  const news = getStoredNews();

  const newItem: NewsItem = {
    id: Date.now().toString(),
    ...data,
  };

  news.unshift(newItem);

  saveStoredNews(news);

  return newItem.id;
}

export async function updateNews(
  id: string,
  data: Partial<NewsItem>
): Promise<void> {

  const news = getStoredNews().map((n) =>
    n.id === id ? { ...n, ...data } : n
  );

  saveStoredNews(news);
}

export async function deleteNews(id: string): Promise<void> {

  const news = getStoredNews().filter(
    (n) => n.id !== id
  );

  saveStoredNews(news);
}

// ─── Upcoming Projects ─────────────────────────────────────────────

const UPCOMING_KEY = "codee_upcoming_projects";

function getStoredUpcomingProjects(): UpcomingProject[] {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(UPCOMING_KEY);

  return data ? JSON.parse(data) : [];
}

function saveStoredUpcomingProjects(projects: UpcomingProject[]) {
  localStorage.setItem(UPCOMING_KEY, JSON.stringify(projects));
}

export async function getUpcomingProjects(): Promise<UpcomingProject[]> {
  return getStoredUpcomingProjects();
}

export async function addUpcomingProject(
  data: Omit<UpcomingProject, "id">
): Promise<string> {

  const projects = getStoredUpcomingProjects();

  const newProject: UpcomingProject = {
    id: Date.now().toString(),
    ...data,
  };

  projects.unshift(newProject);

  saveStoredUpcomingProjects(projects);

  return newProject.id;
}

export async function updateUpcomingProject(
  id: string,
  data: Partial<UpcomingProject>
): Promise<void> {

  const projects = getStoredUpcomingProjects().map((p) =>
    p.id === id ? { ...p, ...data } : p
  );

  saveStoredUpcomingProjects(projects);
}

export async function deleteUpcomingProject(id: string): Promise<void> {

  const projects = getStoredUpcomingProjects().filter(
    (p) => p.id !== id
  );

  saveStoredUpcomingProjects(projects);
}

// ─── About ───────────────────────────────────────────────────────────────────
const ABOUT_STORAGE_KEY = "codee_about_content";

export async function getAboutContent(): Promise<AboutContent | null> {
  if (typeof window === "undefined") return null;

  const data = localStorage.getItem(ABOUT_STORAGE_KEY);

  return data ? JSON.parse(data) : null;
}

export async function updateAboutContent(data: Partial<AboutContent>): Promise<void> {
  localStorage.setItem(
    ABOUT_STORAGE_KEY,
    JSON.stringify(data)
  );

  console.log("About content saved");
}
// ─── Settings ────────────────────────────────────────────────────────────────
export async function getSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, "settings", "main"));
  return snap.exists() ? snap.data() as SiteSettings : null;
}

export async function updateSettings(data: Partial<SiteSettings>): Promise<void> {
  await setDoc(doc(db, "settings", "main"), data, { merge: true });
}

// ─── Inquiries ───────────────────────────────────────────────────────────────
export async function getInquiries(): Promise<Inquiry[]> {
  const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Inquiry));
}

export async function addInquiry(data: Omit<Inquiry, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "inquiries"), { ...data, createdAt: Timestamp.now(), status: "new" });
  return ref.id;
}

export async function updateInquiry(id: string, data: Partial<Inquiry>): Promise<void> {
  await updateDoc(doc(db, "inquiries", id), data);
}

export async function deleteInquiry(id: string): Promise<void> {
  await deleteDoc(doc(db, "inquiries", id));
}
