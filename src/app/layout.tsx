import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextTube – Modern Video Platform Built with Next.js",
  description:
    "NextTube is a full-featured, scalable video platform powered by Next.js, tRPC, and Mux. Enjoy real-time video processing, smart content management, and seamless viewer interaction—all in one modern YouTube clone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body className={`${inter.className}`}>
          <TRPCProvider>
            {children}
            <Toaster position="top-center" richColors />
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
