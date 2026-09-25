import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";


export const metadata: Metadata = {
  title: "AdCreator AI",
  description: "Turn top ads into high-performing creative variants.",
};

// Applies the saved theme before first paint to avoid a flash of the wrong theme.
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t !== 'light' && t !== 'dark') t = 'dark';
    if (t === 'dark') document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = t;
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
