import { Link } from "react-router-dom";
import { contact } from "../data/project";
import Arrow from "./Arrow";

export default function Footer() {
  return (
    <footer id="contact" className="contact container">
      <div className="contact-top">
        <span className="eyebrow">VEDANT DIGITAL STUDIO / NEW DELHI</span>
        <span className="availability">
          <i />
          Independent design & development
        </span>
      </div>
      <a className="contact-title" href={`mailto:${contact.email}`}>
        <span>Let’s make it</span> <em>happen.</em>
        <Arrow />
      </a>
      <div className="contact-details">
        <Link className="text-link" to="/quote">Request a quote <Arrow /></Link>
        <a href={`mailto:${contact.email}`}>
          {contact.email}
          <Arrow />
        </a>
        <p>
          Websites and digital products for your next chapter.
          <br />
          Led by Vedant Shukla. Built around your business.
        </p>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Vedant Digital Studio</span>
        <span className="footer-note">
          Thoughtfully built. Always evolving.
        </span>
        <div>
          <Link to="/work">All work <Arrow /></Link>
          <Link to="/feedback">Private feedback</Link>
          <a href={contact.github} target="_blank" rel="noreferrer">
            GitHub <Arrow />
          </a>
          <a href={contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <Arrow />
          </a>
          <a href="#top" aria-label="Back to top" className="back-top">
            ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
