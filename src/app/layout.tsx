import type { Metadata } from "next";
import "./globals.css";
import AuthHydrator from "@/components/AuthHydrator";
import { ApiErrorBoundary } from "@/components/ApiErrorBoundary";

export const metadata: Metadata = {
  title: "Acadexis - Educational Platform",
  description: "An educational platform for students and lecturers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <ApiErrorBoundary>
          <AuthHydrator />
          {children}
        </ApiErrorBoundary>
      </body>
    </html>
  );
}
