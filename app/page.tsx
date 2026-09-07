"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Database,
  Github,
  Globe2,
  Layers3,
  Linkedin,
  Mail,
  ShieldCheck,
  Smartphone,
  Users,
} from "lucide-react";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";

type TravelDirection = -1 | 1;
type MotionMode = "idle" | "walk" | "dash";
type ScenePhase = "hidden" | "entering" | "visible" | "exiting";
type ViewMode = "explore" | "quick";

type FloorTheme = {
  edge: string;
  surface: string;
  patternA: string;
  patternB: string;
};

type Project = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  impact: string;
  stack: string[];
  status: string;
  role: string;
  problem: string;
  decisions: string[];
  outcome: string;
  proof: string[];
  externalHref?: string;
  externalLabel?: string;
  externalAction?: "visit" | "github";
  accent: string;
  sceneClass: string;
};

const projects: Project[] = [
  {
    number: "01",
    eyebrow: "Independent product · shipped",
    title: "Renewables",
    description:
      "A life-admin tracker that keeps passports, warranties, subscriptions, and recurring responsibilities from slipping through the cracks.",
    impact: "Production Flutter product · mobile, web, widgets, and reminders",
    stack: ["Flutter", "Riverpod", "Supabase", "RevenueCat"],
    status: "Shipped product",
    role: "Product design, Flutter engineering, backend integration, and release delivery",
    problem:
      "Important expirations are easy to forget because people only think about them when the document or subscription is already needed.",
    decisions: [
      "Kept the database as the canonical record while coordinating local and server notifications.",
      "Separated domain guards from UI state so plan limits and reminders stay consistent across platforms.",
      "Used deep links and home-screen widgets to shorten the path from an urgent reminder to action.",
    ],
    outcome:
      "Designed and shipped the complete product across Android and web workflows, including subscriptions, recurring renewals, attachments, localization, and device widgets.",
    proof: ["Cross-device change notifications", "Android and iOS widgets", "Timezone-aware reminders"],
    externalHref: "https://renewables.cubelated.com",
    externalLabel: "Visit product",
    externalAction: "visit",
    accent: "#f47b43",
    sceneClass: "scene-renewables",
  },
  {
    number: "02",
    eyebrow: "In development · privacy-first mobile",
    title: "Selah",
    description:
      "A quiet-time companion that guides people to pause, put the phone down, read a physical Bible, reflect, pray, and gradually need the app less.",
    impact: "Active development · encrypted, local-first, and intentionally private",
    stack: ["Flutter", "Drift", "Encrypted SQLite", "Riverpod"],
    status: "Active development",
    role: "Product strategy, interaction design, mobile architecture, privacy model, and implementation",
    problem:
      "Most devotional products compete for engagement. Selah needs to provide structure without replacing Scripture, prayer, or a sustainable offline habit.",
    decisions: [
      "Removed accounts, analytics, ads, social feeds, and spiritual scores from the product model.",
      "Encrypted the local Drift database and kept the key in platform secure storage.",
      "Designed a 40-day journey with fading guidance so successful use reduces dependence on the app.",
    ],
    outcome:
      "Built resumable guided sessions, a private journal, timezone-aware reminders, device authentication, and encrypted export and restore paths.",
    proof: ["AES-256-GCM export", "Secure local journal", "Android, iOS, and web architecture"],
    accent: "#72d6b1",
    sceneClass: "scene-flyfitnity",
  },
  {
    number: "03",
    eyebrow: "Full-stack coordination system",
    title: "IFGF Planner",
    description:
      "An Indonesian-first volunteer scheduling system for church coordinators, with availability collection, guarded assignments, and LINE group delivery.",
    impact: "End-to-end workflow · scheduling, security, export, and group messaging",
    stack: ["Next.js", "Supabase", "LINE API", "Cloudflare"],
    status: "Active product",
    role: "Workflow design, full-stack development, database security, integrations, and deployment",
    problem:
      "Coordinators were reconciling recurring services, volunteer eligibility, unavailability, schedules, and group reminders across disconnected manual steps.",
    decisions: [
      "Scoped every record by organization and enforced access with PostgreSQL Row Level Security.",
      "Stored share-link tokens as SHA-256 hashes and routed anonymous submissions through a validating Edge Function.",
      "Kept generated schedules as drafts until a coordinator explicitly publishes them.",
    ],
    outcome:
      "Connected recurring-event setup, availability forms, conflict-aware assignments, schedule images, LINE broadcasts, and configurable reminders in one responsive product.",
    proof: ["Organization-scoped RLS", "LINE group automation", "Draft and published versions"],
    externalHref: "https://github.com/cubelated/ifgf-planner",
    externalLabel: "View repository",
    externalAction: "github",
    accent: "#ffd166",
    sceneClass: "scene-learnalgo",
  },
  {
    number: "04",
    eyebrow: "Professional system · distributed architecture",
    title: "DCIM Platform",
    description:
      "A data-center infrastructure platform for device inventory, operating-system automation, monitoring, network controls, billing integration, and real-time operational updates.",
    impact: "Three data centers · 70+ devices in the initial prototype",
    stack: ["Flutter", "WebSockets", "Redis Pub/Sub", "PostgreSQL"],
    status: "Production system",
    role: "System architecture, Flutter and backend delivery, technical leadership, and production troubleshooting",
    problem:
      "Multiple clients and server instances needed fast, reliable operational updates without treating a transient connection as durable state.",
    decisions: [
      "Used PostgreSQL as the source of truth and WebSockets only as change notifications.",
      "Added Redis Pub/Sub to fan out updates safely across multiple server instances.",
      "Reconciled missed changes after reconnect using the client's last received timestamp, with manual synchronization as a recovery path.",
    ],
    outcome:
      "Architected the platform across three data centers, integrated more than 70 devices in the prototype, and supported production operations across 100+ client environments.",
    proof: ["Database reconciliation", "Multi-instance event fan-out", "Production recovery paths"],
    accent: "#c9a7ff",
    sceneClass: "scene-virtualclass",
  },
];

const chapters = [
  { label: "Start", scene: 0 },
  { label: "Mission", scene: 1 },
  { label: "Projects", scene: 2 },
  { label: "Experience", scene: 6 },
  { label: "Education", scene: 8 },
  { label: "Contact", scene: 9 },
];

const sceneNames = [
  "Start",
  "Mission",
  "Renewables",
  "Selah",
  "IFGF Planner",
  "DCIM Platform",
  "HostingInside",
  "Feng Chia University",
  "Education",
  "Contact",
];

const floorThemes: FloorTheme[] = [
  { edge: "#72d6b1", surface: "#2d2435", patternA: "#3b3045", patternB: "#211a29" },
  { edge: "#ad90c8", surface: "#33263e", patternA: "#4d3761", patternB: "#241a2e" },
  { edge: "#f47b43", surface: "#3a292c", patternA: "#5a3830", patternB: "#261b20" },
  { edge: "#5ed0bd", surface: "#21383a", patternA: "#315355", patternB: "#17292b" },
  { edge: "#ffd166", surface: "#3d3324", patternA: "#5c4c2e", patternB: "#292219" },
  { edge: "#c9a7ff", surface: "#342a45", patternA: "#514068", patternB: "#241d31" },
  { edge: "#ef765c", surface: "#252d3e", patternA: "#35445d", patternB: "#192131" },
  { edge: "#75c99d", surface: "#2b3840", patternA: "#405760", patternB: "#1d292f" },
  { edge: "#d7b067", surface: "#3b3036", patternA: "#59464d", patternB: "#281f24" },
  { edge: "#9f80e5", surface: "#29233c", patternA: "#41365d", patternB: "#1c172a" },
];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const QUICK_PRESS_MS = 230;
const DOUBLE_RELEASE_MS = 380;
const SECTION_SPACING = 1.48;
const SECTION_ACTIVE_RADIUS = 0.4;
const SCENE_FADE_MS = 620;
const CHAPTER_TOAST_MS = 3200;
const scenePosition = (scene: number) => scene * SECTION_SPACING;
const slugify = (value: string) => value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");

