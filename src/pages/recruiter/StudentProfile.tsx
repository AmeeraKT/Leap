import { useMemo, useState } from "react";

import { Link, useParams, useSearchParams } from "react-router-dom";

import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, MessageSquare, Play } from "lucide-react";

import { AnimatedPage } from "@/components/AnimatedPage";

import { students } from "@/data/students";

import { useRecruiter } from "@/components/recruiter/RecruiterContext";

import { PremiumGate } from "@/components/recruiter/PremiumGate";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { motion } from "framer-motion";

import {

  buildPortfolioMedia,

  getPageCount,

  getStudentJourney,

  paginate,

  PORTFOLIO_PAGE_SIZES,

  type PortfolioTab,

} from "@/lib/recruiter-portfolio";



const reveal = {

  initial: { opacity: 0, y: 24 },

  whileInView: { opacity: 1, y: 0 },

  viewport: { once: true, margin: "-100px" as const },

  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },

};



const PORTFOLIO_TABS: PortfolioTab[] = ["Videos", "Photos", "Logs"];



const formatDate = (iso: string) =>

  new Date(iso).toLocaleDateString(undefined, {

    day: "numeric",

    month: "short",

    year: "numeric",

  });



const RecruiterStudentProfile = () => {

  const { id } = useParams();

  const [params] = useSearchParams();

  const { isShortlisted, toggleShortlist } = useRecruiter();

  const [activeTab, setActiveTab] = useState<PortfolioTab>("Videos");

  const [pageByTab, setPageByTab] = useState<Record<PortfolioTab, number>>({

    Videos: 1,

    Photos: 1,

    Logs: 1,

  });



  const student = students.find((s) => s.id === id);

  const shortlisted = student ? isShortlisted(student.id) : false;



  const journey = useMemo(() => (student ? getStudentJourney(student) : []), [student]);

  const portfolio = useMemo(() => (student ? buildPortfolioMedia(student) : null), [student]);



  const skillEvidence = useMemo(() => {

    if (!student) return [];

    const map = new Map<string, number>();

    student.skills.forEach((skill) => map.set(skill, (map.get(skill) ?? 0) + 1));

    journey.forEach((entry) => {

      entry.skills.forEach((skill) => map.set(skill, (map.get(skill) ?? 0) + 1));

    });

    return [...map.entries()].sort((a, b) => b[1] - a[1]);

  }, [student, journey]);



  const activeItems = useMemo(() => {

    if (!portfolio) return [];

    if (activeTab === "Videos") return portfolio.videos;

    if (activeTab === "Photos") return portfolio.photos;

    return portfolio.logs;

  }, [portfolio, activeTab]);



  const pageSize = PORTFOLIO_PAGE_SIZES[activeTab];

  const currentPage = pageByTab[activeTab];

  const totalPages = getPageCount(activeItems.length, pageSize);

  const pagedItems = paginate(activeItems, currentPage, pageSize);



  const setTab = (tab: PortfolioTab) => {

    setActiveTab(tab);

    setPageByTab((prev) => ({ ...prev, [tab]: 1 }));

  };



  if (!student) {

    return (

      <AnimatedPage className="container py-10">

        <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">

          <h1 className="font-display text-2xl font-normal">Student not found</h1>

          <p className="mt-2 text-sm text-muted-foreground">The profile link may be outdated.</p>

          <Link to="/recruiter/discover" className="mt-4 inline-flex">

            <Button variant="outline">Back to discover</Button>

          </Link>

        </div>

      </AnimatedPage>

    );

  }



  return (

    <AnimatedPage className="container space-y-8 py-8 md:py-10">

      <motion.section {...reveal} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

        <div className="leap-panel rounded-2xl border border-border bg-card p-5 md:p-6">

          <div className="flex items-start gap-4">

            <img src={student.photo} alt={student.name} className="h-20 w-20 rounded-2xl border border-border object-cover" />

            <div className="min-w-0 flex-1">

              <h1 className="font-display text-3xl font-normal">{student.name}</h1>

              <p className="mt-1 text-sm text-muted-foreground">

                Year {student.year} · {student.degree}

              </p>

              <p className="mt-1 text-sm text-muted-foreground">

                {student.majors.join(", ")} · {student.university}

              </p>

              <p className="mt-3 text-sm font-medium text-foreground">{student.oneLiner}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="sr-only">Personality traits</span>
                  {student.personalityTraits.map((trait) => (
                    <span
                      key={trait}
                      className="inline-flex items-center rounded-full border border-coral/20 bg-secondary/20 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                    >
                      {trait}
                    </span>
                  ))}
                </div>

            </div>

            {/* Header actions (Shortlist / Message) */}
            <div className="flex flex-col items-end gap-2">
              <Button
                type="button"
                variant={shortlisted ? "coral" : "outline"}
                onClick={() => toggleShortlist(student.id)}
                className="rounded-full"
              >
                {shortlisted ? <BookmarkCheck className="mr-1 h-4 w-4" /> : <Bookmark className="mr-1 h-4 w-4" />}
                {shortlisted ? "Shortlisted" : "Shortlist"}
              </Button>

              <Link
                to={`/recruiter/talent?student=${student.id}${params.get("plan") ? `&plan=${params.get("plan")}` : ""}`}
              >
                <Button variant="hero" className="rounded-full">
                  <MessageSquare className="mr-1 h-4 w-4" /> Message
                </Button>
              </Link>
            </div>

          </div>

          {/* Roadmap overview timeline */}
          <div className="mt-4 rounded-2xl border border-border bg-surface/40 p-4">
            <h2 className="font-display text-xl font-normal">Roadmap overview</h2>

            {journey.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No experiences found.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {journey.slice(0, 4).map((entry, idx) => (
                  <div key={`${entry.title}-${idx}`} className="flex gap-3">
                    <div className="relative flex w-2 justify-center">
                      <div className="h-2 w-2 translate-y-2 rounded-full bg-coral" />
                      {idx < Math.min(3, journey.length - 1) && (
                        <div className="absolute top-3 h-full w-px bg-border/70" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-secondary/30 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                          {entry.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-sm font-medium text-foreground">{entry.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>



        <div className="overflow-hidden rounded-2xl border border-border bg-card p-3">

          <div className="relative overflow-hidden rounded-xl border border-border">

            <img

              src={student.video.thumbnail}

              alt={`${student.name} video`}

              className="aspect-[9/16] w-full object-cover"

            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

            <span className="absolute bottom-12 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-foreground">

              <Play className="h-3.5 w-3.5" /> Play

            </span>

            <p className="absolute bottom-3 left-3 right-3 text-sm font-medium text-white">{student.video.caption}</p>

          </div>

        </div>

      </motion.section>



      <motion.section {...reveal}>

        <PremiumGate

          mode="blur"

          fallback={

            <div className="rounded-xl border border-border bg-card p-4 text-center">

              <p className="font-semibold text-coral">Premium</p>

              <p className="text-sm text-muted-foreground">Upgrade to see full experiences & evidence.</p>

            </div>

          }

        >

          <div className="leap-panel space-y-5 rounded-2xl border border-border bg-card p-5 md:p-6">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <h2 className="font-display text-2xl font-normal">Experiences</h2>

              <div className="inline-flex items-center gap-1 rounded-pill border border-border bg-muted/60 p-1">

                {PORTFOLIO_TABS.map((tab) => (

                  <button

                    key={tab}

                    type="button"

                    onClick={() => setTab(tab)}

                    className={cn(

                      "rounded-pill px-4 py-1.5 text-sm font-medium transition-colors",

                      activeTab === tab

                        ? "bg-background text-foreground shadow-sm"

                        : "text-muted-foreground hover:text-foreground",

                    )}

                  >

                    {tab}

                  </button>

                ))}

              </div>

            </div>



            {activeTab === "Videos" && (

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {pagedItems.map((item) => {

                  const video = item as NonNullable<typeof portfolio>["videos"][number];

                  return (

                    <div

                      key={video.id}

                      className="group overflow-hidden rounded-xl border border-border bg-surface"

                    >

                      <div className="relative aspect-[9/16] overflow-hidden">

                        <img

                          src={video.thumbnail}

                          alt={video.title}

                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"

                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold">

                          <Play className="h-3.5 w-3.5" /> Play

                        </span>

                      </div>

                      <div className="space-y-1 p-3">

                        <p className="line-clamp-2 text-sm font-medium">{video.title}</p>

                        {video.caption && <p className="text-xs text-muted-foreground">{video.caption}</p>}

                      </div>

                    </div>

                  );

                })}

              </div>

            )}



            {activeTab === "Photos" && (

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                {pagedItems.map((item) => {

                  const photo = item as NonNullable<typeof portfolio>["photos"][number];

                  return (

                    <div key={photo.id} className="overflow-hidden rounded-xl border border-border bg-surface">

                      <div className="aspect-square overflow-hidden">

                        <img

                          src={photo.url}

                          alt={photo.alt ?? photo.title}

                          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"

                        />

                      </div>

                      <p className="line-clamp-1 p-2 text-xs font-medium text-muted-foreground">{photo.title}</p>

                    </div>

                  );

                })}

              </div>

            )}



            {activeTab === "Logs" && (

              <div className="grid gap-4 sm:grid-cols-2">

                {pagedItems.map((item, idx) => {

                  const entry = item as NonNullable<typeof portfolio>["logs"][number];

                  return (

                    <div key={`${entry.title}-${idx}`} className="rounded-xl border border-border bg-surface p-4">

                      <div className="mb-3 flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-secondary/30 px-2.5 py-1 text-xs font-semibold">{entry.type}</span>

                        <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>

                      </div>

                      <div className="grid gap-3 sm:grid-cols-[96px_1fr]">

                        <img

                          src={entry.photo}

                          alt={entry.title}

                          className="h-20 w-full rounded-lg border border-border object-cover sm:h-24"

                        />

                        <div>

                          <h3 className="font-display text-lg font-normal leading-tight">{entry.title}</h3>

                          <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{entry.reflection}</p>

                        </div>

                      </div>

                    </div>

                  );

                })}

              </div>

            )}



            {activeItems.length === 0 && (

              <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted-foreground">

                No {activeTab.toLowerCase()} logged yet.

              </div>

            )}



            {totalPages > 1 && (

              <div className="flex items-center justify-between border-t border-border pt-4">

                <p className="text-xs text-muted-foreground">

                  Page {currentPage} of {totalPages} · {activeItems.length} items

                </p>

                <div className="flex items-center gap-2">

                  <Button

                    type="button"

                    variant="outline"

                    size="sm"

                    className="rounded-full"

                    disabled={currentPage <= 1}

                    onClick={() => setPageByTab((prev) => ({ ...prev, [activeTab]: currentPage - 1 }))}

                  >

                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous

                  </Button>

                  <Button

                    type="button"

                    variant="outline"

                    size="sm"

                    className="rounded-full"

                    disabled={currentPage >= totalPages}

                    onClick={() => setPageByTab((prev) => ({ ...prev, [activeTab]: currentPage + 1 }))}

                  >

                    Next <ChevronRight className="ml-1 h-4 w-4" />

                  </Button>

                </div>

              </div>

            )}

          </div>



          <div className="mt-6 space-y-6">

            <div className="leap-panel rounded-2xl border border-border bg-card p-5">

              <h2 className="font-display text-2xl font-normal">Journey timeline</h2>

              <div className="mt-4 space-y-4">

                {journey.map((entry, idx) => (

                  <div key={`${entry.title}-${idx}`} className="relative rounded-xl border border-border bg-surface p-4">

                    <div className="mb-3 flex flex-wrap items-center gap-2">

                      <span className="rounded-full bg-secondary/30 px-2.5 py-1 text-xs font-semibold">{entry.type}</span>

                      <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>

                    </div>

                    <div className="grid gap-3 md:grid-cols-[120px_1fr]">

                      <img

                        src={entry.photo}

                        alt={entry.title}

                        className="h-24 w-full rounded-lg border border-border object-cover"

                      />

                      <div>

                        <h3 className="font-display text-lg font-normal">{entry.title}</h3>

                        <p className="mt-1 text-sm text-muted-foreground">{entry.reflection}</p>

                        <div className="mt-3 flex flex-wrap gap-1.5">

                          {entry.skills.map((skill) => (

                            <span key={skill} className="rounded-full border border-coral/25 bg-secondary/20 px-2.5 py-1 text-xs font-semibold">

                              {skill}

                            </span>

                          ))}

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

            </div>



            <div className="grid gap-5 lg:grid-cols-2">

              <div className="leap-panel rounded-2xl border border-border bg-card p-5">

                <h2 className="font-display text-xl font-normal">Skills evidence</h2>

                <div className="mt-4 flex flex-wrap gap-2">

                  {skillEvidence.map(([skill, count]) => (

                    <span

                      key={skill}

                      className="rounded-full border border-coral/25 bg-secondary/20 px-3 py-1 text-xs font-semibold"

                      title={`${count} evidence point${count === 1 ? "" : "s"}`}

                    >

                      {skill} · {count}

                    </span>

                  ))}

                </div>

              </div>



              <div className="leap-panel rounded-2xl border border-border bg-card p-5">

                <h2 className="font-display text-xl font-normal">Builder signals</h2>

                <div className="mt-4 space-y-2">

                  <div

                    className={cn(

                      "rounded-xl border px-4 py-3 text-sm",

                      student.hasStartup ? "border-coral/40 bg-coral/10" : "border-border bg-surface text-muted-foreground",

                    )}

                  >

                    {student.hasStartup ? "Building a startup" : "No startup signal yet"}

                  </div>

                  <div

                    className={cn(

                      "rounded-xl border px-4 py-3 text-sm",

                      student.hasProjects ? "border-coral/40 bg-coral/10" : "border-border bg-surface text-muted-foreground",

                    )}

                  >

                    {student.hasProjects ? "Ships personal projects" : "No project signal yet"}

                  </div>

                </div>

              </div>

            </div>

          </div>

        </PremiumGate>

      </motion.section>

    </AnimatedPage>

  );

};



export default RecruiterStudentProfile;


