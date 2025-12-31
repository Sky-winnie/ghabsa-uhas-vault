import "./globals.css";

export const metadata = {
  title: "GHABSA-UHAS Digital Vault",
  description: "Resource Repository for Biochrmistry and Molecular Biology students",
  icons: {
    icon: [
      { url: "/logo.png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
