"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Pencil,
  Trash2,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminGetJobs,
  adminDeleteJob,
  getApiErrorMessage,
  type ApiJob,
} from "@/lib/api";
import { toast } from "sonner";

const TYPE_COLORS: Record<string, string> = {
  "Full Time": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Part Time": "bg-blue-50 text-blue-700 border-blue-200",
  Remote: "bg-purple-50 text-purple-700 border-purple-200",
  Contract: "bg-amber-50 text-amber-700 border-amber-200",
  Internship: "bg-pink-50 text-pink-700 border-pink-200",
};

const JOB_TYPES = [
  "Full Time",
  "Part Time",
  "Remote",
  "Contract",
  "Internship",
] as const;

const CATEGORIES = [
  "Design",
  "Engineering",
  "Marketing",
  "Finance",
  "Technology",
  "Sales",
  "Business",
  "Human Resource",
] as const;

const PAGE_SIZE = 10;

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleSearchChange(val: string) {
    setSearch(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  }

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (typeFilter) params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (featuredFilter) params.featured = featuredFilter;
      if (sortBy) params.sortBy = sortBy;

      const res = await adminGetJobs(params);
      setJobs(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [
    page,
    debouncedSearch,
    typeFilter,
    categoryFilter,
    featuredFilter,
    sortBy,
  ]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const hasFilters =
    debouncedSearch || typeFilter || categoryFilter || featuredFilter || sortBy;

  function resetFilters() {
    setSearch("");
    setDebouncedSearch("");
    setTypeFilter("");
    setCategoryFilter("");
    setFeaturedFilter("");
    setSortBy("");
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminDeleteJob(deleteId);
      toast.success("Job deleted successfully.");
      loadJobs();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            All Jobs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} listing{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild size="sm" className="!text-white">
          <Link
            href="/admin/jobs/new"
            className="flex items-center gap-2 !text-white"
          >
            <PlusCircle size={15} />
            Post Job
          </Link>
        </Button>
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* Type */}
        <Select
          value={typeFilter || "all"}
          onValueChange={(v) => {
            setTypeFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-9 text-sm w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {JOB_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category */}
        <Select
          value={categoryFilter || "all"}
          onValueChange={(v) => {
            setCategoryFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-9 text-sm w-[150px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Featured */}
        <Select
          value={featuredFilter || "all"}
          onValueChange={(v) => {
            setFeaturedFilter(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-9 text-sm w-[140px]">
            <SelectValue placeholder="All Jobs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            <SelectItem value="true">Featured Only</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortBy || "newest"}
          onValueChange={(v) => {
            setSortBy(v === "newest" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-9 text-sm w-[140px]">
            <SelectValue placeholder="Sort: Newest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Sort: Newest</SelectItem>
            <SelectItem value="salary">Sort: Salary</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 pl-5">
                Job
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden md:table-cell">
                Category
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden sm:table-cell">
                Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden lg:table-cell">
                Location
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden lg:table-cell">
                Applicants
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(PAGE_SIZE)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="py-3 pl-5">
                    <div className="h-4 bg-muted animate-pulse w-3/4" />
                  </TableCell>
                </TableRow>
              ))
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-sm text-muted-foreground"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job._id} className="hover:bg-muted/40">
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-1">
                      <div>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                          {job.title}
                          {job.featured && (
                            <Star
                              size={11}
                              className="text-amber-400 fill-amber-400 shrink-0"
                            />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {job.category}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 hidden sm:table-cell">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium px-2 py-0.5 ${TYPE_COLORS[job.type] ?? ""}`}
                    >
                      {job.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {job.location}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {job.applicants ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/jobs/${job._id}/applicants`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Applicants"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Users size={13} />
                        </Button>
                      </Link>
                      <Link href={`/admin/jobs/${job._id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Pencil size={13} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(job._id)}
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground text-xs">
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} of {total} jobs
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 text-xs gap-1"
            >
              <ChevronLeft size={13} /> Previous
            </Button>
            <span className="text-xs text-muted-foreground px-1">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 text-xs gap-1"
            >
              Next <ChevronRight size={13} />
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the listing and all its applications.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting && (
                <Loader2 size={13} className="mr-1.5 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
