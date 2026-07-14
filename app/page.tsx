import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  Code2,
  ExternalLink,
  GraduationCap,
  Github,
  Globe2,
  HeartHandshake,
  Linkedin,
  Mail,
  Music2,
  Play,
  Smartphone,
  Sparkles,
  Youtube,
} from "lucide-react";

const projects = [
  {
    number: "01",
    category: "Independent product",
    title: "Renewables",
    description:
      "A life-admin tracker that helps people stay ahead of expiring documents, warranties, subscriptions, and recurring responsibilities.",
    impact: "Designed and built end to end for Android",
    stack: ["Flutter", "Supabase", "Firebase", "RevenueCat"],
    href: "https://renewables.cubelated.com/",
    linkLabel: "Visit product",
    mediaType: "website",
    media: "https://renewables.cubelated.com/",
    icon: Globe2,
  },
  {
    number: "02",
    category: "IoT + mobile",
    title: "Flyfitnity",
    description:
      "A Raspberry Pi and Flutter fitness system that turns physical movement into real-time mobile feedback over Bluetooth.",
    impact: "Honorable Award · Edge-to-mobile integration",
    stack: ["Flutter", "Raspberry Pi", "Bluetooth", "IoT"],
    href: "https://github.com/cubelated/flyfitnity_bluetooth_connection",
    linkLabel: "View repository",
    mediaType: "image",
    media: "https://opengraph.githubassets.com/portfolio/cubelated/flyfitnity_bluetooth_connection",
    icon: Github,
  },
  {
    number: "03",
    category: "Master's research",
    title: "LearnAlgo",
    description:
      "An embodied learning experience that helps students understand abstract algorithms through movement and interaction.",
    impact: "Research translated into an interactive learning tool",
    stack: ["Flutter", "Firebase", "Embodied cognition", "Situational learning"],
    href: "https://www.youtube.com/watch?v=ATqbLGN2ZBk&list=PLM97qnUGt3wg2bZ5MLHqysTbSy3SXrm1i",
    linkLabel: "Watch project",
    mediaType: "video",
    media: "https://i.ytimg.com/vi/ATqbLGN2ZBk/maxresdefault.jpg",
    icon: Play,
  },
  {
    number: "04",
    category: "Team project",
    title: "VirtualClass",
    description:
      "A collaborative virtual classroom designed to make remote learning more engaging and natural for students and educators.",
    impact: "Excellence Award · Built by a four-person team",
    stack: ["Flutter", "Firebase", "Classroom assistant", "English learning"],
    href: "https://youtu.be/DH1pCYupwNM?si=Ty1wVrY7K6U-fRbY",
    linkLabel: "Watch project",
    mediaType: "video",
    media: "https://i.ytimg.com/vi/DH1pCYupwNM/maxresdefault.jpg",
    icon: Play,
  },
];

const experience = [
  {
    years: "Jun 2024 — May 2026",
    role: "Lead Software Engineer",
    company: "HostingInside LTD",
    companyHref: "https://hostinginside.com/",
    description:
      "Led a six-engineer team delivering infrastructure platforms and multi-platform business products.",
    highlights: [
      "Architected and delivered a DCIM platform spanning automated OS installation, network ACLs, asset and billing integrations, and real-time monitoring across three data centers.",
      "Led development of a multi-OS retail POS SaaS covering sales reports, inventory, pre-orders, barcode workflows, printing, and invoicing.",
      "Built a Next.js documentation microservice and guided technical planning, reviews, mentoring, and delivery across the engineering team.",
    ],
    tags: ["Technical leadership", "System architecture", "Product delivery"],
  },
  {
    years: "May 2022 — May 2024",
    role: "Software Engineer",
    company: "HostingInside LTD",
    companyHref: "https://hostinginside.com/",
    description:
      "Built infrastructure automation and operational tools for production hosting environments.",
    highlights: [
      "Developed the first DCIM platform prototype and integrated more than 70 infrastructure devices into a unified operational workflow.",
      "Automated repetitive provisioning and infrastructure tasks to reduce manual installation, setup, and configuration work.",
      "Diagnosed Linux, server, and networking issues across more than 100 client environments.",
    ],
    tags: ["Full-stack engineering", "Automation", "Infrastructure"],
  },
  {
    years: "Sep 2022 — Jan 2024",
    role: "Software Engineer Maintainer",
    company: "Feng Chia University",
    companyHref: "https://www.fcu.edu.tw/",
    productHref: "https://play.google.com/store/apps/details?id=com.fcu_economics.flutter_economic_v2025",
    description:
      "Maintained the university's Economics mobile application and supported its ongoing development.",
    highlights: [
      "Maintained and improved the Flutter application used to support economics learning at Feng Chia University.",
      "Resolved defects, refined application behavior, and kept the codebase dependable as requirements evolved.",
      "Supported application releases and continuity for students and university stakeholders.",
    ],
    tags: ["Flutter", "Application maintenance", "Education technology"],
  },
];

