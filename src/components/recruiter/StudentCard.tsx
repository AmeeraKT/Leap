import { Bookmark, BookmarkCheck, Play } from "lucide-react";

import { Link } from "react-router-dom";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { Student } from "@/data/students";

import { useRecruiter } from "./RecruiterContext";



type StudentCardVariant = "spotlight" | "grid";

type StudentCardProps = {
  student: Student;
  variant?: StudentCardVariant;
  showMajors?: boolean;
  showSkills?: boolean;
  showPersonality?: boolean;
};



export function StudentCard({

  student,

  variant = "grid",

  showMajors = true,

  showSkills = true,

  showPersonality = false,

}: StudentCardProps) {

  const { isShortlisted, toggleShortlist } = useRecruiter();

  const shortlisted = isShortlisted(student.id);

  const isSpotlight = variant === "spotlight";



  return (

    <motion.div

      className={cn(isSpotlight && "h-full")}

      whileHover={{ y: -4 }}

      transition={{ type: "spring", stiffness: 280, damping: 22 }}

    >

      <Link

        to={`/recruiter/student/${student.id}`}

        className={cn(

          "group relative flex overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-colors",

          "hover:border-coral/50",

          isSpotlight ? "h-full flex-col p-4 md:p-5" : "block p-4",

        )}

      >

        <button

          type="button"

          onClick={(e) => {

            e.preventDefault();

            e.stopPropagation();

            toggleShortlist(student.id);

          }}

          aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}

          className={cn(

            "absolute right-3 top-3 z-10 rounded-full p-2 transition-colors",

            shortlisted

              ? "bg-coral text-coral-foreground"

              : "bg-background/90 text-muted-foreground hover:text-foreground",

          )}

        >

          {shortlisted ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}

        </button>



        <div

          className={cn(

            "grid flex-1 gap-4",

            isSpotlight ? "md:grid-cols-[1.1fr_1fr] md:items-stretch" : "",

          )}

        >

          <div className="relative overflow-hidden rounded-xl border border-border bg-muted/20">

            <img

              src={student.video.thumbnail}

              alt={`${student.name} video thumbnail`}

              className={cn(

                "w-full object-cover",

                isSpotlight ? "aspect-[9/16] h-full min-h-[16rem] max-h-[24rem]" : "aspect-[9/16] max-h-64",

              )}

              loading="lazy"

              decoding="async"

            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground">

              <Play className="h-3.5 w-3.5" /> Play

            </span>

          </div>



          <div className="flex min-h-0 flex-1 flex-col gap-3">

            <div className="flex items-center gap-3">

              <img

                src={student.photo}

                alt={student.name}

                className="h-11 w-11 shrink-0 rounded-full border border-border object-cover"

                loading="lazy"

                decoding="async"

              />

              <div className="min-w-0 pr-8">

                <h3 className="font-display text-lg font-normal leading-tight text-foreground">{student.name}</h3>

                <p className="text-xs text-muted-foreground">

                  Year {student.year} · {student.degree}

                </p>

              </div>

            </div>



            <p className={cn("text-sm font-medium text-foreground", isSpotlight && "line-clamp-2 min-h-[2.5rem]")}>

              {student.oneLiner}

            </p>



            <div className={cn("space-y-1 text-xs text-muted-foreground", isSpotlight && "min-h-[2.5rem]")}>

              {showMajors && <p className="line-clamp-1">Majors: {student.majors.join(", ")}</p>}

              <p className="line-clamp-1">{student.university}</p>

            </div>



            {(showSkills || showPersonality) && (
              <div className={cn("space-y-2 pt-1", isSpotlight && "mt-auto")}>
                {showSkills && (
                  <div className={cn("flex flex-wrap gap-1.5", isSpotlight && "min-h-[4.5rem] content-start")}>
                    {student.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full border border-coral/25 bg-secondary/25 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {showPersonality && (
                  <div className="flex flex-wrap gap-1.5">
                    {student.personalityTraits.map((trait) => (
                      <span
                        key={trait}
                        className="inline-flex items-center rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </Link>

    </motion.div>

  );

}


