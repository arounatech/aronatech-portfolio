import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";

export default function About() {
  const [ref, visible] = useInView();
  const { narrative, highlights } = PORTFOLIO.about;

  return (
    <section id="about" className="section" ref={ref}>
      <div className="container">
        <h2
          className={`section-title ${
            visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
          }`}
          style={{ "--delay": "40ms" }}
        >
          About Me
        </h2>
        <div className="divider" />

        <div className="about__content">
          <p
            className={`about__narrative ${
              visible ? "reveal reveal-left is-visible" : "reveal reveal-left"
            }`}
            style={{ "--delay": "140ms" }}
          >
            {narrative}
          </p>

          <div
            className={`about__highlights ${
              visible ? "reveal reveal-right is-visible" : "reveal reveal-right"
            }`}
            style={{ "--delay": "220ms" }}
          >
            {highlights.map((item, i) => (
              <div className="about__highlight" key={i}>
                <span className="about__highlight-icon" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
