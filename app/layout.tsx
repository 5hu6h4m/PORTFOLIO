import type { Metadata } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Preloader } from "@/components/preloader"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Analytics } from "@vercel/analytics/react"

const outfit = Outfit({ subsets: ["latin"] });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://shubhamjadhav.com"),
  title: {
    default: "Shubham Jadhav | Full Stack Developer",
    template: "%s | Shubham Jadhav"
  },
  description: "Full Stack Developer skilled in React, Node.js, MongoDB. Building real-world scalable projects.",
  keywords: ["Shubham Jadhav", "Full Stack Developer", "React Developer", "Next.js", "Node.js", "Web Developer", "Software Engineer"],
  openGraph: {
    title: "Shubham Jadhav | Full Stack Developer",
    description: "Building real-world scalable projects using React, Node.js, MongoDB",
    url: "https://shubhamjadhav.com", // update with real domain eventually
    siteName: "Shubham Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shubham Jadhav - Full Stack Developer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubham Jadhav | Full Stack Developer",
    description: "Full Stack Developer Portfolio",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} ${plusJakartaSans.variable} ${inter.variable} antialiased selection:bg-primary/30 min-h-screen bg-black overflow-x-clip`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          <CustomCursor />
          <SmoothScroll>
            <div className="relative overflow-x-clip min-h-screen">
              {children}
            </div>
          </SmoothScroll>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
