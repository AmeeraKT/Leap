import type { JourneyEntry, Student } from "@/data/students";
import { experienceToJourneyEntry } from "@/lib/experience-mappers";
import { EXPERIENCES_SEED, type Experience } from "@/lib/experiences-store";

export const ALEX_STUDENT_ID = "st-alex-chen";

export type PortfolioTab = "Videos" | "Photos" | "Logs";

export type PortfolioVideo = {
  id: string;
  thumbnail: string;
  title: string;
  caption?: string;
};

export type PortfolioPhoto = {
  id: string;
  url: string;
  title: string;
  alt?: string;
};

export const PORTFOLIO_PAGE_SIZES: Record<PortfolioTab, number> = {
  Videos: 4,
  Photos: 8,
  Logs: 4,
};

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function getPageCount(itemCount: number, pageSize: number): number {
  if (itemCount === 0) return 1;
  return Math.ceil(itemCount / pageSize);
}

export function getAlexExperiences(): Experience[] {
  return EXPERIENCES_SEED;
}

export function getStudentJourney(student: Student): JourneyEntry[] {
  if (student.id === ALEX_STUDENT_ID) {
    return getAlexExperiences().map(experienceToJourneyEntry);
  }
  return student.journey;
}

function isVideoExperience(exp: Experience): boolean {
  return (
    exp.type === "Project" ||
    exp.type === "Competition" ||
    exp.type === "Internship" ||
    Object.values(exp.posted).some(Boolean)
  );
}

export function buildPortfolioMedia(student: Student): {
  videos: PortfolioVideo[];
  photos: PortfolioPhoto[];
  logs: JourneyEntry[];
} {
  const journey = getStudentJourney(student);
  const experiences = student.id === ALEX_STUDENT_ID ? getAlexExperiences() : null;

  const videos: PortfolioVideo[] = [
    {
      id: `${student.id}-featured-video`,
      thumbnail: student.video.thumbnail,
      title: student.video.caption,
      caption: student.name,
    },
  ];

  if (experiences) {
    for (const exp of experiences) {
      if (!isVideoExperience(exp)) continue;
      videos.push({
        id: `${student.id}-video-${exp.id}`,
        thumbnail: exp.photoUrl ?? student.video.thumbnail,
        title: exp.title,
        caption: exp.impact ?? exp.type,
      });
    }
  } else {
    for (const entry of journey) {
      if (entry.type === "Project" || entry.type === "Competition" || entry.type === "Internship") {
        videos.push({
          id: `${student.id}-video-${entry.title}`,
          thumbnail: entry.photo,
          title: entry.title,
          caption: entry.type,
        });
      }
    }
  }

  const photos: PortfolioPhoto[] = [];

  if (experiences) {
    for (const exp of experiences) {
      if (exp.photoUrl) {
        photos.push({
          id: `${student.id}-photo-${exp.id}`,
          url: exp.photoUrl,
          title: exp.title,
          alt: exp.title,
        });
      }
      exp.media?.forEach((item, index) => {
        if (item.kind === "image") {
          photos.push({
            id: `${student.id}-photo-${exp.id}-media-${index}`,
            url: item.url,
            title: exp.title,
            alt: `${exp.title} gallery ${index + 1}`,
          });
        }
      });
    }
  } else {
    for (const entry of journey) {
      photos.push({
        id: `${student.id}-photo-${entry.title}`,
        url: entry.photo,
        title: entry.title,
        alt: entry.title,
      });
    }
  }

  return { videos, photos, logs: journey };
}
