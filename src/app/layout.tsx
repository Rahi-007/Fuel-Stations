import type { Metadata } from "next";
import { Salsa, Roboto_Condensed, Noto_Sans_Bengali } from "next/font/google";
import { ThemeProvider } from "@/provider/themeProvider";
import { Toaster } from "sonner";
import Providers from "@/provider/storeProvider";
import Root from "./Root";
import "../style/globals.css";

const salsa = Salsa({
  variable: "--font-salsa",
  subsets: ["latin"],
  weight: "400",
});

const roboto = Roboto_Condensed({
  variable: "--font-roboto-condensed",
  subsets: ["latin"],
  weight: "500",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fuel Map",
  description:
    "Find petrol and diesel stations across Bangladesh with FuelMap.bd. Check fuel availability, station locations, and save time on your refueling trips.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
    ],
    shortcut: { url: "/favicon.ico", type: "image/x-icon" },
    apple: { url: "/favicon.svg", type: "image/svg+xml" },
  },
};

interface IProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<IProps>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${salsa.variable} ${roboto.variable} ${notoBengali.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            <Root>
              {children}
              <Toaster
                theme="dark"
                closeButton
                toastOptions={{
                  className:
                    "border border-zinc-700/60 bg-zinc-950/92 text-zinc-100 backdrop-blur-md",
                  descriptionClassName: "text-zinc-400",
                  style: {
                    boxShadow:
                      "0 14px 34px -16px rgba(0,0,0,0.72), inset 0 1px 0 rgba(255,255,255,0.06)",
                  },
                }}
              />
            </Root>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
