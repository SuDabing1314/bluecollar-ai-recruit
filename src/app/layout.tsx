import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileLayout } from "@/components/layout/MobileLayout";

export const metadata: Metadata = {
  title: "职速达 - AI智能招聘",
  description: "用AI面试，快速找到靠谱工作",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "职速达",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <MobileLayout>{children}</MobileLayout>
      </body>
    </html>
  );
}
