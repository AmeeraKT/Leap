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

const images = {
  profiles: {
    alex:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    samira:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    noah:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    emma:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
    luca:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=600&q=80",
    hana:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80",
    maya:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    ethan:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  videos: {
    alex:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    samira:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    noah:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    emma:
      "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1200&q=80",
    luca:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
    hana:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    maya:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    ethan:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80",
  },
  journey: {
    samiraPitch:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80",
    samiraWorkshop:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    noahPipeline:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
    noahInternship:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    emmaPredictor:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=80",
    emmaEthics:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    lucaDataset:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
    hanaOnboarding:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=900&q=80",
    hanaMeetup:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=900&q=80",
    mayaScheduling:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
    ethanRobotics:
      "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?auto=format&fit=crop&w=900&q=80",
    ethanChallenge:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
  },
};

const alexJourney = EXPERIENCES_SEED.map(experienceToJourneyEntry);

export const students: Student[] = [
  {
    id: "st-alex-chen",
    name: "Alex Chen",
    photo: images.profiles.alex,
    oneLiner: "Built an AI study tool that hit 2k users in a semester.",
    degree: "Computer Science",
    majors: ["Artificial Intelligence", "Software Engineering"],
    year: 3,
    university: "The University of Queensland",
    skills: ["Python", "Machine Learning", "Product thinking"],
    personalityTraits: ["Insightful", "Builder", "Ambitious"],
    featured: true,
    video: {
      thumbnail: images.videos.alex,
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
    photo: images.profiles.samira,
    oneLiner: "Won a hackathon by turning interviews into a hiring-ready portfolio.",
    degree: "IT",
    majors: ["Information Systems", "Data Analytics"],
    year: 2,
    university: "Monash University",
    skills: ["SQL", "Dashboards", "Communication"],
    personalityTraits: ["Communicator", "Empathetic", "Resourceful"],
    featured: true,
    video: {
      thumbnail: images.videos.samira,
      url: "https://example.com/video/samira",
      caption: "Turning insights into decisions",
    },
    journey: [
      {
        type: "Competition",
        title: "Startup Pitch Night",
        date: "2026-04-20T00:00:00.000Z",
        photo: images.journey.samiraPitch,
        reflection:
          "Crafted a clear narrative for impact and user value. Practiced Q&A until I sounded confident under pressure.",
        skills: ["Storytelling", "Impact metrics"],
      },
      {
        type: "Volunteer",
        title: "Student Ambassador Workshop",
        date: "2026-03-19T00:00:00.000Z",
        photo: images.journey.samiraWorkshop,
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
    photo: images.profiles.noah,
    oneLiner: "Shipped a portfolio pipeline that auto-generates case studies.",
    degree: "Computer Science",
    majors: ["Human-Computer Interaction", "Software Engineering"],
    year: 4,
    university: "Australian National University",
    skills: ["React", "TypeScript", "System design"],
    personalityTraits: ["Creative", "Thoughtful", "Reliable"],
    featured: false,
    video: {
      thumbnail: images.videos.noah,
      url: "https://example.com/video/noah",
      caption: "Clean architecture + delightful UX",
    },
    journey: [
      {
        type: "Project",
        title: "Portfolio Pipeline (Auto Case Studies)",
        date: "2026-02-14T00:00:00.000Z",
        photo: images.journey.noahPipeline,
        reflection:
          "Built an end-to-end workflow: ingestion, summarization, formatting, and review. Reduced time-to-post by ~70%.",
        skills: ["Automation", "Front-end engineering"],
      },
      {
        type: "Internship",
        title: "Frontend Internship (Design Systems)",
        date: "2026-01-09T00:00:00.000Z",
        photo: images.journey.noahInternship,
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
    photo: images.profiles.emma,
    oneLiner: "Developed a hiring simulator that predicts skill-fit from resumes.",
    degree: "Double Degree",
    majors: ["Computer Science", "Psychology"],
    year: 3,
    university: "University of Sydney",
    skills: ["NLP", "Experiment design", "Ethics"],
    personalityTraits: ["Analytical", "Insightful", "Leader"],
    featured: true,
    video: {
      thumbnail: images.videos.emma,
      url: "https://example.com/video/emma",
      caption: "Skill-fit experiments with responsible evaluation",
    },
    journey: [
      {
        type: "Project",
        title: "Resume-to-Skill Fit Predictor",
        date: "2026-05-27T00:00:00.000Z",
        photo: images.journey.emmaPredictor,
        reflection:
          "Designed experiments and built interpretable scoring so recruiters can understand why results happen—not just trust numbers.",
        skills: ["NLP", "Interpretability"],
      },
      {
        type: "Event",
        title: "AI Ethics Roundtable",
        date: "2026-06-02T00:00:00.000Z",
        photo: images.journey.emmaEthics,
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
    photo: images.profiles.luca,
    oneLiner: "Led a volunteer engineering squad that built a community dataset.",
    degree: "IT",
    majors: ["Cybersecurity", "Data Analytics"],
    year: 1,
    university: "RMIT University",
    skills: ["Security basics", "Data cleaning", "Team leadership"],
    personalityTraits: ["Leader", "Dependable", "Collaborative"],
    featured: false,
    video: {
      thumbnail: images.videos.luca,
      url: "https://example.com/video/luca",
      caption: "Community impact + consistent execution",
    },
    journey: [
      {
        type: "Volunteer",
        title: "Community Dataset Build Sprint",
        date: "2026-03-01T00:00:00.000Z",
        photo: images.journey.lucaDataset,
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
    photo: images.profiles.hana,
    oneLiner: "Shipped a chatbot onboarding flow and improved activation by 25%.",
    degree: "Computer Science",
    majors: ["Software Engineering", "Product Design"],
    year: 2,
    university: "University of Melbourne",
    skills: ["Product UX", "TypeScript", "Analytics"],
    personalityTraits: ["Curious", "Creative", "Builder"],
    featured: true,
    video: {
      thumbnail: images.videos.hana,
      url: "https://example.com/video/hana",
      caption: "Measuring outcomes, not assumptions",
    },
    journey: [
      {
        type: "Project",
        title: "Chatbot Onboarding + Activation Tracking",
        date: "2026-04-09T00:00:00.000Z",
        photo: images.journey.hanaOnboarding,
        reflection:
          "Created event tracking and iterated on onboarding messages until activation improved with clear signals.",
        skills: ["Analytics", "UX writing"],
      },
      {
        type: "Event",
        title: "Product Builders Meetup",
        date: "2026-05-18T00:00:00.000Z",
        photo: images.journey.hanaMeetup,
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
    photo: images.profiles.maya,
    oneLiner: "Built a scheduling tool for teams and automated reports for stakeholders.",
    degree: "IT",
    majors: ["Business Systems", "Software Engineering"],
    year: 3,
    university: "University of Adelaide",
    skills: ["Automation", "Workflows", "Stakeholder comms"],
    personalityTraits: ["Organized", "Communicator", "Proactive"],
    featured: false,
    video: {
      thumbnail: images.videos.maya,
      url: "https://example.com/video/maya",
      caption: "Operations that scale with the team",
    },
    journey: [
      {
        type: "Project",
        title: "Team Scheduling + Auto Reports",
        date: "2026-02-22T00:00:00.000Z",
        photo: images.journey.mayaScheduling,
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
    photo: images.profiles.ethan,
    oneLiner: "Interned in robotics and documented experiments like a scientist.",
    degree: "Double Degree",
    majors: ["Engineering", "Computer Science"],
    year: 4,
    university: "University of Queensland",
    skills: ["Robotics", "Experiment design", "Documentation"],
    personalityTraits: ["Methodical", "Resilient", "Builder"],
    featured: false,
    video: {
      thumbnail: images.videos.ethan,
      url: "https://example.com/video/ethan",
      caption: "Learning loops from real tests",
    },
    journey: [
      {
        type: "Internship",
        title: "Robotics Lab Intern",
        date: "2026-01-22T00:00:00.000Z",
        photo: images.journey.ethanRobotics,
        reflection:
          "Built repeatable experiment notes and improved calibration reliability by ~15% with better logging.",
        skills: ["Robotics", "Experimentation"],
      },
      {
        type: "Competition",
        title: "Campus Robotics Challenge",
        date: "2026-05-05T00:00:00.000Z",
        photo: images.journey.ethanChallenge,
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

