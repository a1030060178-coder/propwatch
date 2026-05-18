import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropWatch — Know When Clients Read Your Proposals",
  description: "Track proposal opens, time spent per section, and get instant alerts. Built for freelancers who close $10K+ deals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white text-zinc-900">
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
