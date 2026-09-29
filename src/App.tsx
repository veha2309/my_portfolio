import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import RouteEffects from "./components/RouteEffects";
import ExternalLinkPrompt from "./components/ExternalLinkPrompt";

const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
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
