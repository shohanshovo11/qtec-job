"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "./JobCard";
import { JOB_CATEGORIES, JOB_LOCATIONS, JOB_TYPES } from "./data";
import { apiClient, type ApiJob } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JOBS_PER_PAGE = 9;

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0"
    >
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M14 14L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="none"
      className="shrink-0 text-[var(--text-muted)]"
    >
      <path
        d="M10 11a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 2C6.686 2 4 4.686 4 8c0 5 6 10 6 10s6-5 6-10c0-3.314-2.686-6-6-6z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path
        d="M2 5h16M5 10h10M8 15h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 5l10 10M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string;
  onChange: (v: string) => void;
}

function FilterSection({
  title,
  options,
  selected,
  onChange,
}: FilterSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4
        className="text-sm font-semibold text-[var(--text-primary)]"
        style={{
          fontFamily: "var(--font-sora), var(--font-epilogue), sans-serif",
        }}
      >
        {title}
      </h4>
      <div className="flex flex-col gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`text-left text-sm px-3 py-2 transition-all duration-150 ${
              selected === option
                ? "bg-[var(--color-brand-100)] text-[var(--action-primary)] font-semibold"
                : "text-[var(--text-secondary)] hover:bg-[var(--color-neutral-100)] hover:text-[var(--text-primary)]"
            }`}
          >
            {option === "All" ? `All ${title}s` : option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "salary">("newest");

  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch jobs from backend whenever filters/page/sort change
  useEffect(() => {
    const controller = new AbortController();
    const fetchJobs = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(JOBS_PER_PAGE),
        sortBy,
      });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (categoryFilter !== "All") params.append("category", categoryFilter);
      if (typeFilter !== "All") params.append("type", typeFilter);
      if (locationFilter !== "All") params.append("location", locationFilter);
      try {
        const { data } = await apiClient.get("/api/jobs", {
          params: Object.fromEntries(params),
          signal: controller.signal,
        });
        if (data.success) {
          setJobs(data.data);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } catch (err: unknown) {
        // ignore cancellation errors from AbortController
        if ((err as { code?: string })?.code !== "ERR_CANCELED") {
          console.error("Failed to fetch jobs:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
    return () => controller.abort();
  }, [
    debouncedSearch,
    locationFilter,
    categoryFilter,
    typeFilter,
    currentPage,
    sortBy,
  ]);

  const activeFilterCount = [
    locationFilter !== "All",
    categoryFilter !== "All",
    typeFilter !== "All",
  ].filter(Boolean).length;

  function clearAllFilters() {
    setSearchQuery("");
    setDebouncedSearch("");
    setLocationFilter("All");
    setCategoryFilter("All");
    setTypeFilter("All");
    setCurrentPage(1);
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handleLocationChange = (val: string) => {
    setLocationFilter(val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#F8F8FD]">
      <Navbar />

      {/* ── Page Hero ── */}
      <section className="w-full bg-white border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
            <a
              href="/"
              className="hover:text-[var(--action-primary)] transition-colors"
            >
              Home
            </a>
            <span>/</span>
            <span className="text-[var(--text-primary)] font-medium">
              Find Jobs
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8">
            <div className="flex-1">
              <h1
                className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3"
                style={{
                  fontFamily:
                    "var(--font-sora), var(--font-epilogue), sans-serif",
                }}
              >
                Find your{" "}
                <span className="text-[var(--action-primary)]">dream job</span>
              </h1>
              <p
                className="text-[var(--text-secondary)] text-base max-w-lg"
                style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
              >
                {total > 0 ? `${total}+` : "Loading"} jobs from the world&apos;s
                leading companies. Search, filter, and find the perfect role for
                you.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 shrink-0">
              {[
                { label: "Live Jobs", value: total > 0 ? `${total}+` : "…" },
                { label: "Companies", value: "50+" },
                { label: "Categories", value: `${JOB_CATEGORIES.length - 1}` },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p
                    className="text-2xl font-bold text-[var(--action-primary)]"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-8 bg-white border border-[var(--border-subtle)] shadow-sm">
            <div className="flex flex-col sm:flex-row">
              {/* Keyword input */}
              <div className="flex items-center gap-3 flex-1 px-4 py-3.5 sm:border-r border-[var(--border-subtle)] text-[var(--text-muted)]">
                <SearchIcon />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Job title, keyword, or company"
                  className="w-full text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none bg-transparent"
                  style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <XIcon />
                  </button>
                )}
              </div>

              {/* Location select */}
              <div className="flex items-center gap-3 px-4 py-3.5 sm:min-w-[220px] sm:border-r border-[var(--border-subtle)]">
                <LocationIcon />
                <Select
                  value={locationFilter}
                  onValueChange={handleLocationChange}
                >
                  <SelectTrigger
                    className="w-full border-none shadow-none p-0 h-auto text-sm text-[var(--text-primary)] bg-transparent focus:ring-0"
                    style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                  >
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc === "All" ? "All Locations" : loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search button */}
              <button
                onClick={() => setCurrentPage(1)}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] text-white text-sm font-semibold transition-colors shrink-0"
              >
                <SearchIcon />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {(categoryFilter !== "All" ||
            typeFilter !== "All" ||
            locationFilter !== "All") && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[var(--text-muted)]">
                Active filters:
              </span>
              {categoryFilter !== "All" && (
                <button
                  onClick={() => handleCategoryChange("All")}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-[var(--color-brand-100)] text-[var(--action-primary)] font-medium"
                >
                  {categoryFilter} <XIcon />
                </button>
              )}
              {typeFilter !== "All" && (
                <button
                  onClick={() => handleTypeChange("All")}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-[var(--color-brand-100)] text-[var(--action-primary)] font-medium"
                >
                  {typeFilter} <XIcon />
                </button>
              )}
              {locationFilter !== "All" && (
                <button
                  onClick={() => handleLocationChange("All")}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 bg-[var(--color-brand-100)] text-[var(--action-primary)] font-medium"
                >
                  {locationFilter} <XIcon />
                </button>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex gap-8 items-start">
          {/* ── Sidebar ── */}
          <aside
            className={`
              fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity duration-200
              ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className={`absolute left-0 top-0 h-full w-72 bg-white overflow-y-auto transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h3
                    className="font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-sora), sans-serif" }}
                  >
                    Filters
                  </h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <XIcon />
                  </button>
                </div>
                <FilterSection
                  title="Category"
                  options={JOB_CATEGORIES}
                  selected={categoryFilter}
                  onChange={(v) => {
                    handleCategoryChange(v);
                  }}
                />
                <FilterSection
                  title="Job Type"
                  options={JOB_TYPES}
                  selected={typeFilter}
                  onChange={(v) => {
                    handleTypeChange(v);
                  }}
                />
                <FilterSection
                  title="Location"
                  options={JOB_LOCATIONS}
                  selected={locationFilter}
                  onChange={(v) => {
                    handleLocationChange(v);
                  }}
                />
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setSidebarOpen(false);
                    }}
                    className="w-full text-sm text-[var(--danger)] border border-[var(--danger)] py-2 hover:bg-red-50 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Desktop sidebar */}
          <aside className="hidden lg:flex flex-col gap-7 w-60 xl:w-64 shrink-0 sticky top-[6rem] bg-white border border-[var(--border-subtle)] p-6">
            <div className="flex items-center justify-between">
              <h3
                className="font-bold text-[var(--text-primary)] text-sm"
                style={{ fontFamily: "var(--font-sora), sans-serif" }}
              >
                Filter Jobs
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[var(--danger)] hover:underline"
                >
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            <div className="h-px bg-[var(--border-subtle)]" />

            <FilterSection
              title="Category"
              options={JOB_CATEGORIES}
              selected={categoryFilter}
              onChange={handleCategoryChange}
            />

            <div className="h-px bg-[var(--border-subtle)]" />

            <FilterSection
              title="Job Type"
              options={JOB_TYPES}
              selected={typeFilter}
              onChange={handleTypeChange}
            />

            <div className="h-px bg-[var(--border-subtle)]" />

            <FilterSection
              title="Location"
              options={JOB_LOCATIONS}
              selected={locationFilter}
              onChange={handleLocationChange}
            />
          </aside>

          {/* ── Job listings ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p
                  className="text-[var(--text-primary)] font-semibold text-lg"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  {loading
                    ? "Searching…"
                    : `${total} job${total !== 1 ? "s" : ""} found`}
                </p>
                {searchQuery && (
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Results for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] border border-[var(--border-subtle)] px-4 py-2 hover:border-[var(--action-primary)] hover:text-[var(--action-primary)] transition-colors bg-white"
                >
                  <FilterIcon />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center bg-[var(--action-primary)] text-white text-xs font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}
                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] border border-[var(--border-subtle)] px-3 py-2 bg-white">
                  <span className="hidden sm:inline text-[var(--text-secondary)]">
                    Sort by:
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(v) => setSortBy(v as "newest" | "salary")}
                  >
                    <SelectTrigger
                      className="border-none shadow-none p-0 h-auto w-auto text-sm font-medium text-[var(--text-primary)] bg-transparent focus:ring-0 gap-1"
                      style={{ fontFamily: "var(--font-epilogue), sans-serif" }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Job grid */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-[var(--action-primary)] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-[var(--text-muted)]">
                    Loading jobs…
                  </p>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-24 text-center bg-white border border-[var(--border-subtle)]">
                <div className="w-16 h-16 bg-[var(--color-brand-100)] flex items-center justify-center mb-4">
                  <SearchIcon />
                </div>
                <h3
                  className="text-lg font-semibold text-[var(--text-primary)] mb-2"
                  style={{ fontFamily: "var(--font-sora), sans-serif" }}
                >
                  No jobs found
                </h3>
                <p className="text-sm text-[var(--text-muted)] max-w-xs mb-5">
                  No jobs match your current filters. Try adjusting your search
                  or clearing filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="text-sm font-semibold px-5 py-2.5 bg-[var(--action-primary)] text-white hover:bg-[var(--action-primary-hover)] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
                <p className="text-sm text-[var(--text-muted)]">
                  Showing{" "}
                  <span className="font-medium text-[var(--text-primary)]">
                    {(currentPage - 1) * JOBS_PER_PAGE + 1}–
                    {Math.min(currentPage * JOBS_PER_PAGE, total)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[var(--text-primary)]">
                    {total}
                  </span>{" "}
                  jobs
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-[var(--border-subtle)] text-[var(--text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--action-primary)] hover:text-[var(--action-primary)] transition-colors bg-white"
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 text-sm font-medium border transition-colors ${
                          page === currentPage
                            ? "bg-[var(--action-primary)] text-white border-[var(--action-primary)]"
                            : "bg-white text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--action-primary)] hover:text-[var(--action-primary)]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-[var(--border-subtle)] text-[var(--text-secondary)] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[var(--action-primary)] hover:text-[var(--action-primary)] transition-colors bg-white"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
