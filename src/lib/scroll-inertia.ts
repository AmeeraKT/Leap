export type ScrollInertiaIntensity = 2 | 3 | 4 | 5;

// Default intensity for the window scroll inertia effect.
// Tuning note: scale 2-5 is intentionally noticeable at 2 and stronger at 5.
export const SCROLL_INERTIA_INTENSITY_DEFAULT: ScrollInertiaIntensity = 2;

export function clampScrollInertiaIntensity(value: number): ScrollInertiaIntensity {
  const rounded = Math.round(value);
  if (rounded <= 2) return 2;
  if (rounded === 3) return 3;
  if (rounded === 4) return 4;
  return 5;
}

// Smaller alpha => more inertia/drag delay.
export function getScrollInertiaAlpha(intensity: ScrollInertiaIntensity): number {
  // intensity=2 => ~0.15, intensity=5 => ~0.06
  return 0.3 / intensity;
}