const characterSprites = [
  { state: "idle", src: "/knight/idle-breathing-south.gif" },
  { state: "walk-south-east", src: "/knight/walking-south-east.gif" },
  { state: "walk-south-west", src: "/knight/walking-south-west.gif" },
  { state: "dash-south-east", src: "/knight/dash-south-east.png" },
  { state: "dash-south-west", src: "/knight/dash-south-west.png" },
];

const PixelCharacter = memo(function PixelCharacter({
  direction,
  mode,
}: {
  direction: TravelDirection;
  mode: MotionMode;
}) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const state = mode === "idle" ? "idle" : `${mode}-${direction === -1 ? "south-west" : "south-east"}`;
  const ready = loaded[state] === true;

  return (
    <div className="character-stage" data-direction={direction} data-motion={mode} aria-hidden="true">
      <div className="dash-trail trail-one" />
      <div className="dash-trail trail-two" />
      <div className="knight-shadow" />
      <div className="knight-sprite-wrap">
        <img className="knight-sprite knight-sprite-fallback" src="/knight/idle-south.png"
          data-active={!ready} alt="" width={128} height={128} draggable={false} />
        {characterSprites.map((sprite) => (
          <img key={sprite.state} className="knight-sprite knight-sprite-animated"
            src={sprite.src} data-active={ready && state === sprite.state}
            onLoad={() => setLoaded((current) => ({ ...current, [sprite.state]: true }))}
            onError={() => setLoaded((current) => ({ ...current, [sprite.state]: false }))}
            alt="" width={128} height={128} loading="eager" draggable={false} />
        ))}
      </div>
      <div className="dust dust-one" />
      <div className="dust dust-two" />
      <div className="dust dust-three" />
    </div>
  );
});

function ActionIcon({ action }: { action?: Project["externalAction"] }) {
  if (action === "github") return <Github size={16} />;
  return <ArrowUpRight size={16} />;
}

