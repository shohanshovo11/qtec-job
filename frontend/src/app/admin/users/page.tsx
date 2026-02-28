"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Loader2, ShieldCheck, User2 } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  adminGetUsers,
  adminUpdateUserRole,
  adminDeleteUser,
  getApiErrorMessage,
  type AdminUser,
} from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const PAGE_SIZE = 10;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminUsersPage() {
  const currentUser = useAuthStore((s) => s.user);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filtered, setFiltered] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetUsers({ limit: "200" });
      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      q
        ? users.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q),
          )
        : users,
    );
    setPage(1);
  }, [search, users]);

  async function handleRoleChange(userId: string, role: "admin" | "user") {
    setUpdatingRole(userId);
    try {
      await adminUpdateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role } : u)),
      );
      toast.success("Role updated.");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUpdatingRole(null);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminDeleteUser(deleteId);
      toast.success("User deleted.");
      setUsers((prev) => prev.filter((u) => u._id !== deleteId));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const isSelf = (id: string) => currentUser?._id === id;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Manage Users
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          className="pl-9 h-9 text-sm"
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 pl-5">
                User
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden sm:table-cell">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 hidden md:table-cell">
                Joined
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3">
                Role
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground py-3 text-right pr-5">
                Delete
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5} className="py-3 pl-5">
                    <div className="h-4 rounded bg-muted animate-pulse w-3/4" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-sm text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user) => (
                <TableRow key={user._id} className="hover:bg-muted/40">
                  {/* Name + avatar */}
                  <TableCell className="py-3.5 pl-5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 text-[10px] font-semibold">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                          {user.name}
                          {isSelf(user._id) && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 font-semibold"
                            >
                              You
                            </Badge>
                          )}
                        </p>
                        {/* Email below name on small screens */}
                        <p className="text-xs text-muted-foreground sm:hidden">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {/* Email */}
                  <TableCell className="py-3.5 hidden sm:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </TableCell>
                  {/* Joined */}
                  <TableCell className="py-3.5 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : "—"}
                    </span>
                  </TableCell>
                  {/* Role */}
                  <TableCell className="py-3.5">
                    {isSelf(user._id) ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 border-purple-200 gap-1"
                      >
                        <ShieldCheck size={10} />
                        Admin
                      </Badge>
                    ) : (
                      <div className="relative">
                        {updatingRole === user._id && (
                          <Loader2
                            size={12}
                            className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground z-10"
                          />
                        )}
                        <Select
                          value={user.role}
                          onValueChange={(val) =>
                            handleRoleChange(user._id, val as "admin" | "user")
                          }
                          disabled={!!updatingRole}
                        >
                          <SelectTrigger className="h-7 w-25 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user" className="text-xs">
                              <span className="flex items-center gap-1.5">
                                <User2 size={11} />
                                User
                              </span>
                            </SelectItem>
                            <SelectItem value="admin" className="text-xs">
                              <span className="flex items-center gap-1.5">
                                <ShieldCheck size={11} />
                                Admin
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </TableCell>
                  {/* Delete */}
                  <TableCell className="py-3.5 pr-5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isSelf(user._id)}
                      onClick={() => setDeleteId(user._id)}
                      className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                    >
                      Delete
                    </Button>
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
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-8 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the account and all associated data.
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
