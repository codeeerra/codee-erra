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

export async function getProducts(): Promise<Product[]> {
  try {
    console.log("Trying Firestore...");

    const snap = await getDoc(doc(db, "products", "main"));

    console.log("Firestore success", snap.exists());

    return snap.exists()
      ? snap.data().items || []
      : [];
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  const products = await getProducts();

  return products.find((p) => p.id === id) || null;
}

export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const products = await getProducts();

  const newProduct: Product = {
    id: Date.now().toString(),
    ...data,
  };

  products.unshift(newProduct);

 await setDoc(doc(db, "products", "main"), {
    items: products,
  });

  return newProduct.id;
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  const products = await getProducts();

  const updated = products.map((p) =>
    p.id === id ? { ...p, ...data } : p
  );

 await setDoc(doc(db, "products", "main"), {
    items: updated,
  });
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();

  const filtered = products.filter((p) => p.id !== id);

  await setDoc(doc(db, "products", "main"), {
    items: filtered,
  });
}
/// ─── News ─────────────────────────────────────────────

export async function getNews(): Promise<NewsItem[]> {
  try {
    const snap = await getDoc(doc(db, "news", "main"));

    return snap.exists()
      ? snap.data().items || []
      : [];
  } catch (error) {
    console.error("GET NEWS ERROR:", error);
    return [];
  }
}

export async function addNews(
  data: Omit<NewsItem, "id">
): Promise<string> {

  const news = await getNews();

  const newItem: NewsItem = {
    id: Date.now().toString(),
    ...data,
  };

  news.unshift(newItem);

 await setDoc(doc(db, "news", "main"), {
    items: news,
  });

  return newItem.id;
}

export async function updateNews(
  id: string,
  data: Partial<NewsItem>
): Promise<void> {

  const news = await getNews();

  const updated = news.map((n) =>
    n.id === id ? { ...n, ...data } : n
  );

  await setDoc(doc(db, "news", "main"), {
    items: updated,
  });
}

export async function deleteNews(id: string): Promise<void> {

  const news = await getNews();

  const filtered = news.filter(
    (n) => n.id !== id
  );

  await setDoc(doc(db, "news", "main"), {
    items: filtered,
  });
}
// ─── Upcoming Projects ─────────────────────────────────────────────

export async function getUpcomingProjects(): Promise<UpcomingProject[]> {
  try {
    const snap = await getDoc(doc(db, "upcoming", "main"));

    return snap.exists()
      ? snap.data().items || []
      : [];
  } catch (error) {
    console.error("GET UPCOMING ERROR:", error);
    return [];
  }
}

export async function addUpcomingProject(
  data: Omit<UpcomingProject, "id">
): Promise<string> {

  const projects = await getUpcomingProjects();

  const newProject: UpcomingProject = {
    id: Date.now().toString(),
    ...data,
  };

  projects.unshift(newProject);

  await setDoc(doc(db, "upcoming", "main"), {
    items: projects,
  });

  return newProject.id;
}

export async function updateUpcomingProject(
  id: string,
  data: Partial<UpcomingProject>
): Promise<void> {

  const projects = await getUpcomingProjects();

  const updated = projects.map((p) =>
    p.id === id ? { ...p, ...data } : p
  );

  await setDoc(doc(db, "upcoming", "main"), {
    items: updated,
  });
}

export async function deleteUpcomingProject(id: string): Promise<void> {

  const projects = await getUpcomingProjects();

  const filtered = projects.filter(
    (p) => p.id !== id
  );

  await setDoc(doc(db, "upcoming", "main"), {
    items: filtered,
  });
}

// ─── About ───────────────────────────────────────────────────────────────────

export async function getAboutContent(): Promise<AboutContent | null> {
  try {
    const snap = await getDoc(doc(db, "about", "main"));

    return snap.exists()
      ? (snap.data() as AboutContent)
      : null;
  } catch (error) {
    console.error("GET ABOUT ERROR:", error);
    return null;
  }
}

export async function updateAboutContent(
  data: Partial<AboutContent>
): Promise<void> {

  await setDoc(doc(db, "about", "main"),
    data
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
