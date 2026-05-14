import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "codee.erra — Futuristic Technology Innovation",
  description: "Premium AI-driven software solutions & futuristic technology products by codee.erra",
  keywords: "codee.erra, AI software, technology startup, futuristic solutions",
  openGraph: {
    title: "codee.erra",
    description: "Premium AI-driven software solutions",
    images: ["/logo.jpeg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#0F172A",
                color: "#fff",
                border: "1px solid rgba(0,217,255,0.3)",
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "15px",
              },
              success: {
                iconTheme: { primary: "#00D9FF", secondary: "#020617" },
              },
              error: {
                iconTheme: { primary: "#ff4444", secondary: "#fff" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
