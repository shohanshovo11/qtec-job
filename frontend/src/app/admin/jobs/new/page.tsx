"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import JobForm, {
  defaultJobFormValues,
  type JobFormValues,
} from "../../_components/JobForm";
import { adminCreateJob, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: JobFormValues) {
    setLoading(true);
    try {
      await adminCreateJob(values as unknown as Record<string, unknown>);
      toast.success("Job posted successfully!");
      router.push("/admin/jobs");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={13} />
          Back to Jobs
        </Link>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Post a New Job
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Fill in the details below to publish a new job listing.
        </p>
      </div>

      <JobForm
        initialValues={defaultJobFormValues}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Post Job"
      />
    </div>
  );
}
