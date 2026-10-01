import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RouteEffects from "./components/RouteEffects";
import ExternalLinkPrompt from "./components/ExternalLinkPrompt";

const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Admin = lazy(() => import("./pages/Admin"));
const Work = lazy(() => import("./pages/Work"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Quote = lazy(() => import("./pages/Quote"));

export default function App() {
  const location = useLocation();
  if (location.pathname === '/' && location.hash === '#quote') return <Navigate to="/quote" replace />;
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <NavBar />
      <Suspense
        fallback={
          <main id="main" className="route-loading" aria-busy="true">
            <p role="status">Opening the project…</p>
          </main>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/projects/:slug" element={<CaseStudy />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <RouteEffects />
      </Suspense>
      <Footer />
      <ExternalLinkPrompt />
    </>
  );
}
