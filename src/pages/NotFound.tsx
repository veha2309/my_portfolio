import { Link } from "react-router-dom";
import Arrow from "../components/Arrow";

export default function NotFound() {
  return (
    <main id="main" className="not-found container" tabIndex={-1}>
      <div id="top" />
      <span className="eyebrow">404 / A WRONG TURN</span>
      <h1>
        This page
        <br />
        has <em>moved on.</em>
      </h1>
      <p>
        There’s still plenty to explore. Head back to the portfolio to find my
        work and get in touch.
      </p>
      <Link className="button" to="/">
        Back to the portfolio
        <Arrow />
      </Link>
    </main>
  );
}
