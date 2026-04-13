import { readdir } from "fs/promises";
import path from "path";
import type { CmsPartner } from "@/lib/cms/types";

const TRUSTED_LOGOS_DIR = path.join(process.cwd(), "public", "TrustedLogos");
const TRUSTED_LOGOS_PREFIX = "/TrustedLogos/";
const COPY_SUFFIX_REGEX = /\s\(\d+\)(?=\.[^.]+$)/;
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"]);

const normalizeString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const decodeSafe = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const sanitizeLogoPath = (value: string): string => {
  const trimmed = value.trim().replace(/\\/g, "/");
  if (!trimmed) return "";
  if (/^(https?:\/\/|data:)/i.test(trimmed)) return trimmed;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const normalizeLogoKey = (value: string): string => {
  const sanitized = sanitizeLogoPath(value);
  if (!sanitized) return "";

  if (/^(https?:\/\/|data:)/i.test(sanitized)) {
    return sanitized.toLowerCase();
  }

  const withoutQuery = sanitized.split(/[?#]/)[0] || sanitized;
  const decoded = decodeSafe(withoutQuery);
  const canonicalCopies = decoded.replace(COPY_SUFFIX_REGEX, "");
  return canonicalCopies.toLowerCase();
};

const removeExt = (name: string): string => name.replace(/\.[^.]+$/, "");

const toPartnerName = (fileName: string): string => {
  const base = removeExt(fileName).replace(COPY_SUFFIX_REGEX, "");
  const cleaned = base
    .replace(/-removebg-preview/gi, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || base || "Partner";
};

const toTrustedPartnerId = (fileName: string, index: number): string => {
  const base = removeExt(fileName)
    .toLowerCase()
    .replace(COPY_SUFFIX_REGEX, "")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `trusted-${base || `logo-${index + 1}`}`;
};

const normalizeExistingPartners = (input: unknown): CmsPartner[] => {
  if (!Array.isArray(input)) return [];

  const seenLogoKeys = new Set<string>();
  const rows: CmsPartner[] = [];

  for (let i = 0; i < input.length; i += 1) {
    const row = input[i];
    if (!row || typeof row !== "object") continue;

    const raw = row as Partial<CmsPartner>;
    const logo = sanitizeLogoPath(normalizeString(raw.logo));
    if (!logo) continue;

    const logoKey = normalizeLogoKey(logo);
    if (!logoKey || seenLogoKeys.has(logoKey)) continue;
    seenLogoKeys.add(logoKey);

    const id = normalizeString(raw.id) || `p${i + 1}`;
    const name = normalizeString(raw.name) || toPartnerName(path.basename(logo));
    rows.push({
      id,
      name,
      logo,
      active: raw.active !== false,
    });
  }

  return rows;
};

export async function readTrustedLogoPartners(): Promise<CmsPartner[]> {
  try {
    const dirEntries = await readdir(TRUSTED_LOGOS_DIR, { withFileTypes: true, encoding: "utf8" });
    const canonicalByName = new Map<string, string>();

    for (const entry of dirEntries) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;

      const canonicalName = entry.name.replace(COPY_SUFFIX_REGEX, "");
      const canonicalKey = canonicalName.toLowerCase();
      const existing = canonicalByName.get(canonicalKey);

      if (!existing) {
        canonicalByName.set(canonicalKey, entry.name);
        continue;
      }

      const existingIsCopy = COPY_SUFFIX_REGEX.test(existing);
      const currentIsOriginal = !COPY_SUFFIX_REGEX.test(entry.name);
      if (existingIsCopy && currentIsOriginal) {
        canonicalByName.set(canonicalKey, entry.name);
      }
    }

    const chosenNames = [...canonicalByName.values()].sort((a, b) => a.localeCompare(b, "ar"));
    return chosenNames.map((fileName, index) => ({
      id: toTrustedPartnerId(fileName, index),
      name: toPartnerName(fileName),
      logo: `${TRUSTED_LOGOS_PREFIX}${fileName}`,
      active: true,
    }));
  } catch {
    return [];
  }
}

export async function mergePartnersWithTrustedLogos(input: unknown): Promise<CmsPartner[]> {
  const existing = normalizeExistingPartners(input);
  const trusted = await readTrustedLogoPartners();
  const existingByLogo = new Map(existing.map((partner) => [normalizeLogoKey(partner.logo), partner]));
  const consumedKeys = new Set<string>();
  const merged: CmsPartner[] = [];

  for (const trustedPartner of trusted) {
    const key = normalizeLogoKey(trustedPartner.logo);
    const existingMatch = existingByLogo.get(key);
    if (existingMatch) {
      merged.push(existingMatch);
      consumedKeys.add(key);
    } else {
      merged.push(trustedPartner);
    }
  }

  for (const partner of existing) {
    const key = normalizeLogoKey(partner.logo);
    if (consumedKeys.has(key)) continue;
    merged.push(partner);
  }

  return merged;
}
