import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Arrow from "./Arrow";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const elements = [
        toggle.current,
        ...Array.from(
          panel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
        ),
      ].filter((el): el is HTMLButtonElement | HTMLAnchorElement => !!el);
      const first = elements[0],
        last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    const media = matchMedia("(min-width: 761px)");
    const onResize = () => {
      if (media.matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onResize);
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onResize);
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
    };
  }, [open]);

  const links = [
    ["Services", "/#capabilities"],
    ["Work", "/#work"],
    ["Web designs", "/#websites"],
    ["About", "/#about"],
    ["Contact", "/#contact"],
  ];
  return (
    <header className="site-header">
      <div className="nav-wrap container">
        <Link
          className="wordmark"
          to="/"
          aria-label="Vedant Digital Studio — home"
          onClick={() => setOpen(false)}
        >
          Vedant<span>.</span>
        </Link>
        <span className="nav-caption">DIGITAL STUDIO</span>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, to]) => (
            <Link
              key={label}
              to={to}
              aria-current={
                location.pathname === "/" && location.hash === to.slice(1)
                  ? "location"
                  : undefined
              }
            >
              {label}
            </Link>
          ))}
          <Link className="nav-contact" to="/#quote">
            Get a quote <Arrow />
          </Link>
        </nav>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? "Close" : "Menu"}
          <span className={open ? "menu-lines is-open" : "menu-lines"}>
            <i />
            <i />
          </span>
        </button>
      </div>
      {open && (
        <div ref={panel} className="mobile-menu" id="mobile-menu">
          <nav aria-label="Mobile navigation">
            {links.map(([label, to], index) => (
              <Link
                key={label}
                to={to}
                onClick={() => {
                  setOpen(false);
                  toggle.current?.focus();
                }}
              >
                <span>0{index + 1}</span>
                {label}
                <Arrow />
              </Link>
            ))}
          </nav>
          <p>
            NEW DELHI, INDIA
            <br />
            WEB & MOBILE ENGINEERING
          </p>
        </div>
      )}
    </header>
  );
}
