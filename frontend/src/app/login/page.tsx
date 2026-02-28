"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { loginUser, getApiErrorMessage } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await loginUser(form.email, form.password);
      login(res.token, res.user);
      toast.success(`Welcome back, ${res.user.name}!`);
      router.push("/");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }));
    };
  }

  return (
    <div className="min-h-screen flex bg-[#F8F8FD]">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative overflow-hidden flex-col">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5] via-[#5865f2] to-[#7b87ff]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#2c287d]/40 blur-3xl" />

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Brand */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/icons/Logo.svg"
              alt="QuickHire"
              width={140}
              height={33}
              priority
            />
          </Link>

          {/* Hero copy */}
          <div className="flex-1 flex flex-col justify-center mt-4">
            <h2
              className="text-white text-3xl xl:text-4xl font-bold leading-snug mb-4"
              style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            >
              Your next great
              <br />
              opportunity awaits.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Log in to track your applications, save jobs, and connect with
              thousands of companies hiring right now.
            </p>

            {/* Feature points */}
            <ul className="mt-10 space-y-4">
              {[
                "Browse 10,000+ live job listings",
                "One-click applications",
                "Real-time application tracking",
              ].map((feat) => (
                <li
                  key={feat}
                  className="flex items-center gap-3 text-white/85 text-sm"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 3.5L3.8 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom quote */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/60 text-xs leading-relaxed italic">
              "Found my dream job within a week of signing up. The experience
              was seamless."
            </p>
            <p className="text-white/50 text-xs mt-1.5">
              — Sarah K., UX Designer
            </p>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 md:px-16 lg:px-12 xl:px-20 py-10">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link href="/">
            <Image
              src="/icons/Logo.svg"
              alt="QuickHire"
              width={130}
              height={31}
              priority
              className="brightness-0"
            />
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto">
          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-[var(--text-primary)] text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            >
              Welcome back
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              New to QuickHire?{" "}
              <Link
                href="/signup"
                className="text-[var(--action-primary)] font-semibold hover:underline"
              >
                Create a free account
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[var(--text-primary)] text-sm font-medium mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                className={`w-full h-11 px-4 rounded-lg border bg-white text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--action-primary)]/25 focus:border-[var(--action-primary)] ${
                  errors.email
                    ? "border-[var(--danger)]"
                    : "border-[var(--border-strong)]"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-[var(--danger)]">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-[var(--text-primary)] text-sm font-medium"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-[var(--action-primary)] font-medium hover:underline"
                  tabIndex={-1}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="••••••••"
                  className={`w-full h-11 px-4 pr-11 rounded-lg border bg-white text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--action-primary)]/25 focus:border-[var(--action-primary)] ${
                    errors.password
                      ? "border-[var(--danger)]"
                      : "border-[var(--border-strong)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-[var(--danger)]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border-subtle)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#F8F8FD] px-3 text-[var(--text-muted)]">
                or continue with
              </span>
            </div>
          </div>

          {/* Social placeholder (disabled — backend doesn't support OAuth yet) */}
          <button
            type="button"
            disabled
            className="w-full h-11 rounded-lg border border-[var(--border-strong)] bg-white text-[var(--text-secondary)] text-sm font-medium flex items-center justify-center gap-2.5 opacity-50 cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-xs text-[var(--text-muted)] mt-8">
            By signing in, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-[var(--text-secondary)]">
              Terms
            </span>{" "}
            and{" "}
            <span className="underline cursor-pointer hover:text-[var(--text-secondary)]">
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
