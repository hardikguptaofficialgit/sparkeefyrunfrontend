/** Curated real portrait photos for demo people (Unsplash, face-cropped). */
const DEMO_PORTRAITS: Record<string, string> = {
  Ananya:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80&crop=faces",
  Priya:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80&crop=faces",
  Marcus:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80&crop=faces",
  Jordan:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80&crop=faces",
};

/** Pool of real portrait indices - randomuser.me stock photography. */
const WOMEN_PORTRAITS = [1, 4, 5, 9, 10, 11, 15, 16, 17, 20, 21, 23, 24, 25, 26, 28, 29, 32, 44, 47, 48, 50, 52, 53, 54, 55, 56, 57, 58, 62, 65, 67, 68, 69, 70, 71, 72, 73, 74, 75];
const MEN_PORTRAITS = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];

function hashSeed(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function inferSex(displayName: string, personId: string): "women" | "men" {
  const name = displayName.trim().toLowerCase();
  const femaleNames = ["ananya", "priya", "sarah", "emma", "mia", "sophia", "olivia", "ava", "isabella"];
  const maleNames = ["marcus", "james", "john", "michael", "david", "daniel", "alex", "ryan", "noah"];

  if (femaleNames.some((n) => name.startsWith(n) || name.includes(n))) return "women";
  if (maleNames.some((n) => name.startsWith(n) || name.includes(n))) return "men";
  return hashSeed(personId) % 2 === 0 ? "women" : "men";
}

export function getPersonAvatarUrl(personId: string, displayName: string, size = 128): string {
  const name = displayName.trim();
  const demo = DEMO_PORTRAITS[name];
  if (demo) {
    return demo.replace("w=256&h=256", `w=${size}&h=${size}`);
  }

  const sex = inferSex(name, personId);
  const pool = sex === "women" ? WOMEN_PORTRAITS : MEN_PORTRAITS;
  const index = pool[hashSeed(personId || name) % pool.length];
  return `https://randomuser.me/api/portraits/${sex}/${index}.jpg`;
}

export function getPersonInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
}
