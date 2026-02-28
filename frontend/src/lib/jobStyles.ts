/** Shared style maps used by job cards, list items, and section components */

export const TYPE_STYLES: Record<string, string> = {
  "Full Time": "bg-[#E8F5F0] text-[#14A077]",
  "Part Time": "bg-[#FFF6E6] text-[#E88A00]",
  Remote: "bg-[#EEF0FF] text-[#4640DE]",
  Contract: "bg-[#FFE9E9] text-[#E05151]",
  Internship: "bg-[#F2ECFF] text-[#7B2FBE]",
};

export const TAG_STYLES: Record<string, string> = {
  Design: "bg-[#E8F5F0] text-[#14A077]",
  Marketing: "bg-[#FFF6E6] text-[#E88A00]",
  Business: "bg-[#EEF0FF] text-[#4640DE]",
  Technology: "bg-[#FFE9E9] text-[#E05151]",
  Engineering: "bg-[#E8F0FF] text-[#2563EB]",
  Finance: "bg-[#FEF9C3] text-[#A16207]",
  Sales: "bg-[#FCE7F3] text-[#BE185D]",
  "Human Resource": "bg-[#F2ECFF] text-[#7B2FBE]",
};

export function getTagStyle(tag: string): string {
  for (const [key, val] of Object.entries(TAG_STYLES)) {
    if (tag.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return "bg-[var(--color-brand-100)] text-[var(--action-primary)]";
}
