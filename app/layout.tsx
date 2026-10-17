import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const socialImage = { url: "/images/samish-logo-horizontal-dark.png", width: 1920, height: 640, alt: "Samish Digital Wave — AI-Powered Digital Marketing" };
const metadataBase = (() => {
  try {
    const url = new URL(siteConfig.siteUrl);
    return url.protocol === "https:" || url.hostname === "localhost" ? url : undefined;
  } catch {
    return undefined;
  }
})();

export const metadata: Metadata = {
  title: "Samish Digital Wave | Free Marketing Consultation",
  description: "Explore smarter digital marketing opportunities with Samish Digital Wave. Request a free introductory consultation tailored to your business goals.",
  applicationName: "Samish Digital Wave",
  openGraph: {
    title: "Samish Digital Wave | Free Marketing Consultation",
    description: "Start a focused conversation about your business, marketing goals, and practical next steps.",
    siteName: "Samish Digital Wave",
    type: "website",
    ...(metadataBase ? { images: [socialImage] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: "Samish Digital Wave | Free Marketing Consultation",
    description: "Explore smarter digital marketing opportunities for your business.",
    ...(metadataBase ? { images: [socialImage.url] } : {}),
  },
  icons: { icon: "/images/samish-icon-512.png", apple: "/images/samish-icon-512.png" },
  ...(metadataBase ? { metadataBase } : {}),
};

export const viewport: Viewport = {
  themeColor: "#11121B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body id="top">{children}</body>
    </html>
  );
}
