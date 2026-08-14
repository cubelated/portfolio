"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Play,
} from "lucide-react";
import {
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
  href: string;
  linkLabel: string;
  action: "visit" | "github" | "watch";
  accent: string;
  sceneClass: string;
};

const projects: Project[] = [
  {
    number: "01",
    eyebrow: "Independent product",
    title: "Renewables",
    description:
      "A life-admin tracker that keeps passports, warranties, subscriptions, and recurring responsibilities from slipping through the cracks.",
    impact: "Designed and shipped end to end for Android",
    stack: ["Flutter", "Supabase", "Firebase", "RevenueCat"],
    href: "https://renewables.cubelated.com",
    linkLabel: "Visit product",
    action: "visit",
    accent: "#f47b43",
    sceneClass: "scene-renewables",
  },
  {
    number: "02",
    eyebrow: "IoT + mobile",
    title: "Flyfitnity",
    description:
      "A Raspberry Pi and Flutter fitness system that turns physical movement into real-time mobile feedback over Bluetooth.",
    impact: "Honorable Award · edge-to-mobile integration",
    stack: ["Flutter", "Raspberry Pi", "Bluetooth", "IoT"],
    href: "https://github.com/cubelated/flyfitnity_bluetooth_connection",
    linkLabel: "View repository",
    action: "github",
    accent: "#72d6b1",
    sceneClass: "scene-flyfitnity",
  },
  {
    number: "03",
    eyebrow: "Master's research",
    title: "LearnAlgo",
    description:
      "An embodied learning experience that helps students understand abstract algorithms through movement, interaction, and situational learning.",
    impact: "Research translated into an interactive tool",
    stack: ["Flutter", "Firebase", "Embodied cognition", "Situational learning"],
    href: "https://www.youtube.com/watch?v=ATqbLGN2ZBk&list=PLM97qnUGt3wg2bZ5MLHqysTbSy3SXrm1i",
    linkLabel: "Watch project",
    action: "watch",
    accent: "#ffd166",
    sceneClass: "scene-learnalgo",
  },
  {
    number: "04",
    eyebrow: "Team project",
    title: "VirtualClass",
    description:
      "A collaborative virtual classroom designed to make remote English learning more engaging and natural for students and educators.",
    impact: "Excellence Award · led a four-person team",
    stack: ["Flutter", "Firebase", "Classroom assistant", "English learning"],
    href: "https://youtu.be/DH1pCYupwNM?si=Ty1wVrY7K6U-fRbY",
    linkLabel: "Watch project",
    action: "watch",
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
  "Flyfitnity",
  "LearnAlgo",
  "VirtualClass",
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

function PixelCharacter({
  direction,
  mode,
}: {
  direction: TravelDirection;
  mode: MotionMode;
}) {
  const facing = direction === -1 ? "south-west" : "south-east";
  const sprite =
    mode === "idle" ? "/knight/idle-south.png" : `/knight/${mode}-${facing}.png`;

  return (
    <div
      className="character-stage"
      data-direction={direction}
      data-motion={mode}
      aria-hidden="true"
    >
      <div className="dash-trail trail-one" />
      <div className="dash-trail trail-two" />
      <div className="knight-shadow" />
      <div className="knight-sprite-wrap">
        <img
          className="knight-sprite knight-sprite-primary"
          src={sprite}
          alt=""
          draggable="false"
        />
        {mode === "walk" && (
          <img
            className="knight-sprite knight-sprite-alternate"
            src={`/knight/walk-alt-${facing}.png`}
            alt=""
            draggable="false"
          />
        )}
      </div>
      <div className="dust dust-one" />
      <div className="dust dust-two" />
      <div className="dust dust-three" />
    </div>
  );
}

function ActionIcon({ action }: { action: Project["action"] }) {
  if (action === "github") return <Github size={16} />;
  if (action === "watch") return <Play size={15} fill="currentColor" />;
  return <ArrowUpRight size={16} />;
}

function ProjectScene({
  project,
  index,
  sceneStyle,
  phase,
}: {
  project: Project;
  index: number;
  sceneStyle: CSSProperties;
  phase: ScenePhase;
}) {
  return (
    <section
      id={project.title.toLowerCase()}
      className={`game-scene project-scene ${project.sceneClass}`}
      data-scene-phase={phase}
      aria-labelledby={`${project.title.toLowerCase()}-title`}
      aria-hidden={phase !== "visible"}
      style={{ ...sceneStyle, "--project-accent": project.accent } as CSSProperties}
    >
      <div className="pixel-sky-detail">
        <span className="pixel-cloud cloud-a" />
        <span className="pixel-cloud cloud-b" />
      </div>

      <article className="scene-panel project-panel">
        <div className="panel-index">
          <span>PROJECT LOG</span>
          <strong>{project.number}/04</strong>
        </div>
        <p className="scene-eyebrow">{project.eyebrow}</p>
        <h2 id={`${project.title.toLowerCase()}-title`}>{project.title}</h2>
        <p className="project-description">{project.description}</p>
        <p className="impact-line">
          <span aria-hidden="true">◆</span>
          {project.impact}
        </p>
        <ul className="pixel-tags" aria-label={`${project.title} technologies`}>
          {project.stack.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
        <a
          className="pixel-action"
          href={project.href}
          target="_blank"
          rel="noreferrer"
        >
          <ActionIcon action={project.action} />
          {project.linkLabel}
          <ArrowUpRight size={14} />
        </a>
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

export default function Home() {
  const lastScene = sceneNames.length - 1;
  const maxPosition = scenePosition(lastScene);
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

  const animateTo = useCallback(
    (rawTarget: number, duration: number, nextMotion: MotionMode) => {
      const target = clamp(rawTarget, 0, maxPosition);
      const start = positionRef.current;
      const distance = target - start;

      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }

      targetRef.current = target;
      if (Math.abs(distance) < 0.001) {
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
        heldDirection.current = null;
        setMotion("idle");
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

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        startWalking(1);
      } else if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        startWalking(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        jumpTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        jumpTo(lastScene);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const releasedDirection =
        event.key === "ArrowRight" || event.key.toLowerCase() === "d"
          ? 1
          : event.key === "ArrowLeft" || event.key.toLowerCase() === "a"
            ? -1
            : null;
      if (releasedDirection !== null) finishWalkingInput(releasedDirection);
    };

    const onBlur = () => stopWalking();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
      cancelAnimationFrame(initializationFrame);
    };
  }, [finishWalkingInput, jumpTo, lastScene, startWalking, stopWalking]);

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
    const target = event.target as HTMLElement;
    if (target.closest(".panel-scroll")) return;

    const axis = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
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
    const target = event.target as HTMLElement;
    if (target.closest("a, button, .panel-scroll")) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    pointerStart.current = null;

    if (Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY)) {
      travel(deltaX < 0 ? 1 : -1);
    }
  };

  const onWorldDoubleClick = (event: ReactMouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;

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
    jobTitle: "Mobile and Full-Stack Software Engineer",
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
      "Full-stack Development",
      "System Architecture",
      "Infrastructure Automation",
    ],
  };

  return (
    <main
      className="game-shell"
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onDoubleClick={onWorldDoubleClick}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <a className="skip-link" href="#contact" onClick={() => jumpTo(9)}>
        Skip to contact
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

        <a className="header-contact" href="mailto:hanssenbudi@gmail.com">
          <span className="status-light" />
          AVAILABLE
        </a>
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
            <small>ACHIEVEMENT UNLOCKED</small>
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
          style={sceneStyle(0)}
        >
          <div className="pixel-sun" aria-hidden="true" />
          <span className="pixel-cloud cloud-a" aria-hidden="true" />
          <span className="pixel-cloud cloud-b" aria-hidden="true" />

          <div className="scene-panel hero-panel">
            <p className="scene-eyebrow">PLAYER 01 · SOFTWARE ENGINEER</p>
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
              <button className="pixel-action" onClick={() => travel(1)}>
                BEGIN JOURNEY <ArrowRight size={16} />
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
          style={sceneStyle(1)}
        >
          <div className="mission-moon" aria-hidden="true" />
          <span className="pixel-cloud cloud-a" aria-hidden="true" />
          <div className="scene-panel mission-panel">
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
                I enjoy building software that improves productivity, helps people
                in day-to-day tasks, and turns complex work into genuine convenience.
              </p>
              <p>
                Inspired by Christ&apos;s self-giving love, I want my work to serve
                people, strengthen society, and help individuals discover and pursue
                their particular purpose in life — grounded in truth.
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
          />
        ))}

        <section
          id="hostinginside"
          className={sceneClassName("scene-experience")}
          data-scene-phase={scenePhases[6]}
          aria-labelledby="hosting-title"
          aria-hidden={scenePhases[6] !== "visible"}
          style={sceneStyle(6)}
        >
          <div className="city-lights" aria-hidden="true" />
          <article className="scene-panel experience-panel panel-scroll">
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
          style={sceneStyle(7)}
        >
          <div className="pixel-sun small-sun" aria-hidden="true" />
          <span className="pixel-cloud cloud-b" aria-hidden="true" />
          <article className="scene-panel fcu-panel">
            <div className="panel-index">
              <span>CAREER LOG</span>
              <strong>03/03</strong>
            </div>
            <p className="scene-eyebrow">FENG CHIA UNIVERSITY</p>
            <h2 id="fcu-title">SOFTWARE ENGINEER MAINTAINER.</h2>
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
              VIEW MAINTAINED APP <ArrowUpRight size={15} />
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
          style={sceneStyle(8)}
        >
          <span className="pixel-cloud cloud-a" aria-hidden="true" />
          <span className="pixel-cloud cloud-b" aria-hidden="true" />
          <article className="scene-panel education-panel">
            <div className="panel-index">
              <span>ACADEMIC LOG</span>
              <strong>FCU</strong>
            </div>
            <p className="scene-eyebrow">THE FOUNDATION</p>
            <h2 id="education-title">COMPUTER SCIENCE, TWICE OVER.</h2>
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
          style={sceneStyle(9)}
        >
          <div className="portal-ring" aria-hidden="true">
            <img src="/cubelated-pixel-logo.png" alt="" />
          </div>
          <article className="scene-panel contact-panel">
            <div className="panel-index">
              <span>FINAL CHECKPOINT</span>
              <strong>10/10</strong>
            </div>
            <p className="scene-eyebrow">LET&apos;S MAKE SOMETHING USEFUL</p>
            <h2 id="contact-title">HAVE A MEANINGFUL PROBLEM TO SOLVE?</h2>
            <p>
              I&apos;m always glad to talk about thoughtful products, ambitious
              systems, and opportunities to build work that matters.
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
          onPointerDown={() => startWalking(-1)}
          onPointerUp={() => finishWalkingInput(-1)}
          onPointerCancel={stopWalking}
          onPointerLeave={stopWalking}
          disabled={atLeftEdge}
          aria-label="Hold to walk left."
        >
          <ArrowLeft size={19} strokeWidth={3} />
        </button>
        <div className="control-copy">
          <span>WALK</span>
          <strong>← / A &nbsp;&nbsp; D / →</strong>
          <small>DOUBLE CLICK A SIDE TO DASH · SWIPE OR SCROLL</small>
        </div>
        <button
          className="direction-button"
          onPointerDown={() => startWalking(1)}
          onPointerUp={() => finishWalkingInput(1)}
          onPointerCancel={stopWalking}
          onPointerLeave={stopWalking}
          disabled={atRightEdge}
          aria-label="Hold to walk right."
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
    </main>
  );
}
