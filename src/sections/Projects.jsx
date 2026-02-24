import { useState, useMemo } from "react";
import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";

export default function Projects() {
  const [ref, visible] = useInView();
  const { projects } = PORTFOLIO;

  /* Derive unique tags from all projects */
  const allTags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(
    () =>
      activeTag === "All"
        ? projects
        : projects.filter((p) => (p.tags || []).includes(activeTag)),
    [activeTag, projects]
  );

  return (
    <section id="projects" className="section" ref={ref}>
      <div className="container">
        <h2
          className={`section-title ${
            visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
          }`}
        >
          Projects
        </h2>
        <div className="divider" />
        <p
          className={`section-subtitle ${
            visible ? "animate__animated animate__fadeIn" : "anim-hidden"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          A selection of systems I&apos;ve designed, built, and shipped.
        </p>

        {/* Filter tags */}
        <div
          className={`projects__filters ${
            visible ? "animate__animated animate__fadeIn" : "anim-hidden"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          {allTags.map((t) => (
            <button
              key={t}
              className={`tag ${activeTag === t ? "tag--active" : ""}`}
              onClick={() => setActiveTag(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Project cards grid */}
        <div className="projects__grid">
          {filtered.map((project, i) => (
            <article
              key={project.name}
              className={`glass-card project-card ${
                visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
              }`}
              style={{ animationDelay: `${0.15 * i + 0.25}s` }}
            >
              {project.image ? (
                <div className="project-card__img-wrapper">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="project-card__img"
                    loading="lazy"
                    width="600"
                    height="375"
                  />
                </div>
              ) : (
                <div className="project-card__img-wrapper project-card__img-placeholder">
                  <span>{project.name.charAt(0)}</span>
                </div>
              )}

              <div className="project-card__body">
                <h3 className="project-card__title">{project.name}</h3>
                <p className="project-card__desc">{project.description}</p>

                <div className="project-card__tags">
                  {(project.stack || []).map((s) => (
                    <span className="tag" key={s}>
                      {s}
                    </span>
                  ))}
                </div>

                <div className="project-card__footer">
                  {project.year && (
                    <span className="project-card__year">{project.year}</span>
                  )}
                  {project.domain && (
                    <a
                      href={project.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-btn"
                      style={{ fontSize: "0.82rem", padding: "0.45rem 1rem" }}
                    >
                      Visit ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
