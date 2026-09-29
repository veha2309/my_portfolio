import { contact } from "../data/project";
import Arrow from "./Arrow";

export default function Footer() {
  return (
    <footer id="contact" className="contact container">
      <div className="contact-top">
        <span className="eyebrow">04 / START A CONVERSATION</span>
        <span className="availability">
          <i />
          Open to opportunities & collaborations
        </span>
      </div>
      <a className="contact-title" href={`mailto:${contact.email}`}>
        <span>Let’s make it</span> <em>happen.</em>
        <Arrow />
      </a>
      <div className="contact-details">
        <a href={`mailto:${contact.email}`}>
          {contact.email}
          <Arrow />
        </a>
        <p>
          A new product, a good team, or an interesting idea.
          <br />
          I’d love to hear about it.
        </p>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Vedant Shukla</span>
        <span className="footer-note">
          Thoughtfully built. Always evolving.
        </span>
        <div>
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
