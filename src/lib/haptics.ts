export type HapticPattern = "light" | "medium" | "success" | "warning" | "error";

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  success: [12, 40, 18],
  warning: [20, 60, 20],
  error: [30, 60, 30, 60, 30],
};

export function haptic(pattern: HapticPattern = "light") {
  if (typeof navigator === "undefined") return;
  try {
    if ("vibrate" in navigator) navigator.vibrate(PATTERNS[pattern]);
  } catch {}
}
