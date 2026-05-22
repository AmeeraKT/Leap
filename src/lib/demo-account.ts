import { defaultQuiz, type QuizState } from "@/lib/quiz-types";

export const DEMO_EMAIL = "demo@leap.app";
export const DEMO_PASSWORD = "demo123";

export const DEMO_USER_ID = "demo-user-alex";

export const DEMO_PROFILE = {
  id: DEMO_USER_ID,
  name: "Alex Chen",
  age: 22,
  location: "Melbourne, Australia",
  current_education: "bachelor",
  desired_field: "Software Engineering",
  interests: ["Tech", "Engineering", "Business"],
};

export const DEMO_QUIZ: QuizState = {
  ...defaultQuiz,
  userType: "student",
  studentLevel: "bachelor",
  name: "Alex Chen",
  age: "22",
  location: "Melbourne, Australia",
  studyPreference: "on-campus",
  interests: ["Tech", "Engineering", "Business"],
  currentEducation: "bachelor",
  currentField: "Computer Science",
  performance: "strong",
  desiredField: "Software Engineering",
  futureField: "Software Engineering",
  educationType: "university",
  institutionType: "public",
  format: "full-time",
};
