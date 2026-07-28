import { Link } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useRecruiter } from "@/components/recruiter/RecruiterContext";
import { students } from "@/data/students";
import { StudentCard } from "@/components/recruiter/StudentCard";
import { Button } from "@/components/ui/button";
import { Jumpy } from "@/components/Jumpy";

const RecruiterShortlist = () => {
  const { shortlist, isPremium } = useRecruiter();
  const shortlistedStudents = students.filter((s) => shortlist.includes(s.id));

  return (
    <AnimatedPage className="container py-8 md:py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-normal md:text-4xl">Shortlist</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your saved students for fast follow-up and outreach.</p>
        </div>
        {!isPremium && (
          <div className="rounded-full border border-coral/30 bg-secondary/30 px-3 py-1 text-xs font-semibold text-coral">
            {shortlist.length}/5 · Upgrade for unlimited
          </div>
        )}
      </div>

      {shortlistedStudents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
          <div className="mb-3 inline-flex">
            <Jumpy size="sm" animate="float" />
          </div>
          <h2 className="font-display text-2xl font-normal">No students shortlisted yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Browse discover and save standout students here.</p>
          <Link to="/recruiter/discover" className="mt-4 inline-flex">
            <Button variant="hero">Find students to shortlist</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shortlistedStudents.map((student) => (
            <StudentCard key={student.id} student={student} variant="grid" />
          ))}
        </div>
      )}
    </AnimatedPage>
  );
};

export default RecruiterShortlist;

