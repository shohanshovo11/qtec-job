"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function HeroSection() {
  const popularSearches = ["UI Designer", "UX Researcher", "Android", "Admin"];
  const [location, setLocation] = useState("Florence, Italy");
  const LOCATIONS = [
    "Florence, Italy",
    "New York, USA",
    "London, UK",
    "Berlin, Germany",
  ];

  return (
    <section className="w-full bg-[#F8F8FD] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 py-14 lg:py-0 lg:min-h-[calc(100vh-80px)]">
          {/* ── Left column ────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-6 lg:py-24 z-10">
            {/* Headline */}
            <div>
              <h1
                className="text-4xl md:text-5xl xl:text-[3.75rem] font-bold leading-tight text-[var(--text-primary)]"
                style={{
                  fontFamily:
                    "var(--font-sora), var(--font-epilogue), sans-serif",
                }}
              >
                Discover
                <br />
                more than
              </h1>

              {/* Highlighted line + underline vector */}
              <div className="relative inline-block mt-1">
                <h1
                  className="text-4xl md:text-5xl xl:text-[3.75rem] font-bold leading-tight text-[var(--action-primary)]"
                  style={{
                    fontFamily:
                      "var(--font-sora), var(--font-epilogue), sans-serif",
                  }}
                >
                  5000+ Jobs
                </h1>
                {/* Vector squiggle underline */}
                <div className="absolute -bottom-3 left-0 w-full">
                  <Image
                    src="/images/Vector.png"
                    alt="underline"
                    width={340}
                    height={14}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <p
              className="mt-6 max-w-md text-[var(--text-secondary)] text-base md:text-lg leading-relaxed"
              style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
            >
              Great platform for the job seeker that searching for new career
              heights and passionate about startups.
            </p>

            {/* Search + Popular tags white card */}
            <div
              className="mt-2 bg-white p-4 pb-5"
              style={{
                boxShadow:
                  "0px 2.71px 4.4px 0px #C0C0C007, 0px 6.86px 11.12px 0px #C0C0C00A, 0px 14px 22.68px 0px #C0C0C00C, 0px 28.84px 46.72px 0px #C0C0C00F, 0px 79px 128px 0px #C0C0C017",
              }}
            >
              {/* Search bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white overflow-hidden border border-[var(--border-subtle)]">
                {/* Job title input */}
                <div className="flex items-center gap-3 flex-1 px-4 py-3 sm:border-r border-[var(--border-subtle)]">
                  <svg
                    className="shrink-0 text-[var(--text-muted)]"
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M14 14L18 18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    className="w-full text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none bg-transparent"
                    style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                  />
                </div>

                {/* Divider for mobile */}
                <div className="sm:hidden h-px bg-[var(--border-subtle)] mx-4" />

                {/* Location select */}
                <div className="flex items-center gap-3 px-4 py-3 sm:min-w-[190px] sm:border-r border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <svg
                    className="shrink-0"
                    width="16"
                    height="18"
                    viewBox="0 0 16 20"
                    fill="none"
                  >
                    <path
                      d="M8 0C4.13 0 1 3.13 1 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 8 4.5a2.5 2.5 0 0 1 0 5z"
                      fill="currentColor"
                      opacity="0.5"
                    />
                  </svg>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger
                      className="w-full border-none shadow-none p-0 h-auto text-sm text-[var(--text-primary)] bg-transparent focus:ring-0"
                      style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search button */}
                <button
                  className="flex items-center justify-center gap-2 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white font-semibold text-sm px-7 py-5 transition-colors shrink-0"
                  style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                >
                  Search my job
                </button>
              </div>
            </div>
            {/* end white card */}

            {/* Popular tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-sm text-[var(--text-muted)]"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                Popular :
              </span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  className="text-sm text-[var(--text-secondary)] hover:text-[var(--action-primary)] transition-colors underline underline-offset-2"
                  style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ── Right column ───────────────────────────────── */}
          <div className="flex-1 relative w-full h-[420px] md:h-[520px] lg:h-auto lg:self-stretch lg:min-h-[calc(100vh-80px)] overflow-hidden">
            {/* Background pattern – fills the column */}
            <div className="absolute -top-20 -right-10 -left-10 bottom-0 pointer-events-none select-none">
              <Image
                src="/images/Pattern.png"
                alt=""
                fill
                className="object-cover opacity-70 scale-125"
                priority
              />
            </div>

            {/* Hero person image – sits above pattern */}
            <div className="absolute inset-0 z-10">
              <Image
                src="/images/design-b3dcb2a2-23f6-41f0-b740-595184e6d3e9%201.png"
                alt="Job seeker"
                fill
                className="object-contain object-bottom"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
              />
            </div>
          </div>
        </div>

        {/* ── Companies we helped grow ─────────────────────── */}
        <div className="border-t border-[var(--border-subtle)] py-10 flex flex-col gap-6">
          <p
            className="text-sm text-[var(--text-muted)]"
            style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
          >
            Companies we helped grow
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-x-8 gap-y-6 items-center">
            {[
              {
                src: "/images/companies/vodafone-2017-logo.png",
                alt: "Vodafone",
              },
              { src: "/images/companies/intel-3.png", alt: "Intel" },
              { src: "/images/companies/tesla-9 1.png", alt: "Tesla" },
              { src: "/images/companies/amd-logo-1.png", alt: "AMD" },
              { src: "/images/companies/talkit 1.png", alt: "Talkit" },
            ].map((company) => (
              <div
                key={company.alt}
                className="relative h-8 w-full grayscale opacity-50 hover:opacity-80 hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={company.src}
                  alt={company.alt}
                  fill
                  className="object-contain object-left"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