const education = [
  {
    degree: "Master of Science",
    field: "Information Engineering and Computer Science",
    school: "Feng Chia University",
    schoolHref: "https://www.fcu.edu.tw/",
    years: "2022 — 2024",
    detail: "Ranked 7 of 49 · GPA 4.1 / 5.0",
  },
  {
    degree: "Bachelor of Science",
    field: "Information Engineering and Computer Science",
    school: "Feng Chia University",
    schoolHref: "https://www.fcu.edu.tw/",
    years: "2018 — 2022",
    detail: "GPA 3.8 / 4.0",
  },
];

function ProjectMedia({ project }: { project: (typeof projects)[number] }) {
  const ProjectIcon = project.icon;

  return (
    <a
      className="project-media"
      href={project.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${project.title}`}
    >
      {project.mediaType === "website" ? (
        <iframe
          src={project.media}
          title="Renewables website preview"
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
        />
      ) : (
        <img src={project.media} alt={`${project.title} project thumbnail`} loading="lazy" />
      )}
      <span className="media-type"><ProjectIcon size={14} /> {project.mediaType === "video" ? "Video" : project.mediaType === "website" ? "Live site" : "GitHub"}</span>
      {project.mediaType === "video" && <span className="play-button"><Play size={20} fill="currentColor" /></span>}
      <span className="media-open"><ExternalLink size={17} /></span>
    </a>
  );
}

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://cubelated.com/#person",
    url: "https://cubelated.com/",
    name: "Hanssen Budisantoso Wijaya",
    alternateName: ["黃晟旺", "cubelated"],
    image: "https://cubelated.com/hanssen-profile.jpg",
    jobTitle: "Full-Stack Software Engineer",
    email: "mailto:hanssenbudi@gmail.com",
    address: { "@type": "PostalAddress", addressLocality: "Taichung", addressCountry: "TW" },
    sameAs: [
      "https://www.linkedin.com/in/hanssen-budisantoso-wijaya/",
      "https://github.com/cubelated",
      "https://www.tiktok.com/@hanssenbudi",
      "https://youtube.com/@hanssenbudi",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Feng Chia University",
      url: "https://www.fcu.edu.tw/",
    },
    knowsAbout: ["Software Engineering", "Flutter", "Full-stack Development", "Mobile Applications", "System Architecture", "Infrastructure Automation"],
  };

  return (
    <main id="top">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <a className="skip-link" href="#projects">Skip to projects</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Cubelated — home">
          <span className="brand-mark" aria-hidden="true"><Code2 size={17} /></span>
          <span>Cubelated.</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="mailto:hanssenbudi@gmail.com">
          <Mail size={15} /> Let&apos;s talk
        </a>
      </header>

      <section className="hero section-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><Code2 size={14} /> Full-Stack Software Engineer</p>
          <h1 id="hero-title">Build with<br /><em>Purpose.</em></h1>
          <p className="hero-lede">
            Hi, I&apos;m Hanssen—also known as <strong>@cubelated</strong>. I identify real-life
            problems, design focused solutions, and build dependable systems that make
            everyday work simpler and more productive.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#projects">See what I&apos;ve built <ArrowDown size={17} /></a>
            <a className="text-link" href="https://www.linkedin.com/in/hanssen-budisantoso-wijaya/" target="_blank" rel="noreferrer">
              <Linkedin size={17} /> Connect on LinkedIn <ArrowUpRight size={15} />
            </a>
          </div>
        </div>

        <aside className="profile-card" aria-label="Profile of Hanssen Budisantoso Wijaya">
          <img src="/hanssen-profile.jpg" alt="Hanssen Budisantoso Wijaya" />
          <div className="profile-caption">
            <div><strong>Hanssen Budisantoso Wijaya</strong><span>Software Engineer · Taiwan</span></div>
            <a href="https://github.com/cubelated" target="_blank" rel="noreferrer" aria-label="Hanssen on GitHub"><Github size={18} /></a>
          </div>
        </aside>
      </section>

      <section className="mission section-shell" aria-labelledby="mission-title">
        <p className="section-index"><Sparkles size={15} /> Mission</p>
        <div className="mission-copy">
          <h2 id="mission-title">Building to<br /><em>Impact Lives.</em></h2>
          <div className="mission-detail">
            <p>
              I enjoy building software that improves productivity, helps people in their
              day-to-day tasks, and breaks complex work down into genuine convenience.
            </p>
            <p>
              Inspired by Christ&apos;s self-giving love, I want my work to serve people,
              strengthen society, and help individuals discover and pursue their own
              particular purpose in life—all while remaining grounded in truth.
            </p>
          </div>
        </div>
      </section>

      <section className="work-section section-shell" id="projects" aria-labelledby="projects-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><BriefcaseBusiness size={14} /> Projects</p>
            <h2 id="projects-title">From Ideas to<br />impacting lives.</h2>
          </div>
          <p>Projects across product, IoT, and education—each shaped around a real human need, not just a technical exercise.</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => {
            const LinkIcon = project.icon;
            return (
              <article className="project-card" key={project.number}>
                <ProjectMedia project={project} />
                <div className="project-copy">
                  <div className="project-topline"><span>{project.number}</span><span>{project.category}</span></div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="project-impact"><Check size={14} /> {project.impact}</p>
                  <ul className="tag-list" aria-label={`${project.title} technologies`}>
                    {project.stack.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <a className="project-link" href={project.href} target="_blank" rel="noreferrer">
                    <LinkIcon size={16} /> {project.linkLabel} <ArrowUpRight size={15} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="experience-section" id="experience" aria-labelledby="experience-title">
        <div className="section-shell">
          <div className="section-heading light-heading">
            <div>
              <p className="eyebrow"><BriefcaseBusiness size={14} /> Experience</p>
              <h2 id="experience-title">Built in production.<br />Learned in the real world.</h2>
            </div>
            <p>I&apos;ve grown from hands-on implementation to leading systems and people—while staying close to the code and the customer problem.</p>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article className="experience-item" key={`${item.company}-${item.role}`}>
                <time>{item.years}</time>
                <div>
                  <h3>{item.role}</h3>
                  <a className="company" href={item.companyHref} target="_blank" rel="noreferrer">
                    {item.company} <ArrowUpRight size={13} />
                  </a>
                  {item.productHref && (
                    <a className="maintained-product" href={item.productHref} target="_blank" rel="noreferrer">
                      <Smartphone size={13} /> View maintained app <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
                <div className="experience-detail">
                  <p>{item.description}</p>
                  <ul className="experience-highlights">
                    {item.highlights.map((highlight) => <li key={highlight}><Check size={14} /> <span>{highlight}</span></li>)}
                  </ul>
                  <ul className="experience-tags">{item.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="education-section section-shell" id="education" aria-labelledby="education-title">
        <div className="compact-heading">
          <p className="section-index"><GraduationCap size={15} /> Education</p>
          <h2 id="education-title">The academic foundation behind my work.</h2>
        </div>
        <div className="education-grid">
          {education.map((item) => (
            <article key={item.degree}>
              <div className="education-topline"><time>{item.years}</time><GraduationCap size={22} /></div>
              <h3>{item.degree}</h3>
              <p>{item.field}</p>
              <a href={item.schoolHref} target="_blank" rel="noreferrer">
                {item.school} <ArrowUpRight size={14} />
              </a>
              <span>{item.detail}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-orb" aria-hidden="true"><HeartHandshake size={70} /></div>
        <div className="section-shell contact-inner">
          <p className="eyebrow"><Sparkles size={14} /> Let&apos;s make something useful</p>
          <h2 id="contact-title">Have a meaningful<br />problem to solve?</h2>
          <p>I&apos;m always glad to talk about thoughtful products, ambitious systems, and opportunities to build work that matters.</p>
          <div className="contact-actions">
            <a className="button button-light" href="mailto:hanssenbudi@gmail.com"><Mail size={17} /> Email me</a>
            <a href="https://www.linkedin.com/in/hanssen-budisantoso-wijaya/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn <ArrowUpRight size={14} /></a>
            <a href="https://github.com/cubelated" target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={14} /></a>
            <a href="https://www.tiktok.com/@hanssenbudi" target="_blank" rel="noreferrer"><Music2 size={17} /> TikTok <ArrowUpRight size={14} /></a>
            <a href="https://youtube.com/@hanssenbudi" target="_blank" rel="noreferrer"><Youtube size={17} /> YouTube <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-shell">
          <a className="brand" href="#top" aria-label="Back to top"><span className="brand-mark"><Code2 size={17} /></span><span>Cubelated.</span></a>
          <p>Building to Impact Lives.</p>
          <p>© {new Date().getFullYear()} Hanssen Budisantoso Wijaya</p>
        </div>
      </footer>
    </main>
  );
}
