export interface QuizState {
  // Section 1 · Profile
  studyingAreas: string[];
  interests: string[];
  // Section 2 · Academics
  currentEducation: string;
  yearLevel: string;
  currentField: string;
  // Section 3a · Career current
  employmentStatus: string;
  industry: string;
  experience: string;
  skills: string[];
  // Section 3b · Career aspirations
  desiredField: string;
  salaryExpectation: string;
  timeline: string;
  flexibility: string;
  // Section 4 · Personality (8 sliders 0–100)
  personality: number[];
  // Section 5 · Student life
  citySize: string;
  socialEnv: string;
  commute: string;
  workLifeBalance: string;
  priorities: string[];
  /** Optional display name for results */
  name: string;
}

export const STUDYING_OPTIONS = [
  "Engineering",
  "Technology / IT",
  "Science / Research",
  "Business",
  "Creative Industries",
  "Health / Medicine",
  "Law",
  "Education",
  "Environmental Science",
  "Social Sciences",
  "Unsure / still exploring",
] as const;

export const INTEREST_OPTIONS = [
  "Painting",
  "Reading",
  "Writing",
  "Building / making things",
  "Cooking",
  "Gardening",
  "Tennis",
  "Badminton",
  "Hiking",
  "Kayaking",
  "Gaming",
  "Music",
] as const;

export const EDUCATION_LEVELS = [
  "TAFE / VET",
  "Undergraduate",
  "Postgraduate",
  "Recent graduate",
  "Not studying right now",
] as const;

export const YEAR_LEVELS = [
  "1st year",
  "2nd year",
  "3rd year",
  "4th year+",
  "Not applicable",
] as const;

export const EMPLOYMENT_STATUSES = [
  "Studying, not working",
  "Part-time / casual work",
  "Full-time employed",
  "Internship / placement",
  "Self-employed / freelancing",
] as const;

export const INDUSTRY_OPTIONS = [
  "Technology",
  "Healthcare",
  "Retail / Hospitality",
  "Construction / Trades",
  "Education",
  "No work experience yet",
  "Other",
] as const;

export const EXPERIENCE_OPTIONS = [
  "None",
  "1–2 years",
  "3–5 years",
  "5+ years",
] as const;

export const SKILL_OPTIONS = [
  "Digital / Tech",
  "Creative",
  "Communication",
  "Analytical",
  "Leadership",
  "Trades / Hands-on",
  "Care / Empathy",
] as const;

export const DESIRED_FIELD_OPTIONS = [
  "Technology",
  "Healthcare",
  "Creative Industries",
  "Business",
  "Environment / Sustainability",
  "Trades",
  "Education",
  "Community / Social Impact",
] as const;

export const SALARY_OPTIONS = [
  "Entry level · $50–65k",
  "Mid range · $65–90k",
  "High · $90–120k",
  "Premium · $120k+",
] as const;

export const TIMELINE_OPTIONS = [
  "ASAP — within 6 months",
  "Within a year",
  "After I graduate",
  "Flexible / not sure yet",
] as const;

export const FLEXIBILITY_OPTIONS = [
  "Remote / WFH",
  "Hybrid",
  "In-office",
  "Fieldwork / on-site",
  "Open to anything",
] as const;

export const PERSONALITY_PAIRS: [string, string][] = [
  ["Learn best with others", "Prefer solo, independent work"],
  ["Need clear structure and deadlines", "Prefer flexible, self-paced"],
  ["Drawn to creative, open-ended work", "Drawn to logical, data-driven problems"],
  ["Want rapid career progression", "Prefer a steady, lower-pressure path"],
  ["Open to risk and new challenges", "Value stability and a clear ladder"],
  ["Thrive in fast-paced, high-pressure settings", "Prefer a slower, measured pace"],
  ["Focus on big-picture vision", "Focus on detail, accuracy and process"],
  ["Want quick wins and early rewards", "Happy to invest time for bigger long-term payoff"],
  ["Go out of my way to meet new people", "Only network when it happens organically"],
];

export const CITY_SIZE_OPTIONS = [
  "Major city (Brisbane, Sydney, Melbourne)",
  "Regional / smaller city",
  "Rural / country",
  "Open to anything",
] as const;

export const SOCIAL_ENV_OPTIONS = [
  "Vibrant, social campus",
  "Quiet, study-focused",
  "A balanced mix",
] as const;

export const COMMUTE_OPTIONS = [
  "Minimal — 15 min max",
  "Moderate — up to 45 min",
  "Flexible — happy to travel",
] as const;

export const WORK_LIFE_OPTIONS = [
  "Career-focused",
  "Balanced",
  "Life / health first",
] as const;

export const DEFAULT_PRIORITIES = [
  "Getting into the workforce fast and earning",
  "Following my passion",
  "Lifestyle fit",
  "Social impact",
  "High salary",
] as const;

export const QUIZ_SECTIONS = [
  {
    id: "profile",
    title: "Let's start with you",
    subtext: "We'll start with what you're studying, what you're into, and what you want out of it.",
  },
  {
    id: "academics",
    title: "Where are you at academically?",
    subtext: "Tell us about your current studies.",
  },
  {
    id: "career-current",
    title: "Where are you now in your career?",
    subtext: "Your current situation helps us understand your starting point.",
  },
  {
    id: "career-aspirations",
    title: "Where do you want to go?",
    subtext: "Tell us about the career and work style you're aiming for.",
  },
  {
    id: "personality",
    title: "How do you work and learn?",
    subtext:
      "Slide to wherever feels most like you. These shape how we match you to environments and communities.",
  },
  {
    id: "student-life",
    title: "What matters most in your student life?",
    subtext: "Your ideal environment and what you value.",
  },
] as const;

export const defaultQuiz: QuizState = {
  studyingAreas: [],
  interests: [],
  currentEducation: "",
  yearLevel: "",
  currentField: "",
  employmentStatus: "",
  industry: "",
  experience: "",
  skills: [],
  desiredField: "",
  salaryExpectation: "",
  timeline: "",
  flexibility: "",
  personality: [50, 50, 50, 50, 50, 50, 50, 50, 50],
  citySize: "",
  socialEnv: "",
  commute: "",
  workLifeBalance: "",
  priorities: [...DEFAULT_PRIORITIES],
  name: "",
};

export interface PathwayMatch {
  title: string;
  reason: string;
  score: number;
  tags: string[];
}

/** Lightweight stub: top 3 pathway matches from quiz answers */
export function computePathwayMatches(data: QuizState): PathwayMatch[] {
  const field = data.desiredField || data.studyingAreas[0] || "Technology";
  const skills = data.skills.length ? data.skills : ["Communication"];
  const topPriority = data.priorities[0] ?? "Following my passion";

  const catalogue: PathwayMatch[] = [
    {
      title: `${field} pathway`,
      reason: `Strong fit with your goal in ${field} and focus on “${topPriority}”.`,
      score: 92,
      tags: [field, ...skills.slice(0, 2)],
    },
    {
      title: data.studyingAreas[0]
        ? `${data.studyingAreas[0]} → industry bridge`
        : "Campus to career bridge",
      reason: `Builds on ${data.currentEducation || "your studies"} and ${data.experience || "your experience level"}.`,
      score: 84,
      tags: [data.currentEducation || "Student", data.flexibility || "Flexible"].filter(Boolean),
    },
    {
      title: "Personal brand + community track",
      reason: `Matches your ${data.socialEnv || "campus"} preference and ${data.workLifeBalance || "balance"} priority.`,
      score: 78,
      tags: [data.citySize?.split(" ")[0] || "AU", "Community", "Brand"],
    },
  ];

  return catalogue;
}
