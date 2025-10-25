import "./globals.css";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gaia",
  description: "Photoreal avatars.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="site-header">
          <div className="header-bar">
            <div className="header-left">
              <Link href="/" className="brand" aria-label="Gaia Home">
                <Image src="/brand/gaia-logo.svg" alt="Gaia logo" className="brand-mark" width={36} height={36} priority />
                <span className="brand-wordmark-wrap">
                  <Image src="/brand/gaia-wordmark.svg" alt="Gaia wordmark" className="brand-wordmark" width={136} height={30} priority />
                </span>
              </Link>
            </div>

            <nav className="header-nav" aria-label="Main navigation">
              <Link href="/" className="nav-link">
                Explore
              </Link>
              <Link href="/#community" className="nav-link">
                Community
              </Link>
              <Link href="/my" className="nav-link">
                My Avatars
              </Link>
            </nav>

            <div className="header-right">
              <form action="/" method="get" className="search" role="search">
                <div className="search-field">
                  <span className="search-icon" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M13 13L17 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type="search"
                    name="q"
                    id="site-search"
                    placeholder="Search"
                    className="input"
                    aria-label="Search avatars"
                  />
                </div>
              </form>
              <Link href="/auth/sign-in" className="nav-link">
                Log in
              </Link>
              <Link href="/create" className="btn btn-icon" aria-label="Create avatar">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 3V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M15 9H3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="container footer-grid">
            <div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Gaia</p>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Photoreal avatar studio · Private beta</p>
            </div>
            <div className="footer-links">
              <Link href="/auth/sign-in">Account</Link>
              <Link href="/create">Create</Link>
              <Link href="/#community">Community</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
