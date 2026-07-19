import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronsUpDown,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Jumpy } from "@/components/Jumpy";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { progressionStore } from "@/lib/progression-store";
import {
  CITY_SIZE_OPTIONS,
  COMMUTE_OPTIONS,
  DESIRED_FIELD_OPTIONS,
  EDUCATION_LEVELS,
  EMPLOYMENT_STATUSES,
  EXPERIENCE_OPTIONS,
  FLEXIBILITY_OPTIONS,
  INDUSTRY_OPTIONS,
  INTEREST_OPTIONS,
  PERSONALITY_PAIRS,
  QUIZ_SECTIONS,
  SALARY_OPTIONS,
  SKILL_OPTIONS,
  SOCIAL_ENV_OPTIONS,
  STUDYING_OPTIONS,
  TIMELINE_OPTIONS,
  WORK_LIFE_OPTIONS,
  YEAR_LEVELS,
  defaultQuiz,
  type QuizState,
} from "@/lib/quiz-types";
import { cn } from "@/lib/utils";

const TOTAL = QUIZ_SECTIONS.length;

const stepMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

function PillSelect({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-full border px-4 py-2 text-left text-sm font-semibold transition-all",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectDropdown({
  label,
  options,
  values,
  onChange,
  placeholder = "Select all that apply",
}: {
  label: string;
  options: readonly string[];
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const toggle = (opt: string) => {
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-auto min-h-11 w-full justify-between rounded-xl px-3 py-2 font-normal"
          >
            <span className={cn("truncate text-left text-sm", values.length === 0 && "text-muted-foreground")}>
              {values.length === 0 ? placeholder : values.join(", ")}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-72 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto" align="start">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Select all that apply</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {options.map((opt) => (
            <DropdownMenuCheckboxItem
              key={opt}
              checked={values.includes(opt)}
              onCheckedChange={() => toggle(opt)}
              onSelect={(e) => e.preventDefault()}
            >
              {opt}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-coral/10 px-2.5 py-0.5 text-xs font-semibold text-coral"
            >
              <Check className="h-3 w-3" />
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SortablePriorityItem({ id, label, index }: { id: string; label: string; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 touch-manipulation",
        isDragging && "z-10 border-coral shadow-md",
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-xs tabular-nums text-foreground">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">{label}</span>
      <button
        type="button"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={`Drag to reorder ${label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </li>
  );
}

const Quiz = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>(defaultQuiz);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const update = <K extends keyof QuizState>(key: K, value: QuizState[K]) => {
    setQuizState((prev) => ({ ...prev, [key]: value }));
  };

  const progress = ((step + 1) / TOTAL) * 100;
  const section = QUIZ_SECTIONS[step];

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return quizState.studyingAreas.length > 0;
      case 1:
        return Boolean(quizState.currentEducation && quizState.yearLevel);
      case 2:
        return Boolean(quizState.employmentStatus && quizState.industry && quizState.experience);
      case 3:
        return Boolean(
          quizState.desiredField &&
            quizState.salaryExpectation &&
            quizState.timeline &&
            quizState.flexibility,
        );
      case 4:
        return true;
      case 5:
        return Boolean(
          quizState.citySize &&
            quizState.socialEnv &&
            quizState.commute &&
            quizState.workLifeBalance,
        );
      default:
        return true;
    }
  }, [step, quizState]);

  const finish = () => {
    sessionStorage.setItem("leap-quiz", JSON.stringify(quizState));
    progressionStore.grantQuizComplete();
    toast.success("Quiz complete — finding your matches 🐸");
    navigate("/results");
  };

  const onNext = () => {
    if (!canNext) {
      toast.error("Pick an option to continue");
      return;
    }
    if (step >= TOTAL - 1) finish();
    else setStep((s) => s + 1);
  };

  const onBack = () => {
    if (step === 0) navigate("/");
    else setStep((s) => s - 1);
  };

  const onPriorityDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = quizState.priorities.indexOf(String(active.id));
    const newIndex = quizState.priorities.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    update("priorities", arrayMove(quizState.priorities, oldIndex, newIndex));
  };

  return (
    <AnimatedPage className="min-h-screen bg-background pb-28">
      <header className="container flex items-center justify-between py-5">
        <Link to="/" className="flex items-center gap-2">
          <Jumpy size="xs" animate="none" />
          <span className="font-display text-xl font-normal text-foreground">LEAP</span>
        </Link>
        <ThemeToggle />
      </header>

      <div className="container max-w-2xl">
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>
              Section {step + 1} of {TOTAL}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-coral"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={section.id} {...stepMotion} className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-normal text-foreground md:text-4xl">
                {section.title}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">{section.subtext}</p>
            </div>

            <div className="leap-panel space-y-6 rounded-2xl border border-border bg-card p-5 md:p-6">
              {step === 0 && (
                <>
                  <MultiSelectDropdown
                    label="What are you studying (or drawn to)?"
                    options={STUDYING_OPTIONS}
                    values={quizState.studyingAreas}
                    onChange={(v) => update("studyingAreas", v)}
                  />
                  <MultiSelectDropdown
                    label="Interests outside study (optional)"
                    options={INTEREST_OPTIONS}
                    values={quizState.interests}
                    onChange={(v) => update("interests", v)}
                    placeholder="Optional — helps us recommend events"
                  />
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label>Current education level</Label>
                    <PillSelect
                      options={EDUCATION_LEVELS}
                      value={quizState.currentEducation}
                      onChange={(v) => update("currentEducation", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>What year are you in?</Label>
                    <PillSelect
                      options={YEAR_LEVELS}
                      value={quizState.yearLevel}
                      onChange={(v) => update("yearLevel", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="field">Field of study</Label>
                    <Input
                      id="field"
                      value={quizState.currentField}
                      onChange={(e) => update("currentField", e.target.value)}
                      placeholder="e.g. Computer Science, Nursing, Commerce…"
                      className="rounded-xl"
                    />
                    <p className="text-xs text-muted-foreground">
                      Or leave blank and we&apos;ll use what you selected earlier.
                    </p>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Current employment status</Label>
                    <PillSelect
                      options={EMPLOYMENT_STATUSES}
                      value={quizState.employmentStatus}
                      onChange={(v) => update("employmentStatus", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current or most recent industry</Label>
                    <Select
                      value={quizState.industry || undefined}
                      onValueChange={(v) => update("industry", v)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRY_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Years of work experience</Label>
                    <PillSelect
                      options={EXPERIENCE_OPTIONS}
                      value={quizState.experience}
                      onChange={(v) => update("experience", v)}
                    />
                  </div>
                  <MultiSelectDropdown
                    label="Top skills"
                    options={SKILL_OPTIONS}
                    values={quizState.skills}
                    onChange={(v) => update("skills", v)}
                  />
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label>Desired career field</Label>
                    <Select
                      value={quizState.desiredField || undefined}
                      onValueChange={(v) => update("desiredField", v)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Pick your top match" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESIRED_FIELD_OPTIONS.map((o) => (
                          <SelectItem key={o} value={o}>
                            {o}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Salary expectations (first 5 years)</Label>
                    <PillSelect
                      options={SALARY_OPTIONS}
                      value={quizState.salaryExpectation}
                      onChange={(v) => update("salaryExpectation", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>When do you want to start your career?</Label>
                    <PillSelect
                      options={TIMELINE_OPTIONS}
                      value={quizState.timeline}
                      onChange={(v) => update("timeline", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Work flexibility preference</Label>
                    <PillSelect
                      options={FLEXIBILITY_OPTIONS}
                      value={quizState.flexibility}
                      onChange={(v) => update("flexibility", v)}
                    />
                  </div>
                </>
              )}

              {step === 4 && (
                <div className="space-y-7">
                  {PERSONALITY_PAIRS.map(([left, right], i) => (
                    <div key={left} className="space-y-3">
                      <div className="flex justify-between gap-3 text-xs font-semibold text-muted-foreground">
                        <span className="max-w-[45%] text-left">{left}</span>
                        <span className="max-w-[45%] text-right">{right}</span>
                      </div>
                      <Slider
                        value={[quizState.personality[i]]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={([v]) => {
                          const next = [...quizState.personality];
                          next[i] = v;
                          update("personality", next);
                        }}
                        className="[&_[role=slider]]:border-coral [&_.bg-primary]:bg-coral"
                      />
                    </div>
                  ))}
                </div>
              )}

              {step === 5 && (
                <>
                  <div className="space-y-2">
                    <Label>Where are you based / want to be?</Label>
                    <PillSelect
                      options={CITY_SIZE_OPTIONS}
                      value={quizState.citySize}
                      onChange={(v) => update("citySize", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Campus / social environment</Label>
                    <PillSelect
                      options={SOCIAL_ENV_OPTIONS}
                      value={quizState.socialEnv}
                      onChange={(v) => update("socialEnv", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Commute tolerance</Label>
                    <PillSelect
                      options={COMMUTE_OPTIONS}
                      value={quizState.commute}
                      onChange={(v) => update("commute", v)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Work–life balance priority</Label>
                    <PillSelect
                      options={WORK_LIFE_OPTIONS}
                      value={quizState.workLifeBalance}
                      onChange={(v) => update("workLifeBalance", v)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Rank your overall priorities</Label>
                    <p className="text-xs text-muted-foreground">Drag to rank what matters most to you.</p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onPriorityDragEnd}>
                      <SortableContext items={quizState.priorities} strategy={verticalListSortingStrategy}>
                        <ul className="space-y-2">
                          {quizState.priorities.map((p, i) => (
                            <SortablePriorityItem key={p} id={p} label={p} index={i} />
                          ))}
                        </ul>
                      </SortableContext>
                    </DndContext>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-background/95 backdrop-blur">
        <div className="container flex max-w-2xl items-center justify-between gap-3 py-4">
          <Button type="button" variant="ghost" onClick={onBack} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button type="button" variant="hero" onClick={onNext} className="gap-1.5" disabled={!canNext}>
            {step >= TOTAL - 1 ? "See my matches" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Quiz;
