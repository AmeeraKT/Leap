import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import {
  SCROLL_INERTIA_INTENSITY_DEFAULT,
  clampScrollInertiaIntensity,
  getScrollInertiaAlpha,
  type ScrollInertiaIntensity,
} from "@/lib/scroll-inertia";

function isBodyScrollLocked(): boolean {
  // Dialog components (Radix/shadcn) typically lock body scrolling by setting overflow: hidden.
  return (
    document.body.style.overflow === "hidden" ||
    document.body.style.overflowY === "hidden" ||
    document.body.classList.contains("overflow-hidden") ||
    document.documentElement.style.overflow === "hidden"
  );
}

function isVerticallyScrollable(el: HTMLElement): boolean {
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  const canScroll =
    (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
    el.scrollHeight > el.clientHeight + 1;
  return canScroll;
}

function shouldIgnoreGesture(target: EventTarget | null): boolean {
  if (isBodyScrollLocked()) return true;
  if (!(target instanceof HTMLElement)) return false;

  // If the wheel/touch gesture originates from an internal scroll container, do not hijack it.
  let node: HTMLElement | null = target;
  for (let i = 0; i < 6 && node; i++) {
    if (node === document.body || node === document.documentElement) break;
    if (isVerticallyScrollable(node)) return true;
    node = node.parentElement;
  }
  return false;
}

export function ScrollInertiaController({ intensity = SCROLL_INERTIA_INTENSITY_DEFAULT }: { intensity?: ScrollInertiaIntensity }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const intensityClamped = clampScrollInertiaIntensity(intensity);
    const alpha = getScrollInertiaAlpha(intensityClamped);

    const clampY = (y: number) => {
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return Math.min(maxY, Math.max(0, y));
    };

    let rafId: number | null = null;
    let isAnimating = false;

    let currentY = window.scrollY || 0;
    let targetY = currentY;

    // Touch handling (basic): we map drag distance -> target scroll, and let rAF handle inertia.
    let touchStartClientY: number | null = null;
    let touchStartScrollY = 0;

    const tick = () => {
      const delta = targetY - currentY;
      if (Math.abs(delta) < 0.5) {
        currentY = targetY;
        window.scrollTo({ top: currentY, left: 0, behavior: "auto" });
        rafId = null;
        isAnimating = false;
        return;
      }

      currentY = clampY(currentY + delta * alpha);
      window.scrollTo({ top: currentY, left: 0, behavior: "auto" });
      rafId = window.requestAnimationFrame(tick);
    };

    const ensureTicking = () => {
      if (rafId != null) return;
      isAnimating = true;
      rafId = window.requestAnimationFrame(tick);
    };

    const normalizeWheelDelta = (e: WheelEvent) => {
      // deltaMode: 0=px, 1=lines, 2=pages
      if (e.deltaMode === 1) return e.deltaY * 16;
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight * 0.9;
      return e.deltaY;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return; // avoid interfering with zoom gestures
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // likely horizontal/diagonal trackpad
      if (shouldIgnoreGesture(e.target)) return;

      e.preventDefault();

      targetY = clampY(targetY + normalizeWheelDelta(e));
      currentY = clampY(currentY); // keep consistent near edges
      ensureTicking();
    };

    const onScroll = () => {
      // If we aren't animating, align our target/current to the user's scroll position.
      if (isAnimating) return;
      currentY = window.scrollY || 0;
      targetY = currentY;
    };

    const onResize = () => {
      currentY = clampY(window.scrollY || 0);
      targetY = clampY(targetY);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.defaultPrevented) return;
      if (e.touches.length !== 1) return;
      if (shouldIgnoreGesture(e.target)) return;

      touchStartClientY = e.touches[0].clientY;
      touchStartScrollY = window.scrollY || 0;
      currentY = touchStartScrollY;
      targetY = touchStartScrollY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartClientY == null) return;
      if (e.touches.length !== 1) return;
      if (shouldIgnoreGesture(e.target)) return;

      // Prevent native touch scrolling so we can apply inertia/drag delay.
      e.preventDefault();

      const clientY = e.touches[0].clientY;
      const delta = touchStartClientY - clientY; // drag up => scroll down
      targetY = clampY(touchStartScrollY + delta);
      ensureTicking();
    };

    const onTouchEnd = () => {
      touchStartClientY = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      if (rafId != null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", onWheel as EventListener);
      window.removeEventListener("scroll", onScroll as EventListener);
      window.removeEventListener("resize", onResize as EventListener);
      window.removeEventListener("touchstart", onTouchStart as EventListener);
      window.removeEventListener("touchmove", onTouchMove as EventListener);
      window.removeEventListener("touchend", onTouchEnd as EventListener);
      window.removeEventListener("touchcancel", onTouchEnd as EventListener);
    };
  }, [intensity, prefersReducedMotion]);

  return null;
}

