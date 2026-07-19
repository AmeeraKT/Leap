import { defaultQuiz, type QuizState } from "@/lib/quiz-types";
import { supabase } from "@/integrations/supabase/client";
import { progressionStore } from "@/lib/progression-store";

export const DEMO_EMAIL = "demo@leap.app";
export const DEMO_PASSWORD = "demo123";

export const DEMO_USER_ID = "demo-user-alex";

export const DEMO_PROFILE = {
  id: DEMO_USER_ID,
  name: "Alex Chen",
  age: 22,
  location: "Melbourne, Australia",
  current_education: "Undergraduate",
  desired_field: "Technology",
  interests: ["Gaming", "Music", "Building / making things"],
};

export const DEMO_QUIZ: QuizState = {
  ...defaultQuiz,
  name: "Alex Chen",
  studyingAreas: ["Technology / IT", "Engineering"],
  interests: ["Gaming", "Music", "Building / making things"],
  currentEducation: "Undergraduate",
  yearLevel: "3rd year",
  currentField: "Computer Science",
  employmentStatus: "Part-time / casual work",
  industry: "Technology",
  experience: "1–2 years",
  skills: ["Digital / Tech", "Analytical", "Communication"],
  desiredField: "Technology",
  salaryExpectation: "Mid range · $65–90k",
  timeline: "After I graduate",
  flexibility: "Hybrid",
  personality: [40, 35, 70, 45, 55, 50, 40, 65, 55],
  citySize: "Major city (Brisbane, Sydney, Melbourne)",
  socialEnv: "A balanced mix",
  commute: "Moderate — up to 45 min",
  workLifeBalance: "Balanced",
  priorities: [
    "Following my passion",
    "Getting into the workforce fast and earning",
    "Lifestyle fit",
    "High salary",
    "Social impact",
  ],
};

/** Sign in as Alex Chen and seed quiz progress for the demo. */
export async function enterDemoAccount() {
  const auth = supabase.auth as typeof supabase.auth & {
    signInAsDemo?: () => Promise<unknown>;
  };
  if (typeof auth.signInAsDemo === "function") {
    await auth.signInAsDemo();
  } else {
    await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
  }
  sessionStorage.setItem("leap-quiz", JSON.stringify(DEMO_QUIZ));
  progressionStore.grantQuizComplete();
}
