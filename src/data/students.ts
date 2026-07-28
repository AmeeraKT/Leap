import { EXPERIENCES_SEED } from "@/lib/experiences-store";
import { experienceToJourneyEntry } from "@/lib/experience-mappers";

export type JourneyEntry = {
  type: "Event" | "Competition" | "Project" | "Internship" | "Volunteer";
  title: string;
  date: string; // ISO
  photo: string;
  reflection: string;
  skills: string[];
};

export type Student = {
  id: string;
  name: string;
  photo: string;
  oneLiner: string;

  // Discover filters
  degree: "IT" | "Computer Science" | "Double Degree";
  majors: string[];
  year: 1 | 2 | 3 | 4;
  university: string;
  skills: string[];
  personalityTraits: [string, string, string];

  // Dashboard spotlight / profile hero
  featured: boolean;
  video: { thumbnail: string; url: string; caption: string };

  // Journey log (renders on profile)
  journey: JourneyEntry[];

  // Analytics flags
  hasStartup: boolean;
  hasProjects: boolean;
  signals: (
    | "has startup"
    | "has projects"
    | "club exec member"
    | "student ambassador"
    | "has large following"
    | "course tutor"
    | "had internships"
  )[];
  contactedCount: number;

  // Premium gating
  isPremiumProfile: boolean;
};

const placeholderPhoto = (text: string) =>
  `https://placehold.co/240x240/png?text=${encodeURIComponent(text)}`;

const placeholderVideoThumb = (text: string) =>
  `https://placehold.co/640x360/png?text=${encodeURIComponent(text)}`;

const alexJourney = EXPERIENCES_SEED.map(experienceToJourneyEntry);

