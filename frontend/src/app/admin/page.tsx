"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  FileText,
  Star,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  LayoutDashboard,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { adminGetStats, getApiErrorMessage, type AdminStats } from "@/lib/api";
import { toast } from "sonner";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  description?: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  description,
}: StatCardProps) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {label}
            </p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={`flex items-center justify-center w-12 h-12 ${bgClass} shrink-0`}
          >
            <Icon size={22} className={colorClass} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonStatCard() {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="h-3 w-20 bg-muted animate-pulse" />
            <div className="h-8 w-16 bg-muted animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-muted animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .catch((err) => toast.error(getApiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: "Total Jobs",
      value: stats?.totalJobs ?? "—",
      icon: Briefcase,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      description: "Active job listings",
    },
    {
      label: "Total Users",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      description: "Registered accounts",
    },
    {
      label: "Applications",
      value: stats?.totalApplications ?? "—",
      icon: FileText,
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50",
      description: "All time submissions",
    },
    {
      label: "Featured Jobs",
      value: stats?.featuredJobs ?? "—",
      icon: Star,
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50",
      description: "Highlighted listings",
    },
  ];

  const quickActions = [
    {
      href: "/admin/jobs/new",
      title: "Post a New Job",
      desc: "Create a new job listing and publish it live.",
      icon: PlusCircle,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      badge: "New",
    },
    {
      href: "/admin/jobs",
      title: "Manage Jobs",
      desc: "Edit, feature, or remove existing listings.",
      icon: Briefcase,
      colorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
      badge: null,
    },
    {
      href: "/admin/users",
      title: "Manage Users",
      desc: "View accounts, change roles, or remove users.",
      icon: Users,
      colorClass: "text-amber-600",
      bgClass: "bg-amber-50",
      badge: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back — here&apos;s what&apos;s happening today.
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

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="h-10 mb-6">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-1.5 text-sm"
          >
            <LayoutDashboard size={14} />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="actions"
            className="flex items-center gap-1.5 text-sm"
          >
            <Zap size={14} />
            Quick Actions
          </TabsTrigger>
        </TabsList>

        {/* ── Overview Tab ── */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? [...Array(4)].map((_, i) => <SkeletonStatCard key={i} />)
              : cards.map((c) => <StatCard key={c.label} {...c} />)}
          </div>

          {/* Platform overview card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp size={16} className="text-primary" />
                Platform Overview
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Use the sidebar to navigate between features. Post new jobs from{" "}
                <span className="font-semibold text-foreground">Post Job</span>,
                manage existing listings under{" "}
                <span className="font-semibold text-foreground">All Jobs</span>,
                and control user access from{" "}
                <span className="font-semibold text-foreground">Users</span>.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { label: "Jobs", href: "/admin/jobs" },
                  { label: "Users", href: "/admin/users" },
                  { label: "Post Job", href: "/admin/jobs/new" },
                ].map(({ label, href }) => (
                  <Button key={href} variant="outline" size="sm" asChild>
                    <Link href={href} className="flex items-center gap-1.5">
                      {label}
                      <ArrowRight size={12} />
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Quick Actions Tab ── */}
        <TabsContent value="actions" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Jump directly to key sections of the admin panel.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map(
              ({
                href,
                title,
                desc,
                icon: Icon,
                colorClass,
                bgClass,
                badge,
              }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col gap-4 p-5 bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex items-center justify-center w-11 h-11 ${bgClass}`}
                    >
                      <Icon size={20} className={colorClass} />
                    </div>
                    {badge && (
                      <Badge variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {desc}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Go{" "}
                    <ArrowRight
                      size={12}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </Link>
              ),
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
