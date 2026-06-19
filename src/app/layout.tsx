import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { SearchProvider } from "@/components/search";
import { ThemeProvider } from "@/components/theme-toggle";

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
let darkModeScript = js`
  if (!('_updateTheme' in window)) {
    window._updateTheme = function updateTheme(theme) {
      let classList = document.documentElement.classList;

      classList.remove("light", "dark", "system");
      document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove())
      if (theme === 'dark') {
        classList.add('dark')

        let meta = document.createElement('meta')
        meta.name = 'theme-color'
        meta.content = 'oklch(.13 .028 261.692)'
        document.head.appendChild(meta)
      } else if (theme === 'light') {
        classList.add('light')

        let meta = document.createElement('meta')
        meta.name = 'theme-color'
        meta.content = 'white'
        document.head.appendChild(meta)
      } else {
        classList.add('system')

        let meta1 = document.createElement('meta')
        meta1.name = 'theme-color'
        meta1.content = 'oklch(.13 .028 261.692)'
        meta1.media = '(prefers-color-scheme: dark)'
        document.head.appendChild(meta1)

        let meta2 = document.createElement('meta')
        meta2.name = 'theme-color'
        meta2.content = 'white'
        meta2.media = '(prefers-color-scheme: light)'
        document.head.appendChild(meta2)
      }
    }

    try {
      _updateTheme(localStorage.currentTheme)
    } catch (_) {}
  }
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
      className={`${inter.variable} ${plexMono.variable} ${ubuntuMono.variable} antialiased dark:bg-gray-950`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href={v("/favicons/apple-touch-icon.png")} />
        <link rel="icon" type="image/png" sizes="32x32" href={v("/favicons/favicon-32x32.png")} />
        <link rel="icon" type="image/png" sizes="16x16" href={v("/favicons/favicon-16x16.png")} />
        <link rel="manifest" href={v("/favicons/site.webmanifest")} />
        <link rel="shortcut icon" href={v("/favicons/favicon.ico")} />
        <meta name="msapplication-TileColor" content="#38bdf8" />
        <meta name="msapplication-config" content={v("/favicons/browserconfig.xml")} />
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: darkModeScript }}></script>
      </head>
      <body>
        <SearchProvider>
          <ThemeProvider>
            <div className="isolate">{children}</div>
          </ThemeProvider>
        </SearchProvider>
      </body>
    </html>
  );
}

const FAVICON_VERSION = 1;
function v(href: string) {
  return `${href}?v=${FAVICON_VERSION}`;
}
