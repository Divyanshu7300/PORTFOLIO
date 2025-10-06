// app/layout.js
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
