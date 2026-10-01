import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import Arrow from '../components/Arrow';
import { projects } from '../data/project';
import { usePageMotion } from '../hooks/usePageMotion';

export default function Work() {
  const root = useRef<HTMLElement>(null);
  usePageMotion(root);
  return <main id="main" ref={root} tabIndex={-1} className="studio-work-page">
    <header className="archive-header container" id="top"><Link className="back-link" to="/">← BACK TO THE STUDIO</Link><span className="eyebrow">THE WORK / INDEPENDENT PRODUCTS & EXPLORATIONS</span><h1 data-intro>Ideas made <em>real.</em></h1><p data-intro>Explore the thinking behind five independent web and mobile products. These projects show how the studio connects design, useful features, and the systems behind them.</p><Link className="text-link" to="/#websites">Explore the website concepts <Arrow /></Link></header>
    <section className="work container" aria-label="Independent product case studies"><div className="project-grid">{projects.map(project => <ProjectCard project={project} key={project.slug} />)}</div><div className="work-end"><span>HAVE SOMETHING IN MIND?</span><Link className="text-link" to="/quote">Discuss your project <Arrow /></Link></div></section>
  </main>;
}
