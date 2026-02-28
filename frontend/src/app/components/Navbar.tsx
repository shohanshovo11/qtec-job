"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, _hasHydrated } = useAuthStore();
  const isLoading = !_hasHydrated;
  const router = useRouter();

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="w-full bg-[#F8F8FD] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/icons/Logo-dark.svg"
              alt="QuickHire"
              width={140}
              height={33}
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/jobs"
              className="text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              href="#"
              className="text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] transition-colors"
            >
              Browse Companies
            </Link>
          </nav>

          {/* Desktop CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="w-24 h-9 rounded bg-[var(--border-subtle)] animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-[var(--color-brand-100)] transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--action-primary)] text-white text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[var(--text-primary)] text-sm font-medium max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`text-[var(--text-muted)] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white shadow-[var(--shadow-md)] border border-[var(--border-subtle)] py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-[var(--border-subtle)] mb-1">
                      <p className="text-xs text-[var(--text-muted)]">
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {user.email}
                      </p>
                    </div>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--color-neutral-50)] hover:text-[var(--text-primary)] transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User size={14} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[var(--action-primary)] text-sm font-semibold px-4 py-2 hover:bg-[var(--color-brand-100)] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-white! text-sm font-semibold px-5 py-2.5 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-all duration-200 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-all duration-200 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-[var(--text-primary)] transition-all duration-200 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden pb-5 flex flex-col gap-4 border-t border-[var(--border-subtle)] pt-4">
            <Link
              href="/jobs"
              className="text-[var(--text-secondary)] text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <Link
              href="#"
              className="text-[var(--text-secondary)] text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Browse Companies
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--action-primary)] text-white text-xs font-semibold shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-red-500 border border-red-200 px-4 py-2 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-center text-[var(--action-primary)] text-sm font-semibold border border-[var(--action-primary)] px-4 py-2 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-center text-white text-sm font-semibold px-4 py-2 bg-[var(--action-primary)] rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
