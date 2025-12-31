import "./globals.css";

export const metadata = {
  title: "GHABSA-UHAS Vault | BMB Resources",
  description: "Official repository for BMB students at UHAS",
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
