import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import Arrow from "./Arrow";

export default function ExternalLinkPrompt() {
  const dialog = useRef<HTMLDialogElement>(null);
  const origin = useRef<HTMLAnchorElement | null>(null);
  const [destination, setDestination] = useState<URL | null>(null);

  useEffect(() => {
    const intercept = (event: MouseEvent) => {
      if (event.type === "auxclick" && event.button !== 1) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.hasAttribute("data-external-confirmed")) return;
      const url = new URL(anchor.href, window.location.href);
      if (!["https:", "http:", "mailto:"].includes(url.protocol) || url.origin === window.location.origin) return;
      event.preventDefault();
      event.stopPropagation();
      origin.current = anchor;
      setDestination(url);
    };
    document.addEventListener("click", intercept, true);
    document.addEventListener("auxclick", intercept, true);
    return () => {
      document.removeEventListener("click", intercept, true);
      document.removeEventListener("auxclick", intercept, true);
    };
  }, []);

  useLayoutEffect(() => {
    if (!destination || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(element, { y: 24, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out", clearProps: "all" });
    });
    return () => {
      media.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [destination]);

  const close = () => dialog.current?.close();
  const isEmail = destination?.protocol === "mailto:";
  return <dialog ref={dialog} className="external-dialog" aria-labelledby="external-title" aria-describedby="external-description" onClose={() => { setDestination(null); origin.current?.focus({ preventScroll: true }); }}>
    <div className="external-dialog-top"><span className="eyebrow">{isEmail ? "LET’S START A CONVERSATION" : "A SMALL DETOUR"}</span><span aria-hidden="true">↗</span></div>
    <h2 id="external-title">{isEmail ? <>An idea to share?<br /><em>Let’s talk.</em></> : <>A little further.<br /><em>A new window.</em></>}</h2>
    <p id="external-description">{isEmail ? "This will open your default email app to compose a message. Nothing is sent until you send it yourself." : "You’re about to leave this portfolio and visit another website in a new tab."}</p>
    <div className="external-destination"><span>{isEmail ? "EMAIL TO" : "YOUR DESTINATION"}</span><strong>{isEmail ? destination.pathname : destination?.hostname}</strong>{!isEmail && <span>{destination ? `${destination.pathname}${destination.search}${destination.hash}` : ""}</span>}</div>
    <div className="external-dialog-actions"><button className="button button-secondary" type="button" autoFocus onClick={close}>Stay here</button>{destination && <a className="button button-primary" href={destination.href} target={isEmail ? undefined : "_blank"} rel="noopener noreferrer" data-external-confirmed onClick={close}>{isEmail ? "Open email app" : "Continue"} <Arrow /></a>}</div>
    <p className="external-footnote">Your place here stays open.</p>
  </dialog>;
}
