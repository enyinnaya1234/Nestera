import "./globals.css";

import type { Metadata } from "next";
import { WalletProvider } from "./context/WalletContext";

const BASE_URL = "https://nestera.app";

export const metadata: Metadata = {
  title: "Nestera - Decentralized Savings on Stellar",
  description: "Secure, transparent savings powered by Stellar & Soroban",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nestera - Decentralized Savings on Stellar",
    description: "Secure, transparent savings powered by Stellar & Soroban",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
