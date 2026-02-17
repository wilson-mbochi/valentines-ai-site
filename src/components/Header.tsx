"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Menu, X, Heart, Settings } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0c0a0f]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-display font-semibold text-white">
            <Heart className="w-5 h-5 text-rose-400" />
            Eiish
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <Link
                href="/demo"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/settings"
                className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <Link
                href="/demo"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Try the Magic
              </Link>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-400 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-zinc-400 hover:text-white transition-colors py-2 text-left">
                  Sign In
                </button>
              </SignInButton>
              <Link
                href="/demo"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium w-fit"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/settings"
                className="text-zinc-400 hover:text-white transition-colors py-2 flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <Link
                href="/demo"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-medium w-fit"
                onClick={() => setMobileMenuOpen(false)}
              >
                Try the Magic
              </Link>
            </SignedIn>
          </nav>
        )}
      </div>
    </header>
  );
}
