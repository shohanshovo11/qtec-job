"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import JobForm, { type JobFormValues } from "../../../_components/JobForm";
import { fetchJobById, adminUpdateJob, getApiErrorMessage } from "@/lib/api";
import { toast } from "sonner";

function jobToFormValues(
  job: NonNullable<Awaited<ReturnType<typeof fetchJobById>>>,
): JobFormValues {
  return {
    title: job.title ?? "",
    company: job.company ?? "",
    salary: job.salary ?? "",
    logo: job.logo ?? "",
    location: job.location ?? "",
    type: job.type ?? "Full Time",
    category: job.category ?? "",
    postedAt: job.postedAt ? job.postedAt.slice(0, 10) : "",
    tags: job.tags ?? [],
    featured: job.featured ?? false,
    description: job.description ?? "",
    aboutCompany: job.aboutCompany ?? "",
    experience: job.experience ?? "",
    companySize: job.companySize ?? "",
    companyWebsite: job.companyWebsite ?? "",
    responsibilities: job.responsibilities ?? [],
    requirements: job.requirements ?? [],
    niceToHave: job.niceToHave ?? [],
    benefits: job.benefits ?? [],
  };
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [initialValues, setInitialValues] = useState<JobFormValues | null>(
    null,
  );
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const job = await fetchJobById(id);
        if (!job) {
          toast.error("Job not found.");
          router.push("/admin/jobs");
          return;
        }
        setInitialValues(jobToFormValues(job));
      } catch (err) {
        toast.error(getApiErrorMessage(err));
        router.push("/admin/jobs");
      } finally {
        setFetching(false);
      }
    }
    load();
  }, [id, router]);

  async function handleSubmit(values: JobFormValues) {
    setSubmitting(true);
    try {
      await adminUpdateJob(id, values as unknown as Record<string, unknown>);
      toast.success("Job updated successfully!");
      router.push("/admin/jobs");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!initialValues) return null;

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
          Edit Job
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update the details for this job listing.
        </p>
      </div>

      <JobForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        loading={submitting}
        submitLabel="Save Changes"
      />
    </div>
  );
}
