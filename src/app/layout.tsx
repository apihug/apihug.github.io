import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SearchProvider } from "@/components/search";

const inter = localFont({
  src: [
    { path: "../fonts/InterVariable.woff2", weight: "100 900", style: "normal" },
    {
      path: "../fonts/InterVariable-Italic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-inter",
});

const plexMono = localFont({
  src: [
    {
      path: "../fonts/IBMPlexMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/IBMPlexMono-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-plex-mono",
});

const ubuntuMono = localFont({
  src: [
    {
      path: "../fonts/Ubuntu-Mono-bold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-ubuntu-mono",
});

const js = String.raw;
let googleAnalyticsScript = js`
  try {
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-PXR19X43CS');
  } catch (_) {}
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://apihug.com"),
  title: {
    default: "ApiHug - API as Architecture",
    template: "%s - ApiHug",
  },
  description:
    "AI-native Enterprise Architecture Factory. Transform API definitions into executable software systems.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} ${ubuntuMono.variable} antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={v("/favicons/apple-touch-icon.png")} />
        <link rel="icon" type="image/png" sizes="32x32" href={v("/favicons/favicon-32x32.png")} />
        <link rel="icon" type="image/png" sizes="16x16" href={v("/favicons/favicon-16x16.png")} />
        <link rel="manifest" href={v("/favicons/site.webmanifest")} />
        <link rel="shortcut icon" href={v("/favicons/favicon.ico")} />
        <meta name="msapplication-TileColor" content="#38bdf8" />
        <meta name="msapplication-config" content={v("/favicons/browserconfig.xml")} />
        <meta name="theme-color" content="white" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PXR19X43CS"></script>
        <script dangerouslySetInnerHTML={{ __html: googleAnalyticsScript }}></script>
      </head>
      <body>
        <SearchProvider>
          <div className="isolate">{children}</div>
        </SearchProvider>
      </body>
    </html>
  );
}

const FAVICON_VERSION = 1;
function v(href: string) {
  return `${href}?v=${FAVICON_VERSION}`;
}
