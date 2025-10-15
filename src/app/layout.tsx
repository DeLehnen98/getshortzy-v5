import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/lib/trpc/client";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GetShortzy - AI-Powered Video Automation for Viral Shorts",
  description: "Transform long videos into viral short-form content for TikTok, YouTube Shorts, and Instagram Reels. AI-powered platform with GPT-4, Claude, Gemini 2.0, and Veo 3 integration.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL("https://getshortzy.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "GetShortzy - AI-Powered Video Automation for Viral Shorts",
    description: "Transform long videos into viral short-form content for TikTok, YouTube Shorts, and Instagram Reels. AI-powered platform with GPT-4, Claude, Gemini 2.0, and Veo 3 integration.",
    url: "https://getshortzy.com",
    siteName: "GetShortzy",
    images: [
      {
        url: "/og-image.jpg",
        width: 800,
        height: 450,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetShortzy - AI-Powered Video Automation for Viral Shorts",
    description: "Transform long videos into viral short-form content for TikTok, YouTube Shorts, and Instagram Reels. AI-powered platform with GPT-4, Claude, Gemini 2.0, and Veo 3 integration.",
    creator: "@getshortzy",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#8b5cf6",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

