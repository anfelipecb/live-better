import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/Providers";
import Navigation from "@/components/layout/Navigation";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elevate - Life Improvement Dashboard",
  description:
    "Track workouts, meals, habits, and goals. Build a better you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#8b5cf6',
          colorBackground: '#161825',
          colorText: '#f0f0f5',
          colorTextSecondary: '#b0b2cc',
          colorInputBackground: '#1e2035',
          colorInputText: '#f0f0f5',
          colorNeutral: '#f0f0f5',
        },
      }}
    >
      <html lang="en" className={`${inter.variable} dark`}>
        <body className="min-h-screen antialiased">
          <Providers>
            <div className="flex min-h-screen">
              <Navigation />
              <main className="flex-1 md:ml-64 pb-24 md:pb-0">
                {children}
              </main>
            </div>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
