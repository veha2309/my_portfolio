import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Arrow from "./Arrow";
import { Link } from "react-router-dom";

const websites = [
  { slug: "malamen", name: "Malamen", category: "KITCHEN & BAR / CONCEPT REDESIGN", line: "A little atmosphere. A lasting impression.", description: "An expressive hospitality concept that moves from dinner to after-dark energy, with menus, events, and clear paths to reservations.", url: "https://malamen.vercel.app/", github: "https://github.com/veha2309/malamen" },
  { slug: "signature-cafe", name: "Signature Cafe", category: "ROOFTOP DINING / CONCEPT WEBSITE", line: "A place worth visiting. Before you arrive.", description: "Editorial typography, inviting photography, and an interactive menu bring a rooftop cafe concept to life across screens.", url: "https://signature-cafe-brown.vercel.app/", github: "https://github.com/veha2309/signature-cafe" },
];
const mobileSections = {
  malamen: [{ slug: "home", label: "First impression" }, { slug: "experience", label: "The experience" }, { slug: "dining", label: "Food & atmosphere" }],
  "signature-cafe": [{ slug: "home", label: "First impression" }, { slug: "menu", label: "Explore the menu" }, { slug: "visit", label: "Plan a visit" }],
};

export default function WebsiteShowcase() {
  const [selected, setSelected] = useState(0);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const site = websites[selected];
  const stage = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const frames = stage.current?.querySelectorAll(device === "mobile" ? ".mobile-screen" : ".website-frame");
      if (frames) gsap.fromTo(frames, { y: 44, opacity: 0, rotationX: 7, scale: 0.96, transformPerspective: 1200 }, { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.85, stagger: 0.12, ease: "power3.out", clearProps: "all" });
    });
    return () => media.revert();
  }, [selected, device]);
  return <section id="websites" className="website-section container" aria-labelledby="websites-title">
    <div className="section-heading" data-reveal>
      <div><span className="eyebrow">02 / A DISTINCTIVE PRESENCE</span><h2 id="websites-title">Your business.<br /><em>Its own atmosphere.</em></h2></div>
      <p>Two hospitality concepts. A glimpse of how design<br />can express a business before a customer walks in.</p>
    </div>
    <div className="website-showcase" data-reveal>
      <div className="showcase-toolbar">
        <div className="website-switch" role="group" aria-label="Choose a website">{websites.map((item, index) => <button key={item.slug} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index + 1}</span>{item.name}</button>)}</div>
        <div className="device-switch" role="group" aria-label="Preview size">{(["desktop", "mobile"] as const).map(size => <button key={size} type="button" aria-pressed={device === size} onClick={() => setDevice(size)}>{size === "desktop" ? "Desktop" : "Mobile"}</button>)}</div>
      </div>
      <div ref={stage} className={`website-stage website-stage--${device}`} data-site={site.slug}>
        {device === "mobile" ? <div className="mobile-screen-gallery" role="region" aria-label={`${site.name} mobile section previews`} tabIndex={0} key={site.slug}>
          {mobileSections[site.slug as keyof typeof mobileSections].map((section, index) => <figure className="mobile-screen" key={section.slug}>
            <div className="website-frame"><img src={`/images/websites/${site.slug}-mobile-${section.slug}.webp`} width={390} height={844} alt={`${site.name} mobile ${section.label.toLowerCase()} section snapshot`} loading="lazy" decoding="async" /></div>
            <figcaption><span>0{index + 1}</span>{section.label}</figcaption>
          </figure>)}
        </div> : <div className="website-frame" key={`${site.slug}-${device}`}>
          <div className="browser-bar" aria-hidden="true"><span>● ● ●</span><span>{new URL(site.url).hostname}</span><span>↗</span></div>
          <img src={`/images/websites/${site.slug}-${device}.webp`} width={device === "desktop" ? 1440 : 390} height={device === "desktop" ? 1000 : 844} alt={`${site.name} actual ${device} homepage preview`} loading="lazy" decoding="async" />
        </div>}
        <span className="preview-note">{device === "mobile" ? "3 SCROLLED SECTIONS · SWIPE TO EXPLORE" : "ACTUAL SITE CAPTURE · DESKTOP"}</span>
      </div>
      <div className="website-details" aria-live="polite">
        <div><span className="eyebrow">{site.category}</span><h3>{site.line}</h3></div>
        <div><p>{site.description}</p><div className="showcase-links"><a className="text-link" href={site.url} target="_blank" rel="noreferrer">Explore live site <Arrow /></a><a className="text-link" href={site.github} target="_blank" rel="noreferrer">Source <Arrow /></a></div></div>
      </div>
    </div>
    <div className="work-end"><span>A DISTINCTIVE PRESENCE. ON EVERY SCREEN.</span><Link className="text-link" to={`/quote?service=website&reference=${site.slug}`}>Build something like this <Arrow /></Link></div>
  </section>;
}
