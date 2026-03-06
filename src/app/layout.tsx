import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://hoshiapp.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HoshiApp（ホシアップ）| AIで爆速・激安ウェブアプリ開発",
    template: "%s | HoshiApp",
  },
  description:
    "AIエージェントを活用し、クラウドワークスの1/10〜1/20の価格で高品質なウェブアプリを最短数日で納品。既製品アプリのご利用、カスタム受注開発どちらも対応。",
  keywords: [
    "AIウェブアプリ開発",
    "格安アプリ開発",
    "AI受注開発",
    "ウェブアプリ制作",
    "激安開発",
    "HoshiApp",
    "ホシアップ",
    "AIエージェント開発",
    "Next.js開発",
    "フリーランス向けツール",
  ],
  authors: [{ name: "HoshiApp" }],
  creator: "HoshiApp",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    siteName: "HoshiApp",
    title: "HoshiApp | AIで爆速・激安ウェブアプリ開発",
    description:
      "AIエージェントを活用し、クラウドワークスの1/10〜1/20の価格で高品質なウェブアプリを最短数日で納品。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HoshiApp - AIで爆速・激安ウェブアプリ開発",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HoshiApp | AIで爆速・激安ウェブアプリ開発",
    description:
      "AIエージェントを活用し、クラウドワークスの1/10〜1/20の価格で高品質なウェブアプリを最短数日で納品。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJP.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
