import { useEffect, useLayoutEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { projects } from "../data/project";

const positions = new Map<string, number>();
const aliases: Record<string, string> = {
  "#projects": "#work",
  "#home": "#top",
};

export default function RouteEffects() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    const hash = aliases[location.hash] ?? location.hash;
    // Capture the saved value before native hash scrolling can emit a scroll event.
    const savedPosition = positions.get(location.key);
    let disposed = false;
    let frame = 0;
    const restore = () => {
      if (navigationType === "POP" && savedPosition !== undefined)
        window.scrollTo({
          top: savedPosition,
          behavior: "instant",
        });
      else if (hash)
        document.getElementById(hash.slice(1))?.scrollIntoView({
          behavior:
            navigationType === "POP" ||
            matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
        });
      else window.scrollTo({ top: 0, behavior: "instant" });
      if (navigationType !== "POP" && !hash)
        document
          .querySelector<HTMLElement>("main")
          ?.focus({ preventScroll: true });
    };
    // Font metrics and ScrollTrigger's initial refresh must settle before deep links.
    void document.fonts.ready.then(() => {
      if (!disposed) frame = requestAnimationFrame(restore);
    });
    const save = () => {
      positions.set(location.key, window.scrollY);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", save);
    };
  }, [location.key, location.hash, location.pathname, navigationType]);

  useEffect(() => {
    const project = projects.find(
      (item) => location.pathname === `/projects/${item.slug}`,
    );
    const home = location.pathname === "/";
    const title = project
      ? `${project.title} — Vedant Digital Studio`
      : home
        ? "Vedant Digital Studio — Websites, Web & Mobile Apps"
        : location.pathname === "/admin" ? "Project enquiries — Vedant Digital Studio" : "Page not found — Vedant Digital Studio";
    const description =
      project?.description ??
      "Vedant Digital Studio is an independent design and engineering studio creating distinctive websites and thoughtful web and mobile applications.";
    document.title = title;
    const meta = (key: string, value: string) => {
      const attribute = key.startsWith("og:") ? "property" : "name";
      let element = document.head.querySelector<HTMLMetaElement>(
        `meta[${attribute}="${key}"]`,
      );
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = value;
    };
    meta("description", description);
    meta("og:title", title);
    meta("og:description", description);
    meta("og:url", `${window.location.origin}${location.pathname}`);
    meta("robots", home || project ? "index, follow" : "noindex, follow");
  }, [location.pathname]);
  return null;
}