export const students: Student[] = [
  {
    id: "st-alex-chen",
    name: "Alex Chen",
    photo: placeholderPhoto("Alex"),
    oneLiner: "Built an AI study tool that hit 2k users in a semester.",
    degree: "Computer Science",
    majors: ["Artificial Intelligence", "Software Engineering"],
    year: 3,
    university: "The University of Queensland",
    skills: ["Python", "Machine Learning", "Product thinking"],
    personalityTraits: ["Insightful", "Builder", "Ambitious"],
    featured: true,
    video: {
      thumbnail: placeholderVideoThumb("Alex Demo"),
      url: "https://example.com/video/alex",
      caption: "Rapid prototyping + measurable outcomes",
    },
    journey: alexJourney,
    hasStartup: true,
    hasProjects: true,
    signals: ["has startup", "has projects", "club exec member", "has large following"],
    contactedCount: 2,
    isPremiumProfile: true,
  },
  {
    id: "st-samira-khan",
    name: "Samira Khan",
    photo: placeholderPhoto("Samira"),
    oneLiner: "Won a hackathon by turning interviews into a hiring-ready portfolio.",
    degree: "IT",
    majors: ["Information Systems", "Data Analytics"],
    year: 2,
    university: "Monash University",
    skills: ["SQL", "Dashboards", "Communication"],
    personalityTraits: ["Communicator", "Empathetic", "Resourceful"],
    featured: true,
    video: {
      thumbnail: placeholderVideoThumb("Samira Pitch"),
      url: "https://example.com/video/samira",
      caption: "Turning insights into decisions",
    },
    journey: [
      {
        type: "Competition",
        title: "Startup Pitch Night",
        date: "2026-04-20T00:00:00.000Z",
        photo: placeholderPhoto("Pitch"),
        reflection:
          "Crafted a clear narrative for impact and user value. Practiced Q&A until I sounded confident under pressure.",
        skills: ["Storytelling", "Impact metrics"],
      },
      {
        type: "Volunteer",
        title: "Student Ambassador Workshop",
        date: "2026-03-19T00:00:00.000Z",
        photo: placeholderPhoto("Ambassador"),
        reflection:
          "Helped new students plan projects and stay consistent. Watching others succeed made me sharpen my mentorship approach.",
        skills: ["Mentoring", "Workshop facilitation"],
      },
    ],
    hasStartup: false,
    hasProjects: true,
    signals: ["has projects", "student ambassador", "club exec member"],
    contactedCount: 1,
    isPremiumProfile: false,
  },
  {
    id: "st-noah-park",
    name: "Noah Park",
    photo: placeholderPhoto("Noah"),
    oneLiner: "Shipped a portfolio pipeline that auto-generates case studies.",
    degree: "Computer Science",
    majors: ["Human-Computer Interaction", "Software Engineering"],
    year: 4,
    university: "Australian National University",
    skills: ["React", "TypeScript", "System design"],
    personalityTraits: ["Creative", "Thoughtful", "Reliable"],
    featured: false,
    video: {
      thumbnail: placeholderVideoThumb("Noah Build"),
      url: "https://example.com/video/noah",
      caption: "Clean architecture + delightful UX",
    },
    journey: [
      {
        type: "Project",
        title: "Portfolio Pipeline (Auto Case Studies)",
        date: "2026-02-14T00:00:00.000Z",
        photo: placeholderPhoto("Pipeline"),
        reflection:
          "Built an end-to-end workflow: ingestion, summarization, formatting, and review. Reduced time-to-post by ~70%.",
        skills: ["Automation", "Front-end engineering"],
      },
      {
        type: "Internship",
        title: "Frontend Internship (Design Systems)",
        date: "2026-01-09T00:00:00.000Z",
        photo: placeholderPhoto("Internship"),
        reflection:
          "Learned to ship with design tokens and measured accessibility improvements with real user feedback.",
        skills: ["Accessibility", "Design tokens"],
      },
    ],
    hasStartup: false,
    hasProjects: true,
    signals: ["has projects", "had internships", "course tutor"],
    contactedCount: 4,
    isPremiumProfile: true,
  },
  {
    id: "st-emma-ross",
    name: "Emma Ross",
    photo: placeholderPhoto("Emma"),
    oneLiner: "Developed a hiring simulator that predicts skill-fit from resumes.",
    degree: "Double Degree",
    majors: ["Computer Science", "Psychology"],
    year: 3,
    university: "University of Sydney",
    skills: ["NLP", "Experiment design", "Ethics"],
    personalityTraits: ["Analytical", "Insightful", "Leader"],
    featured: true,
    video: {
      thumbnail: placeholderVideoThumb("Emma Demo"),
      url: "https://example.com/video/emma",
      caption: "Skill-fit experiments with responsible evaluation",
    },
    journey: [
      {
        type: "Project",
        title: "Resume-to-Skill Fit Predictor",
        date: "2026-05-27T00:00:00.000Z",
        photo: placeholderPhoto("Fit"),
        reflection:
          "Designed experiments and built interpretable scoring so recruiters can understand why results happen—not just trust numbers.",
        skills: ["NLP", "Interpretability"],
      },
      {
        type: "Event",
        title: "AI Ethics Roundtable",
        date: "2026-06-02T00:00:00.000Z",
        photo: placeholderPhoto("Ethics"),
        reflection:
          "Collaborated on guidelines for fair evaluation and bias checks in model-driven screening.",
        skills: ["Ethical AI", "Collaboration"],
      },
    ],
    hasStartup: true,
    hasProjects: true,
    signals: ["has startup", "has projects", "has large following"],
    contactedCount: 0,
    isPremiumProfile: false,
  },
  {
    id: "st-luca-bianchi",
    name: "Luca Bianchi",
    photo: placeholderPhoto("Luca"),
    oneLiner: "Led a volunteer engineering squad that built a community dataset.",
    degree: "IT",
    majors: ["Cybersecurity", "Data Analytics"],
    year: 1,
    university: "RMIT University",
    skills: ["Security basics", "Data cleaning", "Team leadership"],
    personalityTraits: ["Leader", "Dependable", "Collaborative"],
    featured: false,
    video: {
      thumbnail: placeholderVideoThumb("Luca Team"),
      url: "https://example.com/video/luca",
      caption: "Community impact + consistent execution",
    },
    journey: [
      {
        type: "Volunteer",
        title: "Community Dataset Build Sprint",
        date: "2026-03-01T00:00:00.000Z",
        photo: placeholderPhoto("Dataset"),
        reflection:
          "Organized tasks, improved documentation, and kept quality checks simple but consistent for the whole team.",
        skills: ["Data quality", "Leadership"],
      },
    ],
    hasStartup: false,
    hasProjects: false,
    signals: ["club exec member"],
    contactedCount: 0,
    isPremiumProfile: false,
  },
  {
    id: "st-hana-tanaka",
    name: "Hana Tanaka",
    photo: placeholderPhoto("Hana"),
    oneLiner: "Shipped a chatbot onboarding flow and improved activation by 25%.",
    degree: "Computer Science",
    majors: ["Software Engineering", "Product Design"],
    year: 2,
    university: "University of Melbourne",
    skills: ["Product UX", "TypeScript", "Analytics"],
    personalityTraits: ["Curious", "Creative", "Builder"],
    featured: true,
    video: {
      thumbnail: placeholderVideoThumb("Hana Growth"),
      url: "https://example.com/video/hana",
      caption: "Measuring outcomes, not assumptions",
    },
    journey: [
      {
        type: "Project",
        title: "Chatbot Onboarding + Activation Tracking",
        date: "2026-04-09T00:00:00.000Z",
        photo: placeholderPhoto("Onboarding"),
        reflection:
          "Created event tracking and iterated on onboarding messages until activation improved with clear signals.",
        skills: ["Analytics", "UX writing"],
      },
      {
        type: "Event",
        title: "Product Builders Meetup",
        date: "2026-05-18T00:00:00.000Z",
        photo: placeholderPhoto("Meetup"),
        reflection:
          "Shared experiments and learned how other builders run rapid cycles with better documentation.",
        skills: ["Community", "Experimentation"],
      },
    ],
    hasStartup: false,
    hasProjects: true,
    signals: ["has projects", "student ambassador", "has large following"],
    contactedCount: 3,
    isPremiumProfile: true,
  },
  {
    id: "st-maya-singh",
    name: "Maya Singh",
    photo: placeholderPhoto("Maya"),
    oneLiner: "Built a scheduling tool for teams and automated reports for stakeholders.",
    degree: "IT",
    majors: ["Business Systems", "Software Engineering"],
    year: 3,
    university: "University of Adelaide",
    skills: ["Automation", "Workflows", "Stakeholder comms"],
    personalityTraits: ["Organized", "Communicator", "Proactive"],
    featured: false,
    video: {
      thumbnail: placeholderVideoThumb("Maya Tools"),
      url: "https://example.com/video/maya",
      caption: "Operations that scale with the team",
    },
    journey: [
      {
        type: "Project",
        title: "Team Scheduling + Auto Reports",
        date: "2026-02-22T00:00:00.000Z",
        photo: placeholderPhoto("Scheduling"),
        reflection:
          "Replaced manual reporting with templates and automated summaries. Stakeholders got answers faster and with less friction.",
        skills: ["Automation", "Process design"],
      },
    ],
    hasStartup: false,
    hasProjects: true,
    signals: ["has projects", "course tutor"],
    contactedCount: 1,
    isPremiumProfile: false,
  },
  {
    id: "st-ethan-wright",
    name: "Ethan Wright",
    photo: placeholderPhoto("Ethan"),
    oneLiner: "Interned in robotics and documented experiments like a scientist.",
    degree: "Double Degree",
    majors: ["Engineering", "Computer Science"],
    year: 4,
    university: "University of Queensland",
    skills: ["Robotics", "Experiment design", "Documentation"],
    personalityTraits: ["Methodical", "Resilient", "Builder"],
    featured: false,
    video: {
      thumbnail: placeholderVideoThumb("Ethan Robot"),
      url: "https://example.com/video/ethan",
      caption: "Learning loops from real tests",
    },
    journey: [
      {
        type: "Internship",
        title: "Robotics Lab Intern",
        date: "2026-01-22T00:00:00.000Z",
        photo: placeholderPhoto("Robotics"),
        reflection:
          "Built repeatable experiment notes and improved calibration reliability by ~15% with better logging.",
        skills: ["Robotics", "Experimentation"],
      },
      {
        type: "Competition",
        title: "Campus Robotics Challenge",
        date: "2026-05-05T00:00:00.000Z",
        photo: placeholderPhoto("Challenge"),
        reflection:
          "Collaborated on strategy and iterated the control logic quickly once constraints were understood.",
        skills: ["Teamwork", "Iterative engineering"],
      },
    ],
    hasStartup: false,
    hasProjects: true,
    signals: ["has projects", "had internships"],
    contactedCount: 5,
    isPremiumProfile: true,
  },
];

