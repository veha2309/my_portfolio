import { Link } from "react-router-dom";
import type { Project } from "../data/project";
import Arrow from "./Arrow";

export default function ProjectCard({ project, studio = false }: { project: Project; studio?: boolean }) {
  return (
    <article
      className={`project-card project-card--${project.tone}`}
      data-reveal
    >
      <Link to={`/projects/${project.slug}`} className="project-link">
        <div className="project-art" data-depth>
          <span className="project-art-number" aria-hidden="true">{project.number}</span>
          <img
            src={project.image}
            alt={project.imageAlt}
            width={project.imageWidth ?? 1000}
            height={project.imageHeight ?? 700}
            loading="lazy"
            decoding="async"
          />
          <span className="project-art-label">{project.imageCaption ? "PUBLIC SIGN-IN SCREEN" : "PRODUCT ILLUSTRATION"}</span>
          <span className="project-open">
            <Arrow />
          </span>
        </div>
        <div className="project-meta">
          <span>
            {project.number} / {project.category}
          </span>
          <span>{studio ? "INDEPENDENT PRODUCT" : "CASE STUDY"}</span>
        </div>
        <div className="project-heading">
          <h3>{project.title}</h3>
          <Arrow />
        </div>
        <p>{project.tagline}</p>
        {!studio && <div className="project-stack" aria-label="Selected technologies">{project.tech.slice(0, 3).map(tech => <span key={tech}>{tech}</span>)}</div>}
      </Link>
    </article>
  );
}
