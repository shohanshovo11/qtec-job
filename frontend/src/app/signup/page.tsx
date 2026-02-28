"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { registerUser, getApiErrorMessage } from "@/lib/api";

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "",
  "bg-red-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-green-500",
];

function getPasswordStrength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function SignUpPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof form, string>>
  >({});

  const pwStrength = getPasswordStrength(form.password);

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  function validate() {
    const e: Partial<Record<keyof typeof form, string>> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "At least 6 characters required";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords do not match";
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
      const res = await registerUser(
        form.name.trim(),
        form.email,
        form.password,
      );
      login(res.token, res.user);
      toast.success(`Welcome to QuickHire, ${res.user.name}!`);
      router.push("/");
    } catch (err) {
      toast.error(
        getApiErrorMessage(err, "Registration failed. Please try again."),
      );
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

  const inputClass = (field: keyof typeof form) =>
    `w-full h-11 px-4 rounded-lg border bg-white text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--action-primary)]/25 focus:border-[var(--action-primary)] ${
      errors[field] ? "border-[var(--danger)]" : "border-[var(--border-strong)]"
    }`;

  return (
    <div className="min-h-screen flex bg-[#F8F8FD]">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] relative overflow-hidden flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4338ca] via-[#4f46e5] to-[#7b87ff]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 -left-16 w-80 h-80 rounded-full bg-[#2c287d]/50 blur-3xl" />

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

          <div className="flex-1 flex flex-col justify-center mt-4">
            <h2
              className="text-white text-3xl xl:text-4xl font-bold leading-snug mb-4"
              style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            >
              Start your journey
              <br />
              to success today.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Join thousands of professionals who found their dream jobs through
              QuickHire. It&apos;s free, fast, and easy.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { num: "50K+", label: "Job seekers" },
                { num: "8K+", label: "Companies" },
                { num: "95%", label: "Placement rate" },
                { num: "4.9★", label: "App rating" },
              ].map(({ num, label }) => (
                <div key={label} className="bg-white/10 rounded-xl px-4 py-3">
                  <p className="text-white text-xl font-bold">{num}</p>
                  <p className="text-white/60 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-white/60 text-xs leading-relaxed italic">
              "The sign-up took 30 seconds. I had three interviews scheduled by
              the end of the week."
            </p>
            <p className="text-white/50 text-xs mt-1.5">
              — Marcus L., Software Engineer
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
          <div className="mb-8">
            <h1
              className="text-[var(--text-primary)] text-2xl sm:text-3xl font-bold mb-2"
              style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            >
              Create your account
            </h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[var(--action-primary)] font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-[var(--text-primary)] text-sm font-medium mb-1.5"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Jane Smith"
                className={inputClass("name")}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-[var(--danger)]">
                  {errors.name}
                </p>
              )}
            </div>

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
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-[var(--danger)]">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[var(--text-primary)] text-sm font-medium mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange("password")}
                  placeholder="Min. 6 characters"
                  className={inputClass("password") + " pr-11"}
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
              {/* Strength meter */}
              {form.password && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= pwStrength
                            ? STRENGTH_COLORS[pwStrength]
                            : "bg-[var(--border-subtle)]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Strength:{" "}
                    <span
                      className={
                        pwStrength <= 1
                          ? "text-red-500"
                          : pwStrength === 2
                            ? "text-yellow-500"
                            : pwStrength === 3
                              ? "text-blue-500"
                              : "text-green-600"
                      }
                    >
                      {STRENGTH_LABELS[pwStrength]}
                    </span>
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-xs text-[var(--danger)]">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm"
                className="block text-[var(--text-primary)] text-sm font-medium mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={handleChange("confirm")}
                  placeholder="Re-enter your password"
                  className={inputClass("confirm") + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  aria-label={showConfirm ? "Hide" : "Show"}
                >
                  {form.confirm && form.confirm === form.password ? (
                    <Check size={16} className="text-green-500" />
                  ) : showConfirm ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.confirm && (
                <p className="mt-1.5 text-xs text-[var(--danger)]">
                  {errors.confirm}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 rounded-lg bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-[var(--text-secondary)]">
              Terms of Service
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
