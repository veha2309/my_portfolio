import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Arrow from "../components/Arrow";
import { projects } from "../data/project";
import { usePageMotion } from "../hooks/usePageMotion";
import NotFound from "./NotFound";
import FeedbackForm from "../components/FeedbackForm";

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  const root = useRef<HTMLElement>(null);
  usePageMotion(root, slug);
  if (!project) return <NotFound />;
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return (
    <main ref={root} id="main" tabIndex={-1} className="case-study container">
      <div id="top" />
      <Link className="back-link" to="/#work">
        <span>←</span> ALL WORK
      </Link>
      <header className="case-header">
        <span className="eyebrow" data-intro>
          {project.number} / {project.category}
        </span>
        <h1 data-intro>{project.title}</h1>
        <p className="case-tagline" data-intro>
          {project.tagline}
        </p>
        <div className="case-meta">
          <ul aria-label="Technologies">
            {project.tech.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          <div className="case-links">
            {project.live && (
              <a
                className="text-link"
                href={project.live}
                target="_blank"
                rel="noreferrer"
              >
                {project.liveLabel ?? "View live"}
                <Arrow />
              </a>
            )}
            {project.download && (
              <a
                className="text-link"
                href={project.download}
                target="_blank"
                rel="noreferrer"
              >
                View app download
                <Arrow />
              </a>
            )}
            {project.github ? (
              <a
                className="text-link"
                href={project.github}
                target="_blank"
                rel="noreferrer"
              >
                {project.githubLabel ?? "Source code"}
                <Arrow />
              </a>
            ) : (
              <a
                className="text-link"
                href="mailto:448vedantshukla@gmail.com?subject=Vision%20Assistant%20enquiry"
              >
                Discuss this project
                <Arrow />
              </a>
            )}
          </div>
        </div>
      </header>
      <figure className={`case-art project-card--${project.tone}`}>
        <img
          src={project.image}
          alt={project.imageAlt}
          width={project.imageWidth ?? 1000}
          height={project.imageHeight ?? 700}
          fetchPriority="high"
        />
        <figcaption>
          {project.imageCaption ?? "Product illustration · Representative layout, not an application screenshot"}
        </figcaption>
      </figure>
      <section className="case-section" aria-labelledby="overview-title">
        <span className="eyebrow">THE OVERVIEW</span>
        <div data-reveal>
          <h2 id="overview-title">{project.tagline}</h2>
          <p className="case-overview">{project.overview}</p>
        </div>
      </section>
      <section className="case-section" aria-labelledby="decisions-title">
        <h2 className="eyebrow" id="decisions-title">
          ENGINEERING DECISIONS
        </h2>
        <div>
          {project.decisions.map((decision, index) => (
            <article className="decision" key={decision.title} data-reveal>
              <span>0{index + 1}</span>
              <div>
                <h3>{decision.title}</h3>
                <p>{decision.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="case-section" aria-labelledby="capabilities-heading">
        <h2 className="eyebrow" id="capabilities-heading">
          WHAT IT BRINGS TOGETHER
        </h2>
        <ul className="case-capabilities">
          {project.capabilities.map((item) => (
            <li key={item}>
              <span>↗</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
      {project.companion && <section className="companion-section" aria-labelledby="companion-title">
        <span className="eyebrow">THE SUPPORTING WEB ADMIN PANEL</span>
        <h2 id="companion-title">{project.companion.title}</h2>
        <p>{project.companion.description}</p>
        <figure><img src={project.companion.image} alt="Mahila Mitr companion web admin sign-in screen" width={1440} height={1000} loading="lazy" decoding="async" /><figcaption>Actual website capture · Public admin sign-in screen</figcaption></figure>
      </section>}
      <FeedbackForm key={project.slug} target={project.slug} />
      <Link to={`/projects/${next.slug}`} className="next-project">
        <span className="eyebrow">NEXT PROJECT / {next.number}</span>
        <span>
          {next.title}
          <Arrow />
        </span>
      </Link>
    </main>
  );
}
