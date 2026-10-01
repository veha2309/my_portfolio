import { useRef } from "react";
import { Link } from "react-router-dom";
import Arrow from "../components/Arrow";
import ProjectCard from "../components/ProjectCard";
import WebsiteShowcase from "../components/WebsiteShowcase";
import { inquiryProfiles } from "../data/inquiry";
import { projects } from "../data/project";
import { usePageMotion } from "../hooks/usePageMotion";

const services = [
  { service: "Website" as const, link: "Plan your website", title: "Brand websites", text: "Give your business a distinctive home online. Help visitors understand what you offer and take the next step.", deliverables: "Custom page design · Mobile layouts · Enquiry journeys", fit: "For businesses launching or refreshing their online presence." },
  { service: "Web app" as const, link: "Discuss your web app", title: "Web applications", text: "Turn a business idea or a recurring task into a useful digital product, with clear interfaces and connected data.", deliverables: "Product interfaces · Accounts & data · Connected workflows", fit: "For founders and businesses building a tool or service." },
  { service: "Mobile app" as const, link: "Explore your app idea", title: "Mobile experiences", text: "Bring your product closer to the people who use it, with a considered app experience built around their everyday needs.", deliverables: "App design & development · Connected services · Release preparation", fit: "For ideas that belong in your customer's pocket." },
];
const process = [
  { title: "Find the direction", text: "Start with your business, audience, and the change you want to make. Agree on the scope, priorities, and a tailored quote.", outcome: "A shared brief" },
  { title: "Shape the experience", text: "Explore the visual direction and key screens. Review the design together before it becomes a working website or app.", outcome: "An approved direction" },
  { title: "Bring it to life", text: "Build the agreed experience, connect the services it needs, and review progress at the milestones set for your project.", outcome: "A working preview" },
  { title: "Prepare for launch", text: "Check the experience across screens and agree on delivery, deployment, and the handover your project needs.", outcome: "A clear handover" },
];
const questions = [
  { question: "What does a project cost?", answer: "The quote depends on the pages or features, design requirements, integrations, and delivery scope. Share your idea through the project form. We’ll discuss the details before a personalised quote is prepared." },
  { question: "How long will it take?", answer: "Timing depends on the scope and when content, feedback, and approvals are available. We’ll agree on a realistic schedule and review milestones before the build starts." },
  { question: "What if I only have an idea?", answer: "That’s enough to start a conversation. Describe your business, who you want to reach, and what you want the website or app to do. We’ll work through the direction and what belongs in the first version." },
  { question: "Who will I work with?", answer: "You’ll work directly with Vedant Shukla, the designer and engineer behind Vedant Digital Studio. The person discussing your goals is also the person shaping and building the experience." },
  { question: "What happens after the build?", answer: "Deployment, hosting, ownership of accounts, handover materials, and any ongoing support are discussed as part of the project scope. That way you know what is included and what you’ll need after launch." },
];
const selectedProducts = projects.filter(project => ['stockpulse', 'vision-assistant'].includes(project.slug));

