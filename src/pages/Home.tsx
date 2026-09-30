import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Arrow from "../components/Arrow";
import ProjectCard from "../components/ProjectCard";
import WebsiteShowcase from "../components/WebsiteShowcase";
import FreelanceInquiry from "../components/FreelanceInquiry";
import FeedbackForm from "../components/FeedbackForm";
import { projects } from "../data/project";
import { experience } from "../data/experience";
import { skills } from "../data/skills";
import { usePageMotion } from "../hooks/usePageMotion";

const capabilities = [
  {
    title: "Web engineering",
    text: "Responsive interfaces and the systems behind them. From a focused landing page to a full-stack product.",
    tags: "React · Next.js · TypeScript · APIs",
  },
  {
    title: "Mobile experiences",
    text: "Thoughtful applications that feel at home on a smaller screen, with connected data and purposeful interactions.",
    tags: "Flutter · Dart · Firebase · Supabase",
  },
  {
    title: "Product thinking",
    text: "Turning an idea into something people can use. Connecting interface decisions with practical engineering.",
    tags: "Interface development · Integration · Delivery",
  },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [reference, setReference] = useState<{ name: string; request: number } | null>(null);
  usePageMotion(root);
  return (
    <main ref={root} id="main" tabIndex={-1}>
      <section className="hero studio-hero" id="top" aria-labelledby="hero-title">
        <div className="hero-kicker"><span className="eyebrow">VEDANT SHUKLA / DESIGN & ENGINEERING</span><span className="hero-location">NEW DELHI, INDIA</span></div>
        <div className="hero-story">
          <div className="hero-copy">
            <p className="eyebrow" data-intro>GOOD IDEAS DESERVE</p>
            <h1 id="hero-title" data-intro><span>GREAT</span><span><em>experiences.</em></span></h1>
            <p className="hero-description" data-intro>I design and build distinctive websites and thoughtful web &amp; mobile apps. Digital craft. Human feeling.</p>
            <div className="hero-actions" data-intro><Link className="button" to="/#work">View work <Arrow /></Link><a className="text-link" href="#quote">Start a project <Arrow /></a></div>
          </div>
          <div className="hero-reel" aria-label="A glimpse of selected work">
            <Link className="hero-reel-card scene-plate scene-plate--back" to="/projects/financeflow"><div><img src="/images/projects/financeflow.svg" width={1000} height={700} alt="FinanceFlow product illustration" decoding="async" /></div><span>FINANCEFLOW / ENGINEERING ↗</span></Link>
            <a className="hero-reel-card scene-plate scene-plate--middle" href="#websites"><div><img src="/images/websites/signature-cafe-preview.webp" width={640} height={444} alt="Signature Cafe rooftop website concept" decoding="async" fetchPriority="high" /></div><span>SIGNATURE CAFE / WEB DESIGN ↗</span></a>
            <a className="hero-reel-card scene-plate scene-plate--front" href="#websites"><div><img src="/images/websites/malamen-preview.webp" width={640} height={444} alt="Malamen kitchen and bar website concept" decoding="async" fetchPriority="high" /></div><span>MALAMEN / WEB DESIGN ↗</span></a>
          </div>
        </div>
        <div className="hero-bottom"><span className="availability"><i />Open to opportunities & collaborations</span><a href="#work">SCROLL TO DISCOVER <span>↓</span></a></div>
      </section>
      <section
        id="work"
        className="work container"
        aria-labelledby="work-title"
      >
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">01 / SELECTED PROJECTS</span>
            <h2 id="work-title">
              Ideas made <em>real.</em>
            </h2>
          </div>
          <p>
            Five projects. Different challenges.
            <br />
            The same attention to detail.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
        <div className="work-end">
          <span>WEB. MOBILE. EVERYTHING IN BETWEEN.</span>
          <a
            className="text-link"
            href="https://github.com/veha2309"
            target="_blank"
            rel="noreferrer"
          >
            More on GitHub
            <Arrow />
          </a>
        </div>
      </section>
      <section className="design-note container" aria-labelledby="design-note-title">
        <span className="eyebrow">THE APPROACH / FROM IDEA TO EXPERIENCE</span>
        <div className="story-progress" aria-hidden="true"><span /></div>
        <h2 id="design-note-title"><span data-editorial>Less ordinary.</span><em data-editorial>More considered.</em></h2>
        <div className="design-note-foot"><span className="design-note-symbol" aria-hidden="true">✳</span><p>A clear idea. An unexpected detail. A little movement that feels just right. I build for the moment someone decides to stay.</p></div>
      </section>
      <WebsiteShowcase onReference={name => setReference({ name, request: Date.now() })} />
      <section
        id="capabilities"
        className="capabilities container"
        aria-labelledby="capabilities-title"
      >
        <div className="capabilities-intro" data-reveal>
          <span className="eyebrow">WHAT I BRING TO THE TABLE</span>
          <h2 id="capabilities-title">
            From a good idea
            <br />
            to a <em>great product.</em>
          </h2>
          <p>
            Bringing design sensitivity and engineering discipline to the same
            table.
          </p>
        </div>
        <div className="capabilities-list">
          {capabilities.map((item, index) => (
            <article className="capability" key={item.title} data-reveal>
              <span className="capability-index">0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="capability-tags">{item.tags}</span>
              </div>
              <Arrow />
            </article>
          ))}
        </div>
      </section>
      <FreelanceInquiry reference={reference} />
      <section
        id="about"
        className="about container"
        aria-labelledby="about-title"
      >
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">04 / THE PERSON BEHIND THE PIXELS</span>
            <h2 id="about-title">
              An engineer’s mind.
              <br />A <em>maker’s instinct.</em>
            </h2>
          </div>
        </div>
        <div className="about-grid">
          <div className="about-portrait" data-reveal>
            <img
              src="/images/vedant-portrait.webp"
              width="900"
              height="1598"
              alt="Vedant Shukla"
              loading="lazy"
              decoding="async"
            />
            <span>VEDANT SHUKLA / NEW DELHI</span>
          </div>
          <div className="about-copy" data-reveal>
            <p className="about-lead">
              I like making complex things feel simple.
            </p>
            <p>
              I’m a software engineer working across web and mobile. My work
              brings together clear interfaces, connected systems, and the small
              details that make a product feel considered.
            </p>
            <p>
              From personal finance and market data to assistive technology, I’m
              drawn to products with a useful purpose. I bring that same
              curiosity to teams and independent collaborations.
            </p>
            <div className="education">
              <span className="eyebrow">EDUCATION</span>
              <p>
                BTech, Computer Science & Engineering
                <br />
                <span>Dr. Akhilesh Das Gupta ITM · CGPA 7.8</span>
              </p>
            </div>
          </div>
        </div>
        <div id="resume" className="experience-grid">
          <h3>Along the way.</h3>
          <div>
            {experience.map((job) => (
              <article className="experience-row" key={job.company} data-reveal>
                <div>
                  <h4>{job.role}</h4>
                  <p>{job.company}</p>
                </div>
                <span>{job.period}</span>
              </article>
            ))}
          </div>
        </div>
        <div className="skills-grid">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category}>
              <span className="eyebrow">{category}</span>
              <p>{items.join(" / ")}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="container"><FeedbackForm /></div>
    </main>
  );
}
