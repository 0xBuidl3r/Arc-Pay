import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARC Pay - Send USDC beautifully on ARC",
  description: "Simple, elegant payment links powered by the ARC blockchain. Create beautiful payment requests in seconds.",
  manifest: "/manifest.json",
  icons: {
    icon: "/arcpay.png",
    apple: "/arcpay.png",
  },
  openGraph: {
    title: "ARC Pay - Send USDC beautifully on ARC",
    description: "Simple, elegant payment links powered by the ARC blockchain.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ARC Pay",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} h-full antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}