export default function Home() {
  const root = useRef<HTMLElement>(null);
  usePageMotion(root);
  return (
    <main ref={root} id="main" tabIndex={-1} className="studio-home">
      <section className="hero studio-hero" id="top" aria-labelledby="hero-title">
        <div className="hero-atmosphere" aria-hidden="true"><div className="atmosphere-grid" /><div className="atmosphere-glow" /><span className="atmosphere-coordinate">VEDANT DIGITAL STUDIO / NEW DELHI</span></div>
        <div className="hero-kicker"><span className="eyebrow">WEBSITES & DIGITAL PRODUCTS FOR YOUR NEXT CHAPTER</span><span className="hero-location"><span className="location-dot" aria-hidden="true" />NEW DELHI, INDIA</span></div>
        <div className="hero-story">
          <div className="hero-copy">
            <p className="hero-prelude" data-intro><span aria-hidden="true">↳</span> FROM FIRST IMPRESSION TO LASTING CONNECTION</p>
            <h1 id="hero-title"><span className="hero-word"><span data-hero-word>YOUR BRAND.</span></span><span className="hero-word"><em data-hero-word>made digital.</em></span></h1>
            <p className="hero-description" data-intro>Websites that express who you are.<br />Digital products that make life easier.<br />A studio that brings design and development together.</p>
            <div className="hero-actions" data-intro><Link className="button" to="/quote">Start a project <Arrow /></Link><Link className="text-link" to="/#websites">View work <Arrow /></Link></div>
            <div className="hero-assurance" data-intro><span>Independent studio</span><span>Direct collaboration</span><span>Design through delivery</span></div>
          </div>
          <div className="hero-reel" aria-label="A glimpse of selected work">
            <div className="reel-sculpture" aria-hidden="true"><div className="sculpture-core" /><div className="sculpture-ring sculpture-ring--one" /><div className="sculpture-ring sculpture-ring--two" /><div className="sculpture-ring sculpture-ring--three" /></div>
            <span className="reel-caption" aria-hidden="true">A FEEL FOR WHAT’S POSSIBLE</span>
            <div className="reel-entrance"><div className="reel-depth" data-depth>
              <Link className="hero-reel-card scene-plate scene-plate--back" to="/projects/financeflow"><div><img src="/images/projects/financeflow.svg" width={1000} height={700} alt="FinanceFlow product illustration" decoding="async" /></div><span>FINANCEFLOW / INDEPENDENT PRODUCT ↗</span></Link>
              <a className="hero-reel-card scene-plate scene-plate--middle" href="#websites"><div><img src="/images/websites/signature-cafe-preview.webp" width={640} height={444} alt="Signature Cafe rooftop website concept" decoding="async" fetchPriority="high" /></div><span>SIGNATURE CAFE / WEBSITE CONCEPT ↗</span></a>
              <a className="hero-reel-card scene-plate scene-plate--front" href="#websites"><div><img src="/images/websites/malamen-preview.webp" width={640} height={444} alt="Malamen kitchen and bar website concept" decoding="async" fetchPriority="high" /></div><span>MALAMEN / WEBSITE CONCEPT ↗</span></a>
            </div></div>
            <div className="craft-seal" aria-hidden="true"><span>DESIGN MEETS</span><b>✳</b><span>DEVELOPMENT</span></div>
            <span className="reel-index" aria-hidden="true">SELECTED EXPLORATIONS <span>01 — 03</span></span>
          </div>
        </div>
        <div className="hero-bottom"><span className="hero-signature">Your business. <em>A distinctive presence.</em></span><a href="#websites">EXPLORE THE POSSIBILITIES <span>↓</span></a></div>
      </section>
      <div className="studio-disciplines" aria-label="Designed around your business. Built around your customers."><div className="discipline-track" aria-hidden="true">{[0, 1].map(copy => <div className="discipline-group" key={copy}><span>YOUR BUSINESS</span><i>✳</i><span>YOUR CUSTOMERS</span><i>✳</i><span>A BETTER DIGITAL EXPERIENCE</span><i>✳</i></div>)}</div></div>
      <section id="capabilities" className="capabilities studio-services container" aria-labelledby="capabilities-title">
        <div className="section-heading capabilities-intro" data-reveal><div><span className="eyebrow">01 / WHAT THE STUDIO CAN DO FOR YOU</span><h2 id="capabilities-title">Your next move.<br /><em>Thoughtfully made.</em></h2></div><p>Launching something new, refreshing your presence,<br />or making an idea useful. Start here.</p></div>
        <div className="capabilities-list">{services.map((service, index) => <article className="capability service-card" key={service.title} data-reveal><span className="capability-index">0{index + 1}</span><div><h3>{service.title}</h3><p>{service.text}</p><span className="service-fit">{service.fit}</span><span className="capability-tags">{service.deliverables}</span><Link className="text-link" to={`/quote?service=${inquiryProfiles[service.service].slug}`}>{service.link} <Arrow /></Link></div></article>)}</div>
      </section>
      <WebsiteShowcase />
      <section id="work" className="work container studio-product-work" aria-labelledby="work-title">
        <div className="section-heading" data-reveal><div><span className="eyebrow">03 / BEYOND THE WEBSITE</span><h2 id="work-title">Useful ideas.<br /><em>Working products.</em></h2></div><p>Independent products that show the studio’s approach<br />to everyday needs, connected data, and thoughtful interfaces.</p></div>
        <div className="project-grid">{selectedProducts.map(project => <ProjectCard key={project.slug} project={project} studio />)}</div>
        <div className="work-end"><span>INDEPENDENT PRODUCT EXPLORATIONS</span><Link className="text-link" to="/work">Explore all work <Arrow /></Link></div>
      </section>
      <section id="process" className="design-note studio-process-section container" aria-labelledby="process-title">
        <span className="eyebrow">04 / HOW WE GET THERE, TOGETHER</span><div className="story-progress" aria-hidden="true"><span /></div>
        <h2 id="process-title"><span data-editorial>A clear path.</span><em data-editorial>From idea to launch.</em></h2>
        <div className="process-grid">{process.map((step, index) => <article key={step.title} data-reveal><span className="process-number">0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p><span className="process-outcome">{step.outcome}</span></article>)}</div>
      </section>
      <section id="about" className="about studio-founder container" aria-labelledby="about-title">
        <div className="about-grid">
          <div className="about-portrait" data-reveal><img src="/images/vedant-portrait.webp" width="900" height="1598" alt="Vedant Shukla, founder of Vedant Digital Studio" loading="lazy" decoding="async" /><span>VEDANT SHUKLA / FOUNDER, DESIGNER & ENGINEER</span></div>
          <div className="about-copy" data-reveal><span className="eyebrow">05 / THE PERSON BEHIND THE STUDIO</span><h2 id="about-title">A small studio.<br /><em>A personal commitment.</em></h2><p className="about-lead">Hello, I’m Vedant.</p><p>I started Vedant Digital Studio to bring considered design and practical development into one conversation. I build websites, web applications, and mobile experiences for people who care about what they put into the world.</p><p>You work directly with me, from understanding your business to shaping the design and building the experience. That means a shared direction, a clear point of contact, and someone who knows the details of your project.</p><div className="founder-values"><span>One point of contact</span><span>Design & development together</span><span>A scope we agree on</span></div><Link className="text-link" to="/quote">Tell me about your business <Arrow /></Link></div>
        </div>
      </section>
      <section className="studio-faq container" aria-labelledby="faq-title"><div data-reveal><span className="eyebrow">06 / BEFORE WE BEGIN</span><h2 id="faq-title">A few things<br /><em>you might wonder.</em></h2></div><div className="faq-list">{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">＋</span></summary><p>{item.answer}</p></details>)}</div></section>
    </main>
  );
}