function ProjectScene({
  project,
  index,
  sceneStyle,
  phase,
  onOpenCaseStudy,
}: {
  project: Project;
  index: number;
  sceneStyle: CSSProperties;
  phase: ScenePhase;
  onOpenCaseStudy: (project: Project) => void;
}) {
  const projectId = slugify(project.title);

  return (
    <section
      id={projectId}
      className={`game-scene project-scene ${project.sceneClass}`}
      data-scene-phase={phase}
      aria-labelledby={`${projectId}-title`}
      aria-hidden={phase !== "visible"}
      inert={phase !== "visible"}
      style={{ ...sceneStyle, "--project-accent": project.accent } as CSSProperties}
    >
      <div className="pixel-sky-detail">
        <span className="pixel-cloud cloud-a" />
        <span className="pixel-cloud cloud-b" />
      </div>

      <article className="scene-panel project-panel panel-scroll" tabIndex={0}>
        <div className="panel-index">
          <span>PROJECT LOG</span>
          <strong>{project.number}/04</strong>
        </div>
        <div className="project-heading-row">
          <p className="scene-eyebrow">{project.eyebrow}</p>
          <span className="project-status">{project.status}</span>
        </div>
        <h2 id={`${projectId}-title`}>{project.title}</h2>
        <p className="project-description">{project.description}</p>
        <p className="impact-line">
          <span aria-hidden="true">◆</span>
          {project.impact}
        </p>
        <p className="project-role"><strong>MY ROLE</strong>{project.role}</p>
        <ul className="pixel-tags" aria-label={`${project.title} technologies`}>
          {project.stack.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <div className="project-actions">
          <button className="pixel-action" onClick={() => onOpenCaseStudy(project)}>
            OPEN CASE STUDY <ArrowUpRight size={14} />
          </button>
          {project.externalHref && (
            <a
              className="text-action"
              href={project.externalHref}
              target="_blank"
              rel="noreferrer"
            >
              <ActionIcon action={project.externalAction} />
              {project.externalLabel}
            </a>
          )}
        </div>
      </article>

      <div className="project-beacon" aria-hidden="true">
        <span>{project.number}</span>
        <i />
      </div>
      <div className={`world-prop project-prop prop-${index}`} aria-hidden="true">
        <span />
        <i />
      </div>
    </section>
  );
}

function PixelGround({
  theme,
  scene,
}: {
  theme: FloorTheme;
  scene: number;
}) {
  return (
    <div
      className="pixel-ground"
      data-floor-scene={scene}
      style={
        {
          "--floor-edge": theme.edge,
          "--floor-surface": theme.surface,
          "--floor-pattern-a": theme.patternA,
          "--floor-pattern-b": theme.patternB,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="ground-edge" />
      <div className="ground-pattern" />
    </div>
  );
}

const achievements = [
  { value: "6", label: "Engineers led", detail: "Architecture, reviews, mentoring, and delivery" },
  { value: "3", label: "Data centers", detail: "DCIM architecture and infrastructure automation" },
  { value: "100+", label: "Client environments", detail: "Linux, networking, and production troubleshooting" },
  { value: "80%", label: "Efficiency improvement", detail: "POS modernization and workflow automation" },
  { value: "200+", label: "Student users", detail: "Dockerized Flutter and Next.js education system" },
];

const expertiseAreas = [
  {
    icon: "mobile",
    title: "Mobile Engineering",
    summary: "Cross-platform applications built for reliable everyday use.",
    skills: ["Flutter", "Dart", "Kotlin", "Riverpod", "Android & iOS lifecycle", "Widgets", "Deep links"],
    evidence: ["Renewables", "Selah", "Feng Chia Economics app"],
  },
  {
    icon: "backend",
    title: "Backend & Distributed Systems",
    summary: "Reliable state, event delivery, recovery paths, and security boundaries.",
    skills: ["PostgreSQL", "Supabase", "WebSockets", "Redis Pub/Sub", "Edge Functions", "RLS"],
    evidence: ["DCIM Platform", "Renewables", "IFGF Planner"],
  },
  {
    icon: "infra",
    title: "Web & Infrastructure",
    summary: "Web applications and infrastructure built for deployment, maintenance, and growth.",
    skills: ["React", "Next.js", "Cloudflare", "Docker", "Linux", "Network troubleshooting", "CI/CD"],
    evidence: ["IFGF Planner", "HostingInside platforms", "VirtualClass"],
  },
  {
    icon: "leadership",
    title: "Product & Technical Leadership",
    summary: "Translating complex requirements into practical products and clear delivery plans.",
    skills: ["System design", "Product discovery", "Code review", "Mentoring", "Delivery planning", "Production support"],
    evidence: ["Six-engineer team", "Independent products", "Four-person university team"],
  },
];

const archiveProjects = [
  {
    title: "Flyfitnity",
    detail: "Award-winning Flutter and Raspberry Pi fitness system with real-time Bluetooth feedback.",
    href: "https://github.com/cubelated/flyfitnity_bluetooth_connection",
    label: "Repository",
  },
  {
    title: "LearnAlgo",
    detail: "Master's research translating embodied cognition into an interactive algorithm-learning experience.",
    href: "https://www.youtube.com/watch?v=ATqbLGN2ZBk&list=PLM97qnUGt3wg2bZ5MLHqysTbSy3SXrm1i",
    label: "Demo",
  },
  {
    title: "VirtualClass",
    detail: "Excellence Award team project for collaborative remote English learning, used by 200+ students.",
    href: "https://youtu.be/DH1pCYupwNM?si=Ty1wVrY7K6U-fRbY",
    label: "Demo",
  },
];

function ExpertiseIcon({ icon }: { icon: string }) {
  if (icon === "mobile") return <Smartphone aria-hidden="true" />;
  if (icon === "backend") return <Database aria-hidden="true" />;
  if (icon === "infra") return <Layers3 aria-hidden="true" />;
  return <Users aria-hidden="true" />;
}

function QuickPortfolio({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="quick-portfolio" id="quick-start">
      <header className="quick-header">
        <a className="quick-brand" href="#quick-start" aria-label="Hanssen portfolio home">
          <img src="/cubelated-pixel-logo.png" alt="" />
          <span><strong>HANSSEN WIJAYA</strong><small>SOFTWARE ENGINEER</small></span>
        </a>
        <nav aria-label="Quick portfolio navigation">
          <a href="#selected-work">Work</a>
          <a href="#skill-tree">Expertise</a>
          <a href="#career-map">Experience</a>
          <a href="#current-quest">Building now</a>
          <a href="#quick-contact">Contact</a>
        </nav>
        <button className="view-switch" onClick={onExplore}>
          EXPLORE MODE <ArrowRight size={15} />
        </button>
      </header>

      <div className="quick-content">
        <section className="quick-hero" aria-labelledby="quick-title">
          <div className="quick-hero-copy">
            <p className="quick-kicker">SOFTWARE ENGINEER · MOBILE · DISTRIBUTED SYSTEMS</p>
            <h1 id="quick-title" tabIndex={-1}>MOBILE PRODUCTS. RELIABLE SYSTEMS. BUILT WITH PURPOSE.</h1>
            <p>
              I&apos;m Hanssen Budisantoso Wijaya, a software engineer focused on Flutter,
              Android, full-stack products, and infrastructure. I turn complex operational
              problems into dependable, accessible software.
            </p>
            <div className="quick-actions">
              <a className="quick-button primary" href="#selected-work">VIEW SELECTED WORK <ArrowRight size={16} /></a>
              <button className="quick-button secondary" onClick={onExplore}>EXPLORE THE PORTFOLIO</button>
              <a className="quick-text-link" href="https://www.linkedin.com/in/hanssen-budisantoso-wijaya/" target="_blank" rel="noreferrer">
                LINKEDIN <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
          <figure className="quick-profile">
            <img src="/hanssen-profile.jpg" alt="Hanssen Budisantoso Wijaya" />
            <figcaption><span /> AVAILABLE FOR SOFTWARE ENGINEERING OPPORTUNITIES</figcaption>
          </figure>
        </section>

        <section className="achievement-strip" aria-label="Professional achievements">
          {achievements.map((achievement) => (
            <article key={achievement.label}>
              <strong>{achievement.value}</strong>
              <span>{achievement.label}</span>
              <p>{achievement.detail}</p>
            </article>
          ))}
        </section>

        <section className="quick-section" id="selected-work" aria-labelledby="selected-work-title">
          <div className="section-heading">
            <div><p>QUEST LOG</p><h2 id="selected-work-title">SELECTED WORK</h2></div>
            <span>Selected projects, with the problems, technical decisions, and outcomes behind each one.</span>
          </div>

          <div className="case-study-list">
            {projects.map((project) => (
              <article
                className="case-study"
                id={`case-${slugify(project.title)}`}
                key={project.title}
                style={{ "--project-accent": project.accent } as CSSProperties}
              >
                <div className="case-study-topline">
                  <span>{project.number}</span>
                  <p>{project.eyebrow}</p>
                  <strong>{project.status}</strong>
                </div>
                <div className="case-study-intro">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <ul aria-label={`${project.title} technology stack`}>
                    {project.stack.map((technology) => <li key={technology}>{technology}</li>)}
                  </ul>
                </div>
                <div className="case-study-grid">
                  <div><span>PROBLEM</span><p>{project.problem}</p></div>
                  <div><span>MY ROLE</span><p>{project.role}</p></div>
                  <div className="decision-card">
                    <span>KEY ENGINEERING DECISIONS</span>
                    <ol>{project.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ol>
                  </div>
                  <div><span>OUTCOME</span><p>{project.outcome}</p></div>
                </div>
                {project.title === "DCIM Platform" && (
                  <div className="architecture-block">
                    <div className="architecture-copy">
                      <span>DECISION SPOTLIGHT</span>
                      <h4>Responsive updates. Recoverable state.</h4>
                      <p>The database owns state; the real-time layer only announces that state changed. Reconnection reconciles anything the client missed.</p>
                    </div>
                    <div className="architecture-flow" role="img" aria-label="DCIM update flow from Flutter clients through the API and PostgreSQL, then WebSockets and Redis Pub/Sub back to clients">
                      <span>Flutter clients</span><i>write</i><span>API + PostgreSQL</span><i>notify</i><span>WebSocket gateway</span><i>fan out</i><span>Redis Pub/Sub</span>
                    </div>
                  </div>
                )}
                <div className="case-study-footer">
                  <ul>{project.proof.map((item) => <li key={item}><CheckCircle2 size={15} />{item}</li>)}</ul>
                  {project.externalHref ? (
                    <a href={project.externalHref} target="_blank" rel="noreferrer">
                      <ActionIcon action={project.externalAction} /> {project.externalLabel} <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <span className="private-code"><ShieldCheck size={15} /> Private or proprietary source</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="quick-section" id="skill-tree" aria-labelledby="skill-tree-title">
          <div className="section-heading">
            <div><p>SKILL TREE</p><h2 id="skill-tree-title">ENGINEERING EXPERTISE</h2></div>
            <span>Core capabilities developed through shipped products and production systems.</span>
          </div>
          <div className="expertise-grid">
            {expertiseAreas.map((area) => (
              <article key={area.title}>
                <div className="expertise-title"><ExpertiseIcon icon={area.icon} /><h3>{area.title}</h3></div>
                <p>{area.summary}</p>
                <ul className="expertise-skills">{area.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                <div className="expertise-proof"><span>APPLIED IN</span>{area.evidence.map((item) => <strong key={item}>{item}</strong>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="current-quest" id="current-quest" aria-labelledby="current-quest-title">
          <div className="current-quest-label"><span /> CURRENT QUEST · SELAH</div>
          <div>
            <p>BUILDING IN PUBLIC</p>
            <h2 id="current-quest-title">MORE TIME IN SCRIPTURE. LESS TIME ON YOUR PHONE.</h2>
          </div>
          <div className="current-quest-copy">
            <p>Selah helps people prepare for devotional time, read a physical Bible, reflect, and pray.</p>
            <ul>
              <li>Encrypted, local-first private journal</li>
              <li>Resumable guided sessions and 40-day formation journey</li>
              <li>Current focus: release readiness, visual motion, and session polish</li>
            </ul>
          </div>
          <a href="#case-selah">READ THE CASE STUDY <ArrowUpRight size={15} /></a>
        </section>

        <section className="quick-section" id="career-map" aria-labelledby="career-title">
          <div className="section-heading">
            <div><p>CAREER MAP</p><h2 id="career-title">EXPERIENCE &amp; EDUCATION</h2></div>
            <span>From hands-on production support to architecture and team leadership.</span>
          </div>
          <div className="career-layout">
            <div className="career-timeline">
              <article>
                <time>JUN 2024 — MAY 2026</time>
                <div><p>HOSTINGINSIDE LTD</p><h3>Lead Software Engineer</h3><ul><li>Led six engineers across infrastructure and multi-platform products.</li><li>Architected a DCIM platform spanning three data centers.</li><li>Led a multi-OS POS SaaS modernization that improved operational efficiency by 80%.</li></ul></div>
              </article>
              <article>
                <time>MAY 2022 — MAY 2024</time>
                <div><p>HOSTINGINSIDE LTD</p><h3>Software Engineer</h3><ul><li>Built infrastructure automation and operational tools.</li><li>Integrated 70+ devices into the first DCIM prototype.</li><li>Resolved Linux and networking issues across 100+ client environments.</li></ul></div>
              </article>
              <article>
                <time>SEP 2022 — JAN 2024</time>
                <div><p>FENG CHIA UNIVERSITY</p><h3>Software Maintainer</h3><ul><li>Maintained and released the university Flutter Economics application.</li></ul></div>
              </article>
            </div>
            <aside className="education-stack">
              <article><span>MSc · 2024</span><h3>Information Engineering &amp; Computer Science</h3><p>Feng Chia University</p><strong>Rank 7 / 49 · GPA 4.1 / 5.0</strong></article>
              <article><span>BSc · 2022</span><h3>Information Engineering &amp; Computer Science</h3><p>Feng Chia University</p><strong>GPA 3.8 / 4.0</strong></article>
            </aside>
          </div>
        </section>

        <section className="quick-section engineering-notes" aria-labelledby="notes-title">
          <div className="section-heading">
            <div><p>ENGINEERING NOTES</p><h2 id="notes-title">HOW I MAKE TRADE-OFFS</h2></div>
            <span>Short decision records from real products and systems.</span>
          </div>
          <div className="notes-grid">
            <article><Code2 /><span>REAL-TIME SYSTEMS</span><h3>Keep state recoverable.</h3><p>WebSockets make change visible quickly; PostgreSQL makes it recoverable. That distinction shaped reconnection and synchronization.</p></article>
            <article><ShieldCheck /><span>PRIVACY</span><h3>Design privacy into the product.</h3><p>Selah keeps sensitive journals local, encrypts storage, and gives the user an explicit encrypted export instead of silent cloud collection.</p></article>
            <article><Globe2 /><span>PUBLIC WORKFLOWS</span><h3>Validate every shared link.</h3><p>IFGF Planner hashes share tokens, validates them server-side, and keeps privileged database operations away from anonymous browsers.</p></article>
          </div>
        </section>

        <section className="quick-section" aria-labelledby="archive-title">
          <div className="section-heading">
            <div><p>PROJECT ARCHIVE</p><h2 id="archive-title">EARLIER BUILDS</h2></div>
            <span>Research, IoT, and collaborative learning work that shaped the systems I build now.</span>
          </div>
          <div className="archive-grid">
            {archiveProjects.map((project) => (
              <article key={project.title}><h3>{project.title}</h3><p>{project.detail}</p><a href={project.href} target="_blank" rel="noreferrer">{project.label} <ArrowUpRight size={14} /></a></article>
            ))}
          </div>
        </section>

        <section className="quick-contact" id="quick-contact" aria-labelledby="quick-contact-title">
          <p>FINAL CHECKPOINT</p>
          <h2 id="quick-contact-title">HAVE A MEANINGFUL PROBLEM TO SOLVE?</h2>
          <span>I&apos;m open to software engineering opportunities involving mobile products, distributed systems, and complex operational workflows.</span>
          <div>
            <a className="quick-button primary" href="mailto:hanssenbudi@gmail.com"><Mail size={16} /> EMAIL ME</a>
            <a className="quick-button secondary" href="https://github.com/cubelated" target="_blank" rel="noreferrer"><Github size={16} /> GITHUB</a>
            <a className="quick-button secondary" href="https://www.linkedin.com/in/hanssen-budisantoso-wijaya/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LINKEDIN</a>
          </div>
          <small>© {new Date().getFullYear()} HANSSEN BUDISANTOSO WIJAYA · BUILD WITH PURPOSE</small>
        </section>
      </div>
    </div>
  );
}

export default function Home() {
  const lastScene = sceneNames.length - 1;
  const maxPosition = scenePosition(lastScene);
  const [viewMode, setViewMode] = useState<ViewMode>("explore");
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState<TravelDirection>(1);
  const [motion, setMotion] = useState<MotionMode>("idle");
  const [scenePhases, setScenePhases] = useState<ScenePhase[]>(() =>
    sceneNames.map((_, index) => (index === 0 ? "visible" : "hidden")),
  );
  const [chapterToast, setChapterToast] = useState<{
    label: string;
    sequence: number;
  } | null>(null);
  const [hasResolvedInitialHash, setHasResolvedInitialHash] = useState(false);
  const animationFrame = useRef<number | null>(null);
  const sceneTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const chapterToastFrame = useRef<number | null>(null);
  const chapterToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousActiveScene = useRef<number | null>(0);
  const previousChapter = useRef<string | null>(null);
  const positionRef = useRef(0);
  const targetRef = useRef(0);
  const heldDirection = useRef<TravelDirection | null>(null);
  const pressedKeys = useRef(new Map<string, TravelDirection>());
  const walkStartedAt = useRef(0);
  const lastQuickRelease = useRef<{
    direction: TravelDirection;
    time: number;
  } | null>(null);
  const lastInput = useRef<{ direction: TravelDirection; time: number }>({
    direction: 1,
    time: 0,
  });
  const lastWheel = useRef(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const setWorldPosition = useCallback((nextPosition: number) => {
    positionRef.current = nextPosition;
    setPosition(nextPosition);
  }, []);

  const setPortfolioView = useCallback((nextView: ViewMode) => {
    heldDirection.current = null;
    pressedKeys.current.clear();
    pointerStart.current = null;
    lastQuickRelease.current = null;
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = null;
    targetRef.current = positionRef.current;
    setMotion("idle");
    setViewMode(nextView);
    requestAnimationFrame(() => {
      const destination = nextView === "quick" ? document.getElementById("quick-title") : document.querySelector<HTMLElement>(".pixel-brand");
      destination?.focus({ preventScroll: true });
    });
    window.history.replaceState(null, "", nextView === "quick" ? "#quick-start" : `#${slugify(sceneNames[Math.round(positionRef.current / SECTION_SPACING)])}`);
    try {
      window.localStorage.setItem("portfolio-view", nextView);
    } catch {
      // The view toggle still works when storage is unavailable.
    }
  }, []);

  const openCaseStudy = useCallback(
    (project: Project) => {
      setPortfolioView("quick");
      window.history.replaceState(null, "", `#case-${slugify(project.title)}`);
      requestAnimationFrame(() => {
        document.getElementById(`case-${slugify(project.title)}`)?.scrollIntoView({ block: "start" });
      });
    },
    [setPortfolioView],
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const quickHash = hash.startsWith("case-") || ["quick-start", "selected-work", "skill-tree", "career-map", "current-quest", "quick-contact"].includes(hash);
    let savedView: string | null = null;
    try {
      savedView = window.localStorage.getItem("portfolio-view");
    } catch {
      savedView = null;
    }
    if (!quickHash && savedView !== "quick") return;
    let scrollFrame: number | null = null;
    const viewFrame = requestAnimationFrame(() => {
      setViewMode("quick");
      if (quickHash) scrollFrame = requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
    });
    return () => {
      cancelAnimationFrame(viewFrame);
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame);
    };
  }, []);

  const animateTo = useCallback(
    (rawTarget: number, duration: number, nextMotion: MotionMode) => {
      const target = clamp(rawTarget, 0, maxPosition);
      const start = positionRef.current;
      const distance = target - start;

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      animationFrame.current = null;
      heldDirection.current = null;
      targetRef.current = target;
      if (Math.abs(distance) < 0.001 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setWorldPosition(target);
        setMotion("idle");
        return;
      }

      setDirection(distance > 0 ? 1 : -1);
      setMotion(nextMotion);
      const startedAt = performance.now();

      const tick = (now: number) => {
        const elapsed = clamp((now - startedAt) / duration, 0, 1);
        const eased =
          nextMotion === "dash"
            ? 1 - Math.pow(1 - elapsed, 4)
            : elapsed < 0.5
              ? 4 * elapsed * elapsed * elapsed
              : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
        setWorldPosition(start + distance * eased);

        if (elapsed < 1) {
          animationFrame.current = requestAnimationFrame(tick);
          return;
        }

        animationFrame.current = null;
        setWorldPosition(target);
        setMotion("idle");
        const targetScene = clamp(
          Math.round(target / SECTION_SPACING),
          0,
          lastScene,
        );
        window.history.replaceState(
          null,
          "",
          `#${sceneNames[targetScene].toLowerCase().replaceAll(" ", "-")}`,
        );
      };

      animationFrame.current = requestAnimationFrame(tick);
    },
    [lastScene, maxPosition, setWorldPosition],
  );

  const stopWalking = useCallback(() => {
    heldDirection.current = null;
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    setMotion("idle");
  }, []);

  const startWalking = useCallback(
    (nextDirection: TravelDirection) => {
      const atRequestedEdge =
        (nextDirection === -1 && positionRef.current <= 0.001) ||
        (nextDirection === 1 && positionRef.current >= maxPosition - 0.001);
      if (atRequestedEdge) {
        stopWalking();
        return;
      }

      if (
        heldDirection.current === nextDirection &&
        animationFrame.current !== null
      ) {
        return;
      }

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      heldDirection.current = nextDirection;
      setDirection(nextDirection);
      setMotion("walk");
      walkStartedAt.current = performance.now();
      let previousTime = walkStartedAt.current;

      const tick = (now: number) => {
        if (heldDirection.current === null) return;

        const elapsedSeconds = Math.min((now - previousTime) / 1000, 0.05);
        previousTime = now;
        const nextPosition = clamp(
          positionRef.current + heldDirection.current * elapsedSeconds * 0.72,
          0,
          maxPosition,
        );
        setWorldPosition(nextPosition);

        const reachedEdge =
          (nextPosition === 0 && heldDirection.current === -1) ||
          (nextPosition === maxPosition && heldDirection.current === 1);
        if (reachedEdge) {
          stopWalking();
          return;
        }

        animationFrame.current = requestAnimationFrame(tick);
      };

      animationFrame.current = requestAnimationFrame(tick);
    },
    [maxPosition, setWorldPosition, stopWalking],
  );

  const finishWalkingInput = useCallback(
    (releasedDirection: TravelDirection) => {
      if (releasedDirection !== heldDirection.current) return;

      const now = performance.now();
      const pressDuration = now - walkStartedAt.current;
      stopWalking();

      if (pressDuration > QUICK_PRESS_MS) {
        lastQuickRelease.current = null;
        return;
      }

      const previousRelease = lastQuickRelease.current;
      const isDoubleRelease =
        previousRelease?.direction === releasedDirection &&
        now - previousRelease.time <= DOUBLE_RELEASE_MS;

      if (!isDoubleRelease) {
        lastQuickRelease.current = {
          direction: releasedDirection,
          time: now,
        };
        return;
      }

      lastQuickRelease.current = null;
      const atRequestedEdge =
        (releasedDirection === -1 && positionRef.current <= 0.001) ||
        (releasedDirection === 1 &&
          positionRef.current >= maxPosition - 0.001);
      if (atRequestedEdge) return;

      const currentScene = clamp(
        Math.round(positionRef.current / SECTION_SPACING),
        0,
        lastScene,
      );
      const dashTarget = scenePosition(
        clamp(currentScene + releasedDirection, 0, lastScene),
      );
      animateTo(dashTarget, 320, "dash");
    },
    [animateTo, lastScene, maxPosition, stopWalking],
  );

  const travel = useCallback(
    (nextDirection: TravelDirection) => {
      const atRequestedEdge =
        (nextDirection === -1 && positionRef.current <= 0.001) ||
        (nextDirection === 1 && positionRef.current >= maxPosition - 0.001);
      if (atRequestedEdge) return;

      const now = performance.now();
      const isDoubleTap =
        lastInput.current.direction === nextDirection &&
        now - lastInput.current.time < 310;
      const currentScene = clamp(
        Math.round(positionRef.current / SECTION_SPACING),
        0,
        lastScene,
      );
      const normalTarget = scenePosition(
        clamp(currentScene + nextDirection, 0, lastScene),
      );

      setDirection(nextDirection);

      if (isDoubleTap) {
        const dashTarget =
          Math.abs(targetRef.current - positionRef.current) > 0.001
            ? targetRef.current
            : normalTarget;
        animateTo(dashTarget, 320, "dash");
        lastInput.current = { direction: nextDirection, time: 0 };
        return;
      }

      animateTo(normalTarget, 760, "walk");
      lastInput.current = { direction: nextDirection, time: now };
    },
    [animateTo, lastScene, maxPosition],
  );

  const jumpTo = useCallback(
    (scene: number) => {
      const target = scenePosition(scene);
      const distance = Math.abs(target - positionRef.current);
      animateTo(target, clamp(300 + distance * 90, 360, 1100), "dash");
    },
    [animateTo],
  );

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const initialScene = sceneNames.findIndex(
      (name) => name.toLowerCase().replaceAll(" ", "-") === hash,
    );
    const initialPosition =
      initialScene > 0 ? scenePosition(initialScene) : positionRef.current;

    if (initialScene > 0) {
      positionRef.current = initialPosition;
      targetRef.current = initialPosition;
    }

    const initializationFrame = requestAnimationFrame(() => {
      if (initialScene > 0) setPosition(initialPosition);
      setHasResolvedInitialHash(true);
    });

    return () => cancelAnimationFrame(initializationFrame);
  }, []);

  useEffect(() => {
    if (viewMode !== "explore") return;
    const keyDirection = (key: string): TravelDirection | null =>
      key === "arrowright" || key === "d" ? 1 : key === "arrowleft" || key === "a" ? -1 : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat) return;
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("input, textarea, select, [contenteditable], a, button")) return;
      const key = event.key.toLowerCase();
      const nextDirection = keyDirection(key);
      if (nextDirection !== null) {
        event.preventDefault();
        pressedKeys.current.set(key, nextDirection);
        startWalking(nextDirection);
      } else if (event.key === "Home" || event.key === "End") {
        // Preserve native Home/End scrolling inside a focused reading panel.
        if (target instanceof HTMLElement && target.closest(".scene-panel")) return;
        event.preventDefault();
        jumpTo(event.key === "Home" ? 0 : lastScene);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const releasedDirection = pressedKeys.current.get(key);
      if (releasedDirection === undefined) return;
      pressedKeys.current.delete(key);
      const remaining = [...pressedKeys.current.values()].at(-1);
      if (remaining !== undefined) startWalking(remaining);
      else finishWalkingInput(releasedDirection);
    };
    const resetInput = () => {
      pressedKeys.current.clear();
      lastQuickRelease.current = null;
      pointerStart.current = null;
      stopWalking();
    };
    const onVisibilityChange = () => {
      if (document.hidden) resetInput();
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", resetInput);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", resetInput);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      pressedKeys.current.clear();
      heldDirection.current = null;
      if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    };
  }, [viewMode, finishWalkingInput, jumpTo, lastScene, startWalking, stopWalking]);

  const nearestScene = clamp(
    Math.round(position / SECTION_SPACING),
    0,
    lastScene,
  );
  const activeScene =
    Math.abs(position - scenePosition(nearestScene)) <= SECTION_ACTIVE_RADIUS
      ? nearestScene
      : null;
  const activeChapter =
    activeScene === null
      ? null
      : chapters.reduce(
          (currentChapter, chapter) =>
            chapter.scene <= activeScene ? chapter : currentChapter,
          chapters[0],
        );

  useEffect(() => {
    const previousScene = previousActiveScene.current;

    if (previousScene !== null && previousScene !== activeScene) {
      const existingTimer = sceneTimers.current.get(previousScene);
      if (existingTimer) clearTimeout(existingTimer);

      setScenePhases((current) =>
        current.map((phase, index) =>
          index === previousScene && phase !== "hidden" ? "exiting" : phase,
        ),
      );

      const timer = setTimeout(() => {
        setScenePhases((current) =>
          current.map((phase, index) =>
            index === previousScene && phase === "exiting" ? "hidden" : phase,
          ),
        );
        sceneTimers.current.delete(previousScene);
      }, SCENE_FADE_MS);
      sceneTimers.current.set(previousScene, timer);
    }

    if (activeScene !== null && activeScene !== previousScene) {
      const existingTimer = sceneTimers.current.get(activeScene);
      if (existingTimer) {
        clearTimeout(existingTimer);
        sceneTimers.current.delete(activeScene);
      }

      setScenePhases((current) =>
        current.map((phase, index) =>
          index === activeScene ? "entering" : phase,
        ),
      );

      const timer = setTimeout(() => {
        setScenePhases((current) =>
          current.map((phase, index) =>
            index === activeScene && phase === "entering" ? "visible" : phase,
          ),
        );
        sceneTimers.current.delete(activeScene);
      }, SCENE_FADE_MS);
      sceneTimers.current.set(activeScene, timer);
    }

    previousActiveScene.current = activeScene;
  }, [activeScene]);

  useEffect(
    () => () => {
      sceneTimers.current.forEach((timer) => clearTimeout(timer));
      sceneTimers.current.clear();
      if (chapterToastFrame.current !== null) {
        cancelAnimationFrame(chapterToastFrame.current);
      }
      if (chapterToastTimer.current) clearTimeout(chapterToastTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (
      !hasResolvedInitialHash ||
      activeScene === null ||
      activeChapter === null ||
      previousChapter.current === activeChapter.label
    ) {
      return;
    }

    previousChapter.current = activeChapter.label;
    if (chapterToastFrame.current !== null) {
      cancelAnimationFrame(chapterToastFrame.current);
    }
    if (chapterToastTimer.current) clearTimeout(chapterToastTimer.current);

    chapterToastFrame.current = requestAnimationFrame(() => {
      setChapterToast((current) => ({
        label: activeChapter.label,
        sequence: (current?.sequence ?? 0) + 1,
      }));
      chapterToastFrame.current = null;

      chapterToastTimer.current = setTimeout(() => {
        setChapterToast(null);
        chapterToastTimer.current = null;
      }, CHAPTER_TOAST_MS);
    });
  }, [activeChapter, activeScene, hasResolvedInitialHash]);

  const atLeftEdge = position <= 0.001;
  const atRightEdge = position >= maxPosition - 0.001;
  const sceneStyle = useCallback(
    (scene: number) => {
      const offset = scenePosition(scene) - position;
      return {
        "--scene-offset": clamp(offset, -1, 1),
      } as CSSProperties;
    },
    [position],
  );
  const sceneClassName = useCallback(
    (baseClassName: string) => `game-scene ${baseClassName}`,
    [],
  );
  const worldStyle = {
    "--position": position,
    "--scene-count": sceneNames.length,
    "--section-gap": SECTION_SPACING - 1,
  } as CSSProperties;

  const chapterProgress = useMemo(
    () => `${Math.round((position / maxPosition) * 100)}%`,
    [maxPosition, position],
  );

  const onWheel = (event: ReactWheelEvent<HTMLElement>) => {
    if (viewMode === "quick") return;
    const target = event.target as HTMLElement;
    if (target.closest(".panel-scroll")) return;

    // A vertical reading gesture must never change chapters.
    if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) {
      const panel = event.currentTarget.querySelector<HTMLElement>('.game-scene[data-scene-phase="visible"] .scene-panel');
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? (panel?.clientHeight ?? 1) : 1;
      panel?.scrollBy({ top: event.deltaY * unit, behavior: "instant" });
      return;
    }
    const axis = event.deltaX;
    const now = performance.now();
    if (Math.abs(axis) < 18 || now - lastWheel.current < 680) return;

    const nextDirection: TravelDirection = axis > 0 ? 1 : -1;
    if (
      (nextDirection === -1 && positionRef.current <= 0.001) ||
      (nextDirection === 1 && positionRef.current >= maxPosition - 0.001)
    ) {
      return;
    }

    event.preventDefault();
    lastWheel.current = now;
    travel(nextDirection);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (viewMode === "quick") return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button, .panel-scroll")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (viewMode === "quick") return;
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;

    if (Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY)) {
      travel(deltaX < 0 ? 1 : -1);
    }
  };

  const onWorldDoubleClick = (event: ReactMouseEvent<HTMLElement>) => {
    if (viewMode === "quick") return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button, .scene-panel")) return;

    const nextDirection: TravelDirection =
      event.clientX < window.innerWidth / 2 ? -1 : 1;
    if (
      (nextDirection === -1 && atLeftEdge) ||
      (nextDirection === 1 && atRightEdge)
    ) {
      return;
    }
    jumpTo(clamp(nearestScene + nextDirection, 0, lastScene));
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://cubelated.com/#person",
    url: "https://cubelated.com/",
    name: "Hanssen Budisantoso Wijaya",
    alternateName: ["黃晟旺", "cubelated"],
    image: "https://cubelated.com/hanssen-profile.jpg",
    jobTitle: "Software Engineer",
    email: "mailto:hanssenbudi@gmail.com",
    sameAs: [
      "https://www.linkedin.com/in/hanssen-budisantoso-wijaya/",
      "https://github.com/cubelated",
      "https://youtube.com/@hanssenbudi",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Feng Chia University",
      url: "https://www.fcu.edu.tw/",
    },
    knowsAbout: [
      "Software Engineering",
      "Flutter",
      "Mobile Applications",
      "Distributed Systems",
      "Full-stack Development",
      "System Architecture",
      "Infrastructure Automation",
    ],
  };

  return (
    <main
      className="game-shell"
      data-view-mode={viewMode}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { pointerStart.current = null; }}
      onDoubleClick={onWorldDoubleClick}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {viewMode === "quick" ? (
        <QuickPortfolio onExplore={() => setPortfolioView("explore")} />
      ) : (
      <>
      <a className="skip-link" href="#quick-start" onClick={(event) => {
        event.preventDefault();
        setPortfolioView("quick");
      }}>
        Skip to reading view
      </a>

      <header className="game-header">
        <button className="pixel-brand" onClick={() => jumpTo(0)} aria-label="Go to start">
          <img src="/cubelated-pixel-logo.png" alt="" />
          <span>
            <strong>CUBELATED</strong>
            <small>BUILD WITH PURPOSE</small>
          </span>
        </button>

        <nav className="chapter-nav" aria-label="Portfolio chapters">
          {chapters.map((chapter) => {
            const nextChapter = chapters.find(
              (candidate) => candidate.scene > chapter.scene,
            );
            const isActive =
              nearestScene >= chapter.scene &&
              (!nextChapter || nearestScene < nextChapter.scene);
            return (
              <button
                key={chapter.label}
                className={isActive ? "active" : ""}
                onClick={() => jumpTo(chapter.scene)}
                aria-current={isActive ? "page" : undefined}
              >
                {chapter.label}
              </button>
            );
          })}
        </nav>

        <div className="header-actions">
          <button className="view-switch compact" onClick={() => setPortfolioView("quick")}>
            READING VIEW
          </button>
          <a className="header-contact" href="mailto:hanssenbudi@gmail.com">
            <span className="status-light" />
            AVAILABLE
          </a>
        </div>
      </header>

      <div className="game-progress" aria-hidden="true">
        <span style={{ width: chapterProgress }} />
      </div>

      {chapterToast && (
        <div
          className="achievement-toast"
          key={`${chapterToast.label}-${chapterToast.sequence}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="achievement-icon" aria-hidden="true">
            <i />
          </span>
          <span className="achievement-copy">
            <small>CHAPTER DISCOVERED</small>
            <strong>Welcome to {chapterToast.label}</strong>
          </span>
          <span className="achievement-timer" aria-hidden="true" />
        </div>
      )}

      <div className="parallax-layer stars" style={worldStyle} aria-hidden="true" />
      <div className="parallax-layer far-hills" style={worldStyle} aria-hidden="true" />
      <div className="parallax-layer near-hills" style={worldStyle} aria-hidden="true" />

      <div className="world-track" style={worldStyle}>
        <section
          id="start"
          className={sceneClassName("scene-start")}
          data-scene-phase={scenePhases[0]}
          aria-labelledby="hero-title"
          aria-hidden={scenePhases[0] !== "visible"}
          inert={scenePhases[0] !== "visible"}
          style={sceneStyle(0)}
        >
          <div className="pixel-sun" aria-hidden="true" />
          <span className="pixel-cloud cloud-a" aria-hidden="true" />
          <span className="pixel-cloud cloud-b" aria-hidden="true" />

          <div className="scene-panel hero-panel panel-scroll" tabIndex={0}>
            <p className="scene-eyebrow">HANSSEN WIJAYA · SOFTWARE ENGINEER</p>
            <h1 id="hero-title">
              BUILD WITH
              <span>PURPOSE.</span>
            </h1>
            <p className="hero-copy">
              Hi, I&apos;m <strong>Hanssen</strong> — also known as{" "}
              <strong>@cubelated</strong>. I build mobile apps, full-stack products,
              and dependable systems around real human problems.
            </p>
            <div className="hero-actions">
              <button className="pixel-action" onClick={() => jumpTo(2)}>
                EXPLORE MY WORK <ArrowRight size={16} />
              </button>
              <button className="text-action" onClick={() => setPortfolioView("quick")}>
                READING VIEW <ArrowUpRight size={13} />
              </button>
              <a
                className="text-action"
                href="https://www.linkedin.com/in/hanssen-budisantoso-wijaya/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={16} /> LINKEDIN <ArrowUpRight size={13} />
              </a>
            </div>
          </div>

          <div className="logo-monument" aria-label="Cubelated logo">
            <div className="monument-glow" />
            <img src="/cubelated-pixel-logo.png" alt="Cubelated cube logo" />
            <span>EST. 2018</span>
          </div>
        </section>

        <section
          id="mission"
          className={sceneClassName("scene-mission")}
          data-scene-phase={scenePhases[1]}
          aria-labelledby="mission-title"
          aria-hidden={scenePhases[1] !== "visible"}
          inert={scenePhases[1] !== "visible"}
          style={sceneStyle(1)}
        >
          <div className="mission-moon" aria-hidden="true" />
          <span className="pixel-cloud cloud-a" aria-hidden="true" />
          <div className="scene-panel mission-panel panel-scroll" tabIndex={0}>
            <div className="panel-index">
              <span>QUEST 01</span>
              <strong>MISSION</strong>
            </div>
            <p className="scene-eyebrow">WHY I BUILD</p>
            <h2 id="mission-title">
              BUILDING TO
              <span>IMPACT LIVES.</span>
            </h2>
            <div className="mission-copy">
              <p>
                I enjoy building software that improves productivity, supports everyday tasks,
                and makes complex workflows easier to manage.
              </p>
              <p>
                My Christian faith shapes how I build: with care for people,
                integrity in my decisions, and a commitment to useful work.
                I want to create products that make a meaningful difference.
              </p>
            </div>
          </div>
          <div className="mission-tree tree-one" aria-hidden="true" />
          <div className="mission-tree tree-two" aria-hidden="true" />
        </section>

        {projects.map((project, index) => (
          <ProjectScene
            key={project.title}
            project={project}
            index={index}
            sceneStyle={sceneStyle(index + 2)}
            phase={scenePhases[index + 2]}
            onOpenCaseStudy={openCaseStudy}
          />
        ))}

        <section
          id="hostinginside"
          className={sceneClassName("scene-experience")}
          data-scene-phase={scenePhases[6]}
          aria-labelledby="hosting-title"
          aria-hidden={scenePhases[6] !== "visible"}
          inert={scenePhases[6] !== "visible"}
          style={sceneStyle(6)}
        >
          <div className="city-lights" aria-hidden="true" />
          <article className="scene-panel experience-panel panel-scroll" tabIndex={0}>
            <div className="panel-index">
              <span>CAREER LOG</span>
              <strong>2022—2026</strong>
            </div>
            <p className="scene-eyebrow">HOSTINGINSIDE LTD</p>
            <h2 id="hosting-title">FROM BUILDER TO TEAM LEAD.</h2>

            <div className="timeline-entry">
              <time>JUN 2024 — MAY 2026</time>
              <div>
                <h3>Lead Software Engineer</h3>
                <p>Led a six-engineer team delivering infrastructure platforms and multi-platform business products.</p>
                <ul>
                  <li>Architected a DCIM platform spanning three data centers.</li>
                  <li>Led a multi-OS retail POS SaaS from planning through delivery.</li>
                  <li>Guided architecture, reviews, mentoring, and technical delivery.</li>
                </ul>
              </div>
            </div>

            <div className="timeline-entry">
              <time>MAY 2022 — MAY 2024</time>
              <div>
                <h3>Software Engineer</h3>
                <p>Built infrastructure automation and operational tools for production hosting environments.</p>
                <ul>
                  <li>Integrated more than 70 devices into the first DCIM prototype.</li>
                  <li>Diagnosed Linux and networking issues across 100+ client environments.</li>
                </ul>
              </div>
            </div>
          </article>
          <div className="server-stack" aria-hidden="true">
            <span /><span /><span /><span />
          </div>
        </section>

        <section
          id="feng-chia-university"
          className={sceneClassName("scene-fcu")}
          data-scene-phase={scenePhases[7]}
          aria-labelledby="fcu-title"
          aria-hidden={scenePhases[7] !== "visible"}
          inert={scenePhases[7] !== "visible"}
          style={sceneStyle(7)}
        >
          <div className="pixel-sun small-sun" aria-hidden="true" />
          <span className="pixel-cloud cloud-b" aria-hidden="true" />
          <article className="scene-panel fcu-panel panel-scroll" tabIndex={0}>
            <div className="panel-index">
              <span>CAREER LOG</span>
              <strong>03/03</strong>
            </div>
            <p className="scene-eyebrow">FENG CHIA UNIVERSITY</p>
            <h2 id="fcu-title">SOFTWARE MAINTAINER.</h2>
            <time className="large-time">SEP 2022 — JAN 2024</time>
            <p>
              Maintained and improved the university&apos;s Flutter Economics app,
              resolved defects, refined application behavior, and supported reliable
              releases for students and university stakeholders.
            </p>
            <div className="pixel-tags">
              <span>Flutter</span>
              <span>App maintenance</span>
              <span>Education technology</span>
            </div>
            <a
              className="pixel-action"
              href="https://play.google.com/store/apps/details?id=com.fcu_economics.flutter_economic_v2025"
              target="_blank"
              rel="noreferrer"
            >
              VIEW APPLICATION <ArrowUpRight size={15} />
            </a>
          </article>
          <div className="pixel-campus" aria-hidden="true">
            <i />
            <span /><span /><span />
          </div>
        </section>

        <section
          id="education"
          className={sceneClassName("scene-education")}
          data-scene-phase={scenePhases[8]}
          aria-labelledby="education-title"
          aria-hidden={scenePhases[8] !== "visible"}
          inert={scenePhases[8] !== "visible"}
          style={sceneStyle(8)}
        >
          <span className="pixel-cloud cloud-a" aria-hidden="true" />
          <span className="pixel-cloud cloud-b" aria-hidden="true" />
          <article className="scene-panel education-panel panel-scroll" tabIndex={0}>
            <div className="panel-index">
              <span>ACADEMIC LOG</span>
              <strong>FCU</strong>
            </div>
            <p className="scene-eyebrow">THE FOUNDATION</p>
            <h2 id="education-title">A FOUNDATION IN COMPUTER SCIENCE.</h2>
            <div className="degree-grid">
              <div>
                <span className="degree-icon">MSc</span>
                <time>2022 — 2024</time>
                <h3>Master of Science</h3>
                <p>Information Engineering &amp; Computer Science</p>
                <strong>Ranked 7 of 49 · GPA 4.1 / 5.0</strong>
              </div>
              <div>
                <span className="degree-icon">BSc</span>
                <time>2018 — 2022</time>
                <h3>Bachelor of Science</h3>
                <p>Information Engineering &amp; Computer Science</p>
                <strong>GPA 3.8 / 4.0</strong>
              </div>
            </div>
          </article>
          <div className="book-stack" aria-hidden="true">
            <span /><span /><span />
          </div>
        </section>

        <section
          id="contact"
          className={sceneClassName("scene-contact")}
          data-scene-phase={scenePhases[9]}
          aria-labelledby="contact-title"
          aria-hidden={scenePhases[9] !== "visible"}
          inert={scenePhases[9] !== "visible"}
          style={sceneStyle(9)}
        >
          <div className="portal-ring" aria-hidden="true">
            <img src="/cubelated-pixel-logo.png" alt="" />
          </div>
          <article className="scene-panel contact-panel panel-scroll" tabIndex={0}>
            <div className="panel-index">
              <span>FINAL CHECKPOINT</span>
              <strong>10/10</strong>
            </div>
            <p className="scene-eyebrow">LET&apos;S MAKE SOMETHING USEFUL</p>
            <h2 id="contact-title">HAVE A MEANINGFUL PROBLEM TO SOLVE?</h2>
            <p>
              I&apos;m open to software engineering opportunities and collaborations
              in mobile applications, full-stack products, and infrastructure.
              Let&apos;s talk about what you&apos;re building.
            </p>
            <div className="contact-actions">
              <a className="pixel-action" href="mailto:hanssenbudi@gmail.com">
                <Mail size={16} /> EMAIL ME
              </a>
              <a
                className="social-action"
                href="https://www.linkedin.com/in/hanssen-budisantoso-wijaya/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={16} /> LINKEDIN
              </a>
              <a
                className="social-action"
                href="https://github.com/cubelated"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={16} /> GITHUB
              </a>
            </div>
            <small>© {new Date().getFullYear()} HANSSEN BUDISANTOSO WIJAYA</small>
          </article>
        </section>
      </div>

      <PixelGround theme={floorThemes[nearestScene]} scene={nearestScene} />
      <PixelCharacter direction={direction} mode={motion} />

      <aside className="control-deck" aria-label="Game controls">
        <button
          className="direction-button"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            startWalking(-1);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              finishWalkingInput(-1);
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onClick={(event) => { if (event.detail === 0) travel(-1); }}
          onPointerCancel={stopWalking}
          onLostPointerCapture={() => { if (heldDirection.current !== null) stopWalking(); }}
          disabled={atLeftEdge}
          aria-label="Previous section. Hold to walk left."
        >
          <ArrowLeft size={19} strokeWidth={3} />
        </button>
        <div className="control-copy">
          <span>WALK</span>
          <strong>← / A &nbsp;&nbsp; D / →</strong>
          <small>HOLD TO WALK · DOUBLE TAP TO DASH · SCROLL TO READ</small>
        </div>
        <button
          className="direction-button"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            startWalking(1);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              finishWalkingInput(1);
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onClick={(event) => { if (event.detail === 0) travel(1); }}
          onPointerCancel={stopWalking}
          onLostPointerCapture={() => { if (heldDirection.current !== null) stopWalking(); }}
          disabled={atRightEdge}
          aria-label="Next section. Hold to walk right."
        >
          <ArrowRight size={19} strokeWidth={3} />
        </button>
      </aside>

      <div className="scene-counter" aria-live="polite" aria-atomic="true">
        <span>
          {activeScene === null
            ? "--"
            : String(activeScene + 1).padStart(2, "0")}
        </span>
        <i />
        <span>{String(sceneNames.length).padStart(2, "0")}</span>
        <strong>{activeScene === null ? "BETWEEN PAGES" : sceneNames[activeScene]}</strong>
      </div>
      </>
      )}
    </main>
  );
}
