import { Link } from "react-router-dom";
import type { Project } from "../data/project";
import Arrow from "./Arrow";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className={`project-card project-card--${project.tone}`}
      data-reveal
    >
      <Link to={`/projects/${project.slug}`} className="project-link">
        <div className="project-art">
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
          <span>CASE STUDY</span>
        </div>
        <div className="project-heading">
          <h3>{project.title}</h3>
          <Arrow />
        </div>
        <p>{project.tagline}</p>
      </Link>
    </article>
  );
}
