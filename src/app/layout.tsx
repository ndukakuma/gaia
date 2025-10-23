import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gaia",
  description: "Photoreal avatars.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
       <header className="site-header">
  <div className="container header-inner">
    <a href="/" className="brand" aria-label="Gaia Home">
      {/* icon mark */}
      <img src="/brand/gaia-logo.svg" alt="Gaia logo" className="brand-mark" />
      {/* wordmark (SVG text logo) – hides on very small screens */}
      <img src="/brand/gaia-wordmark.svg" alt="Gaia wordmark" className="brand-wordmark" />
    </a>

    <form action="/" method="get" className="search" role="search">
      <input type="search" name="q" placeholder="Search avatars…" className="input" aria-label="Search avatars" />
      <button className="btn" type="submit">Search</button>
    </form>

    <nav className="nav">
      <a href="/my" className="nav-link">My Avatars</a>
      <a href="/create" className="btn btn-primary">Create</a>
    </nav>
  </div>
</header>


        {children}
      </body>
    </html>
  );
}
