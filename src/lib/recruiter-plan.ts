export type RecruiterDemoPlan = "free" | "premium";

const KEY = "leap.recruiter.plan";

export function setRecruiterDemoPlan(plan: RecruiterDemoPlan) {
  try {
    sessionStorage.setItem(KEY, plan);
  } catch {
    // ignore storage failures
  }
}

export function getRecruiterDemoPlan(): RecruiterDemoPlan | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw === "free" || raw === "premium" ? raw : null;
  } catch {
    return null;
  }
}

