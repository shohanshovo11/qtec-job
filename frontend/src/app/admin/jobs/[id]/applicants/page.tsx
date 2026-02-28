"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Trash2,
  ExternalLink,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  adminGetApplications,
  adminDeleteApplication,
  fetchJobById,
  getApiErrorMessage,
  type ApiApplication,
  type ApiJob,
} from "@/lib/api";
import { toast } from "sonner";

const PAGE_SIZE = 15;

export default function JobApplicantsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<ApiJob | null>(null);
  const [applications, setApplications] = useState<ApiApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [jobLoading, setJobLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [viewApp, setViewApp] = useState<ApiApplication | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // Load job info
  useEffect(() => {
    async function loadJob() {
      try {
        const j = await fetchJobById(jobId);
        if (!j) {
          toast.error("Job not found.");
          router.push("/admin/jobs");
          return;
        }
        setJob(j);
      } catch {
        toast.error("Failed to load job.");
        router.push("/admin/jobs");
      } finally {
        setJobLoading(false);
      }
    }
    loadJob();
  }, [jobId, router]);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        jobId,
        page: String(page),
        limit: String(PAGE_SIZE),
      };
      if (debouncedSearch) params.search = debouncedSearch;

      const res = await adminGetApplications(params);
      setApplications(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [jobId, page, debouncedSearch]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminDeleteApplication(deleteId);
      toast.success("Application removed.");
      loadApplications();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft size={13} />
            Back to All Jobs
          </Link>
          {jobLoading ? (
            <div className="h-7 w-48 bg-muted animate-pulse" />
          ) : (
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {job?.title}
            </h1>
          )}
          <div className="flex items-center gap-2 mt-1">
            {job && (
              <span className="text-sm text-muted-foreground">
                {job.company}
              </span>
            )}
            {job && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {job.type}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/20 px-4 py-2.5">
          <Users size={16} className="text-primary" />
          <div>
            <p className="text-xs text-muted-foreground leading-none">
              Total Applicants
            </p>
            <p className="text-xl font-bold text-foreground leading-tight">
              {total}
            </p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearch("")}
            className="h-9 text-xs gap-1.5 text-muted-foreground"
          >
            <X size={13} /> Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 pl-5">
                Applicant
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden md:table-cell">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden lg:table-cell">
                Applied
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden sm:table-cell">
                Resume
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="py-3 pl-5">
                    <div className="h-4 bg-muted animate-pulse w-3/4" />
                  </TableCell>
                </TableRow>
              ))
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-14 text-sm text-muted-foreground"
                >
                  {debouncedSearch
                    ? "No applicants match your search."
                    : "No applications yet for this job."}
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app._id} className="hover:bg-muted/40">
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-primary/10 flex items-center justify-center shrink-0 text-primary text-xs font-semibold">
                        {app.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {app.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-3.5 hidden md:table-cell">
                    <a
                      href={`mailto:${app.email}`}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 w-fit"
                    >
                      <Mail size={11} />
                      {app.email}
                    </a>
                  </TableCell>
                  <TableCell className="py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(app.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3.5 hidden sm:table-cell">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 w-fit"
                    >
                      View Resume
                      <ExternalLink size={11} />
                    </a>
                  </TableCell>
                  <TableCell className="py-3.5 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-primary px-2"
                        onClick={() => setViewApp(app)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => setDeleteId(app._id)}
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
            {Math.min(page * PAGE_SIZE, total)} of {total} applicants
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

      {/* View applicant detail dialog */}
      <Dialog open={!!viewApp} onOpenChange={(o) => !o && setViewApp(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">
              Application — {viewApp?.name}
            </DialogTitle>
          </DialogHeader>
          {viewApp && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Full Name
                  </p>
                  <p className="font-medium">{viewApp.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <a
                    href={`mailto:${viewApp.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {viewApp.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">
                    Applied On
                  </p>
                  <p className="font-medium">{formatDate(viewApp.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Resume</p>
                  <a
                    href={viewApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    Open Resume <ExternalLink size={11} />
                  </a>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Cover Note
                </p>
                <p className="text-sm leading-relaxed text-foreground bg-muted/40 border border-border p-3 whitespace-pre-wrap">
                  {viewApp.coverNote}
                </p>
              </div>
              <div className="flex justify-between pt-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {
                    setDeleteId(viewApp._id);
                    setViewApp(null);
                  }}
                >
                  <Trash2 size={12} className="mr-1.5" />
                  Remove Application
                </Button>
                <a href={`mailto:${viewApp.email}`}>
                  <Button size="sm" className="text-xs h-8 !text-white">
                    <Mail size={12} className="mr-1.5" />
                    Email Applicant
                  </Button>
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this application?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the application and decrement the
              applicant count. This action cannot be undone.
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
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
