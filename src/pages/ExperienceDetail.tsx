import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Linkedin,
  Instagram,
  Twitter,
  Video,
  FileText,
  Sparkles,
  Users,
  Target,
  ChevronDown,
  ImagePlus,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { useExperiences, experiencesStore } from "@/lib/experiences-store";
import { ContentStudioModal } from "@/components/ContentStudioModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type Format = "linkedin" | "instagram" | "tiktok" | "twitter" | "portfolio";

export type ContentVariant =
  | "default"
  | "seal"
  | "star"
  | "story"
  | "script"
  | "post"
  | "short-script";

const ExperienceDetail = () => {
  const { id } = useParams();
  const experiences = useExperiences();
  const exp = experiences.find((e) => e.id === id);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [chosenFormat, setChosenFormat] = useState<Format>("linkedin");
  const [chosenVariant, setChosenVariant] = useState<ContentVariant>("default");

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [impact, setImpact] = useState("");

  useEffect(() => {
    if (!exp) return;
    setTitle(exp.title);
    setDescription(exp.reflection);
    setLocation(exp.location ?? "");
    setImpact(exp.impact ?? "");
  }, [exp]);

  if (!exp) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Experience not found.</p>
        <Link to="/journey" className="mt-4 inline-block font-bold text-secondary">
          Back to Journey Log
        </Link>
      </div>
    );
  }

  const media = exp.media ?? (exp.photoUrl ? [{ url: exp.photoUrl, kind: "image" as const }] : []);

  const openStudio = (format: Format, variant: ContentVariant = "default") => {
    setChosenFormat(format);
    setChosenVariant(variant);
    setModalOpen(true);
  };

  const saveEdits = async () => {
    await experiencesStore.update(exp.id, {
      title: title.trim() || exp.title,
      reflection: description.trim() || exp.reflection,
      location: location.trim() || undefined,
      impact: impact.trim() || undefined,
    });
    setEditing(false);
    toast.success("Experience updated");
  };

  const cancelEdits = () => {
    setTitle(exp.title);
    setDescription(exp.reflection);
    setLocation(exp.location ?? "");
    setImpact(exp.impact ?? "");
    setEditing(false);
  };

  const onAddMedia = async (files: FileList | null) => {
    if (!files?.length) return;
    const nextItems: { url: string; kind: "image" | "video" }[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith("image/")) {
        nextItems.push({ url: URL.createObjectURL(file), kind: "image" });
      } else if (file.type.startsWith("video/")) {
        nextItems.push({ url: URL.createObjectURL(file), kind: "video" });
      } else {
        toast.error("Only photos and videos are supported.");
      }
    }
    if (!nextItems.length) return;

    const nextMedia = [...media, ...nextItems];
    const firstImage = nextItems.find((m) => m.kind === "image");
    await experiencesStore.update(exp.id, {
      media: nextMedia,
      photoUrl: exp.photoUrl || firstImage?.url || exp.photoUrl,
    });
    toast.success("Media added");
  };

  return (
    <div className="container max-w-4xl py-8 md:py-10">
      <Link
        to="/journey"
        className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Journey Log
      </Link>

      {/* Hero */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {exp.photoUrl && (
          <div className="aspect-[16/7] overflow-hidden bg-muted">
            <img src={exp.photoUrl} alt={exp.title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span className="rounded-full bg-secondary/30 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
              {exp.type}
            </span>
            <div className="flex flex-wrap gap-2">
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  onAddMedia(e.target.files);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-full"
                onClick={() => mediaInputRef.current?.click()}
              >
                <ImagePlus className="h-4 w-4" />
                Add media
              </Button>
              {!editing ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button type="button" variant="hero" size="sm" className="gap-1.5 rounded-full" onClick={saveEdits}>
                    <Check className="h-4 w-4" />
                    Save
                  </Button>
                  <Button type="button" variant="ghost" size="sm" className="gap-1.5 rounded-full" onClick={cancelEdits}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-3 h-12 font-display text-2xl md:text-3xl"
              aria-label="Experience title"
            />
          ) : (
            <h1 className="mt-3 font-display text-3xl font-normal md:text-4xl">{exp.title}</h1>
          )}

          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" /> {exp.date}
            </span>
            {editing ? (
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="h-8 max-w-[220px]"
              />
            ) : (
              exp.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {exp.location}
                </span>
              )
            )}
            {editing ? (
              <Input
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                placeholder="Impact"
                className="h-8 max-w-[220px]"
              />
            ) : (
              exp.impact && (
                <span className="inline-flex items-center gap-1">
                  <Target className="h-4 w-4 text-coral" /> {exp.impact}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Create bar */}
      <div className="my-6 flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-3">
        <span className="self-center pl-2 pr-1 font-display text-sm font-normal">✨ Create:</span>

        <button
          type="button"
          onClick={() => openStudio("linkedin")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all hover:-translate-y-0.5",
            exp.posted.linkedin
              ? "border-secondary/60 bg-secondary/15 text-foreground"
              : "border-border bg-background text-foreground hover:border-foreground/40",
          )}
        >
          <Linkedin className="h-3.5 w-3.5" />
          LinkedIn post
          {exp.posted.linkedin && <span className="text-[10px] text-secondary">✓</span>}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/40"
            >
              Interview format
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => openStudio("linkedin", "seal")}>SEAL</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openStudio("linkedin", "star")}>STAR</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all hover:-translate-y-0.5",
                exp.posted.instagram
                  ? "border-secondary/60 bg-secondary/15 text-foreground"
                  : "border-border bg-background text-foreground hover:border-foreground/40",
              )}
            >
              <Instagram className="h-3.5 w-3.5" />
              Instagram
              <ChevronDown className="h-3.5 w-3.5" />
              {exp.posted.instagram && <span className="text-[10px] text-secondary">✓</span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => openStudio("instagram", "story")}>Story</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openStudio("instagram", "script")}>Script</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openStudio("instagram", "post")}>Post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all hover:-translate-y-0.5",
                exp.posted.tiktok
                  ? "border-secondary/60 bg-secondary/15 text-foreground"
                  : "border-border bg-background text-foreground hover:border-foreground/40",
              )}
            >
              <Video className="h-3.5 w-3.5" />
              TikTok
              <ChevronDown className="h-3.5 w-3.5" />
              {exp.posted.tiktok && <span className="text-[10px] text-secondary">✓</span>}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => openStudio("tiktok", "post")}>Post</DropdownMenuItem>
            <DropdownMenuItem onClick={() => openStudio("tiktok", "short-script")}>
              Short-form script
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => openStudio("twitter")}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all hover:-translate-y-0.5",
            exp.posted.twitter
              ? "border-secondary/60 bg-secondary/15 text-foreground"
              : "border-border bg-background text-foreground hover:border-foreground/40",
          )}
        >
          <Twitter className="h-3.5 w-3.5" />
          X thread
          {exp.posted.twitter && <span className="text-[10px] text-secondary">✓</span>}
        </button>

        <button
          type="button"
          onClick={() => openStudio("portfolio")}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/40"
        >
          <FileText className="h-3.5 w-3.5" />
          Portfolio entry
        </button>
      </div>

      {/* Description */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-4 md:p-5">
        <h2 className="mb-2 font-display text-sm font-normal uppercase tracking-wider text-muted-foreground">
          Description
        </h2>
        {editing ? (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="min-h-[120px] resize-y"
            placeholder="Describe what happened at this event…"
          />
        ) : (
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {exp.reflection || "No description yet. Click Edit to add one."}
          </p>
        )}
      </div>

      {/* Media gallery */}
      <div className="mb-6 rounded-xl border border-border bg-surface p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-normal uppercase tracking-wider text-muted-foreground">
            Media
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-full"
            onClick={() => mediaInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
            Upload
          </Button>
        </div>
        {media.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No photos or videos yet. Use Add media to attach files for this experience.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {media.map((item, i) => (
              <div
                key={`${item.url}-${i}`}
                className="aspect-square overflow-hidden rounded-lg border border-border bg-muted"
              >
                {item.kind === "video" ? (
                  <video src={item.url} controls className="h-full w-full object-cover" />
                ) : (
                  <img src={item.url} alt="" className="h-full w-full object-cover" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content sections */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {exp.takeaways.length > 0 && (
            <Section icon="💡" title="Key takeaways">
              <ul className="space-y-2">
                {exp.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-secondary">▸</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {exp.peopleMet.length > 0 && (
            <Section icon="👥" title="People I met">
              <ul className="space-y-2">
                {exp.peopleMet.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl bg-background px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-normal">
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{p.name}</div>
                      {p.role && <div className="text-xs text-muted-foreground">{p.role}</div>}
                    </div>
                    {p.linkedin && (
                      <a href={p.linkedin} className="text-primary hover:opacity-70" aria-label="LinkedIn">
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="space-y-6">
          {exp.skills.length > 0 && (
            <Section icon={<Sparkles className="h-4 w-4 text-secondary" />} title="Skills gained">
              <div className="flex flex-wrap gap-1.5">
                {exp.skills.map((s, i) => (
                  <span key={i} className="rounded-full bg-secondary/20 px-2.5 py-1 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          <Section icon={<Users className="h-4 w-4 text-coral" />} title="At a glance">
            <dl className="space-y-1 text-sm">
              <Stat label="People met" value={exp.peopleMet.length} />
              <Stat label="Skills" value={exp.skills.length} />
              <Stat label="Media" value={media.length} />
              <Stat label="Posts shared" value={Object.values(exp.posted).filter(Boolean).length} />
            </dl>
          </Section>
        </div>
      </div>

      <ContentStudioModal
        experience={exp}
        initialFormat={chosenFormat}
        initialVariant={chosenVariant}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
};

const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-border bg-surface p-5">
    <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-normal uppercase tracking-wider text-muted-foreground">
      <span>{icon}</span> {title}
    </h2>
    {children}
  </section>
);

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="font-display font-normal">{value}</dd>
  </div>
);

export default ExperienceDetail;
