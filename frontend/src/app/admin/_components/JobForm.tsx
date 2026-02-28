"use client";

import { useState } from "react";
import {
  Plus,
  X,
  Loader2,
  Info,
  AlignLeft,
  ListChecks,
  Tag,
  Building2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Constants (match backend schema) ─────────────────────────────────────────
const LOCATIONS = [
  "Remote",
  "New York, US",
  "San Francisco, US",
  "London, UK",
  "Berlin, Germany",
  "Madrid, Spain",
  "Toronto, Canada",
  "Sydney, Australia",
  "Singapore",
] as const;

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

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface JobFormValues {
  title: string;
  company: string;
  logo: string;
  location: string;
  type: string;
  category: string;
  salary: string;
  description: string;
  tags: string[];
  featured: boolean;
  postedAt: string;
  aboutCompany: string;
  experience: string;
  companySize: string;
  companyWebsite: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
}

export const defaultJobFormValues: JobFormValues = {
  title: "",
  company: "",
  logo: "",
  location: "Remote",
  type: "Full Time",
  category: "Engineering",
  salary: "",
  description: "",
  tags: [],
  featured: false,
  postedAt: "",
  aboutCompany: "",
  experience: "",
  companySize: "",
  companyWebsite: "",
  responsibilities: [],
  requirements: [],
  niceToHave: [],
  benefits: [],
};

interface Props {
  initialValues?: Partial<JobFormValues>;
  onSubmit: (values: JobFormValues) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

// ─── Array field helper ─────────────────────────────────────────────────────────

function ArrayField({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  function addItem() {
    const trimmed = input.trim();
    if (!trimmed || items.includes(trimmed)) return;
    onChange([...items, trimmed]);
    setInput("");
  }

  function removeItem(idx: number) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold text-foreground">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder ?? `Add ${label.toLowerCase()}…`}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={addItem}
          className="shrink-0"
        >
          <Plus size={15} />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 px-3 py-2.5 bg-muted/50 border border-border"
            >
              <span className="text-sm text-foreground flex-1 leading-snug">
                {item}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0 hover:bg-destructive/10 p-0.5"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function JobForm({
  initialValues = {},
  onSubmit,
  loading = false,
  submitLabel = "Save Job",
}: Props) {
  const [values, setValues] = useState<JobFormValues>({
    ...defaultJobFormValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof JobFormValues, string>>
  >({});
  const [tagInput, setTagInput] = useState("");

  function set<K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t || values.tags.includes(t)) return;
    set("tags", [...values.tags, t]);
    setTagInput("");
  }

  function validate(): boolean {
    const e: Partial<Record<keyof JobFormValues, string>> = {};
    if (!values.title.trim()) e.title = "Title is required";
    if (!values.company.trim()) e.company = "Company is required";
    if (!values.salary.trim()) e.salary = "Salary is required";
    if (!values.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  }

  const inputClass = (field: keyof JobFormValues) =>
    errors[field] ? "border-destructive focus-visible:ring-destructive/30" : "";

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-3 h-11">
          <TabsTrigger
            value="basic"
            className="flex items-center gap-2 text-sm"
          >
            <Info size={14} />
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="flex items-center gap-2 text-sm"
          >
            <AlignLeft size={14} />
            Description
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex items-center gap-2 text-sm"
          >
            <ListChecks size={14} />
            Details
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Basic Info ── */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={15} className="text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Job & Company
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Job Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={values.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Senior Product Designer"
                    className={inputClass("title")}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">{errors.title}</p>
                  )}
                </div>
                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company">
                    Company <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                    placeholder="e.g. Stripe"
                    className={inputClass("company")}
                  />
                  {errors.company && (
                    <p className="text-xs text-destructive">{errors.company}</p>
                  )}
                </div>
                {/* Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary">
                    Salary <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="salary"
                    value={values.salary}
                    onChange={(e) => set("salary", e.target.value)}
                    placeholder="e.g. $90k – $120k"
                    className={inputClass("salary")}
                  />
                  {errors.salary && (
                    <p className="text-xs text-destructive">{errors.salary}</p>
                  )}
                </div>
                {/* Logo */}
                <div className="space-y-2">
                  <Label htmlFor="logo">Company Logo URL</Label>
                  <Input
                    id="logo"
                    value={values.logo}
                    onChange={(e) => set("logo", e.target.value)}
                    placeholder="/icons/FeaturedJobs/logo.svg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <Tag size={15} className="text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Classification
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Location */}
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={values.location}
                    onValueChange={(v) => set("location", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Type */}
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select
                    value={values.type}
                    onValueChange={(v) => set("type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={values.category}
                    onValueChange={(v) => set("category", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Posted At */}
                <div className="space-y-2">
                  <Label htmlFor="postedAt">Posted Label</Label>
                  <Input
                    id="postedAt"
                    value={values.postedAt}
                    onChange={(e) => set("postedAt", e.target.value)}
                    placeholder="e.g. 2 days ago"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Type a tag and press Enter…"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addTag}
                  >
                    <Plus size={15} />
                  </Button>
                </div>
                {values.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {values.tags.map((tag, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="flex items-center gap-1.5 px-2.5 py-1 text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            set(
                              "tags",
                              values.tags.filter((_, j) => j !== i),
                            )
                          }
                          className="text-muted-foreground hover:text-foreground ml-0.5"
                        >
                          <X size={10} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Featured toggle */}
              <label
                htmlFor="featured"
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative flex items-center">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={values.featured}
                    onChange={(e) => set("featured", e.target.checked)}
                    className="peer w-4 h-4 border-border accent-primary cursor-pointer"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Mark as Featured
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Featured jobs appear prominently on the homepage
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Description ── */}
        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="description">
                  Job Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={values.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the role, expectations, and impact…"
                  rows={6}
                  className={`resize-none ${errors.description ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="aboutCompany">About the Company</Label>
                <Textarea
                  id="aboutCompany"
                  value={values.aboutCompany}
                  onChange={(e) => set("aboutCompany", e.target.value)}
                  placeholder="Brief company overview…"
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-5">
                <Building2 size={15} className="text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Company Details
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Required</Label>
                  <Input
                    id="experience"
                    value={values.experience}
                    onChange={(e) => set("experience", e.target.value)}
                    placeholder="e.g. 4+ years"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <Input
                    id="companySize"
                    value={values.companySize}
                    onChange={(e) => set("companySize", e.target.value)}
                    placeholder="e.g. 1,000 – 5,000"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input
                    id="companyWebsite"
                    value={values.companyWebsite}
                    onChange={(e) => set("companyWebsite", e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 3: Details ── */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <ArrayField
                label="Responsibilities"
                items={values.responsibilities}
                onChange={(v) => set("responsibilities", v)}
                placeholder="Add a responsibility…"
              />
              <Separator />
              <ArrayField
                label="Requirements"
                items={values.requirements}
                onChange={(v) => set("requirements", v)}
                placeholder="Add a requirement…"
              />
              <Separator />
              <ArrayField
                label="Nice to Have"
                items={values.niceToHave}
                onChange={(v) => set("niceToHave", v)}
                placeholder="Add a nice-to-have…"
              />
              <Separator />
              <ArrayField
                label="Benefits"
                items={values.benefits}
                onChange={(v) => set("benefits", v)}
                placeholder="Add a benefit…"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit */}
      <div className="flex justify-end pt-6 mt-2 border-t border-border">
        <Button type="submit" disabled={loading} className="min-w-35">
          {loading && <Loader2 size={14} className="mr-2 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
