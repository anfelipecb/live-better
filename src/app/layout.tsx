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
          colorText: '#ffffff',
          colorTextSecondary: '#c4c6db',
          colorInputBackground: '#1e2035',
          colorInputText: '#ffffff',
          colorNeutral: '#ffffff',
          colorTextOnPrimaryBackground: '#ffffff',
        },
        elements: {
          card: 'bg-[#161825] text-white',
          headerTitle: 'text-white',
          headerSubtitle: 'text-[#b0b2cc]',
          formFieldLabel: 'text-[#d8d9e8]',
          formFieldInput: 'bg-[#1e2035] text-white border-[#282a42]',
          dividerText: 'text-[#8486a8]',
          dividerLine: 'bg-[#282a42]',
          footerActionText: 'text-[#b0b2cc]',
          footerActionLink: 'text-[#8b5cf6]',
          userButtonPopoverCard: 'bg-[#161825] text-white',
          userButtonPopoverActionButton: 'text-[#d8d9e8]',
          userButtonPopoverActionButtonText: 'text-[#d8d9e8]',
          userButtonPopoverFooter: 'text-[#8486a8]',
          userPreviewMainIdentifier: 'text-white',
          userPreviewSecondaryIdentifier: 'text-[#b0b2cc]',
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
