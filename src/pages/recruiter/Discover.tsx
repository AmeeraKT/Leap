import { useMemo, useState } from "react";
import { ChevronDown, Eye, EyeOff, SlidersHorizontal } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { students } from "@/data/students";
import { StudentCard } from "@/components/recruiter/StudentCard";
import { PremiumGate } from "@/components/recruiter/PremiumGate";
import { useRecruiter } from "@/components/recruiter/RecruiterContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type DegreeOption = (typeof students)[number]["degree"];
type PersonalityTrait = (typeof students)[number]["personalityTraits"][number];
type DiscoverVisibilityKey = "majors" | "skills" | "personality";

const RecruiterDiscover = () => {
  const { isPremium } = useRecruiter();

  const [degree, setDegree] = useState<DegreeOption | "all">("all");
  const [major, setMajor] = useState<string>("all");

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityTrait[]>([]);
  const [selectedSignals, setSelectedSignals] = useState<string[]>([]);
  const [year, setYear] = useState<number | null>(null);
  const [university, setUniversity] = useState<string>("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Record<DiscoverVisibilityKey, boolean>>({
    majors: true,
    skills: true,
    personality: true,
  });

  const degreeOptions = ["IT", "Computer Science", "Double Degree"] as const;

  const majorOptions = useMemo(
    () => ["all", ...new Set(students.flatMap((s) => s.majors)).values()],
    [],
  );
  const skillOptions = useMemo(
    () => [...new Set(students.flatMap((s) => s.skills)).values()],
    [],
  );
  const personalityOptions = useMemo(
    () => [...new Set(students.flatMap((s) => s.personalityTraits)).values()],
    [],
  );
  const universityOptions = useMemo(
    () => ["all", ...new Set(students.map((s) => s.university)).values()],
    [],
  );
  const signalOptions = [
    "has startup",
    "has projects",
    "club exec member",
    "student ambassador",
    "has large following",
    "course tutor",
    "had internships",
  ] as const;

  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (degree !== "all" && s.degree !== degree) return false;
      if (major !== "all" && !s.majors.includes(major)) return false;

      if (isPremium) {
        if (selectedSkills.length > 0 && !selectedSkills.every((skill) => s.skills.includes(skill))) {
          return false;
        }
        if (
          selectedPersonality.length > 0 &&
          !selectedPersonality.every((trait) => s.personalityTraits.includes(trait))
        ) {
          return false;
        }
        if (selectedSignals.length > 0 && !selectedSignals.every((signal) => s.signals.includes(signal))) {
          return false;
        }
        if (year !== null && s.year !== year) return false;
        if (university !== "all" && s.university !== university) return false;
      }

      return true;
    });
  }, [degree, isPremium, major, selectedPersonality, selectedSignals, selectedSkills, university, year]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((entry) => entry !== skill) : [...current, skill],
    );
  };

  const toggleSignal = (signal: string) => {
    setSelectedSignals((current) =>
      current.includes(signal) ? current.filter((entry) => entry !== signal) : [...current, signal],
    );
  };

  const togglePersonality = (trait: PersonalityTrait) => {
    setSelectedPersonality((current) =>
      current.includes(trait) ? current.filter((entry) => entry !== trait) : [...current, trait],
    );
  };

  const toggleVisibility = (section: DiscoverVisibilityKey) => {
    setVisibleSections((current) => ({ ...current, [section]: !current[section] }));
  };

  const renderSectionLabel = (label: string, section: DiscoverVisibilityKey) => {
    const visible = visibleSections[section];
    const Icon = visible ? Eye : EyeOff;

    return (
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <button
          type="button"
          onClick={() => toggleVisibility(section)}
          aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()} on student cards`}
          aria-pressed={!visible}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
            visible
              ? "border-border bg-surface text-muted-foreground hover:text-foreground"
              : "border-coral/30 bg-secondary/25 text-coral hover:bg-secondary/35",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const filtersPanel = (
    <aside className="space-y-4 rounded-2xl border border-border bg-card p-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Degree</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDegree("all")}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold",
              degree === "all"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface text-muted-foreground",
            )}
          >
            All
          </button>
          {degreeOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setDegree(opt)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold",
                degree === opt
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground",
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div>
        {renderSectionLabel("Majors", "majors")}
        <Select value={major} onValueChange={setMajor}>
          <SelectTrigger className="h-10 rounded-xl">
            <SelectValue placeholder="Select major" />
          </SelectTrigger>
          <SelectContent>
            {majorOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt === "all" ? "All majors" : opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PremiumGate
        fallback={
          <div className="rounded-xl border border-border bg-muted/20 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-coral">Premium filters</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlock skills, personality, year, university, and richer signals.
            </p>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            {renderSectionLabel("Skills", "skills")}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="h-10 w-full justify-between rounded-xl">
                  {selectedSkills.length > 0 ? `${selectedSkills.length} selected` : "All skills"}
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                <DropdownMenuItem onClick={() => setSelectedSkills([])}>All skills</DropdownMenuItem>
                <DropdownMenuSeparator />
                {skillOptions.map((skill) => (
                  <DropdownMenuCheckboxItem
                    key={skill}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={() => toggleSkill(skill)}
                  >
                    {skill}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            {renderSectionLabel("Personality", "personality")}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="h-10 w-full justify-between rounded-xl">
                  {selectedPersonality.length > 0 ? `${selectedPersonality.length} selected` : "All traits"}
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                <DropdownMenuItem onClick={() => setSelectedPersonality([])}>All traits</DropdownMenuItem>
                <DropdownMenuSeparator />
                {personalityOptions.map((trait) => (
                  <DropdownMenuCheckboxItem
                    key={trait}
                    checked={selectedPersonality.includes(trait)}
                    onCheckedChange={() => togglePersonality(trait)}
                  >
                    {trait}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Year</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setYear(null)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold",
                  year === null
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground",
                )}
              >
                All
              </button>
              {[1, 2, 3, 4].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-semibold",
                    year === y
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-surface text-muted-foreground",
                  )}
                >
                  Year {y}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">University</p>
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {universityOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt === "all" ? "All universities" : opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Signals</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button type="button" variant="outline" className="h-10 w-full justify-between rounded-xl">
                  {selectedSignals.length > 0 ? `${selectedSignals.length} selected` : "All signals"}
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem onClick={() => setSelectedSignals([])}>All signals</DropdownMenuItem>
                <DropdownMenuSeparator />
                {signalOptions.map((signal) => (
                  <DropdownMenuCheckboxItem
                    key={signal}
                    checked={selectedSignals.includes(signal)}
                    onCheckedChange={() => toggleSignal(signal)}
                  >
                    {signal
                      .split(" ")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </PremiumGate>
    </aside>
  );

  return (
    <AnimatedPage className="container space-y-6 py-8 md:py-10">
      <div>
        <h1 className="font-display text-3xl font-normal md:text-4xl">Discover Talent</h1>
        <p className="mt-2 text-sm text-muted-foreground">Filter and browse student profiles with live results.</p>
      </div>

      <div className="md:hidden">
        <Button type="button" variant="outline" className="w-full justify-between" onClick={() => setMobileFiltersOpen((v) => !v)}>
          Filters <SlidersHorizontal className="h-4 w-4" />
        </Button>
        {mobileFiltersOpen && <div className="mt-3">{filtersPanel}</div>}
      </div>

      <div className="grid gap-6 md:grid-cols-[290px_1fr]">
        <div className="hidden md:block">{filtersPanel}</div>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> students
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface p-8 text-center">
              <p className="font-display text-lg">No students match these filters</p>
              <p className="mt-2 text-sm text-muted-foreground">Try broadening your filters or resetting premium criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  variant="grid"
                  showMajors={visibleSections.majors}
                  showSkills={visibleSections.skills}
                  showPersonality={visibleSections.personality}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </AnimatedPage>
  );
};

export default RecruiterDiscover;

