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
            visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
          }`}
        >
          About Me
        </h2>
        <div className="divider" />

        <div className="about__content">
          <p
            className={`about__narrative ${
              visible ? "animate__animated animate__fadeInLeft" : "anim-hidden"
            }`}
            style={{ animationDelay: "0.15s" }}
          >
            {narrative}
          </p>

          <div
            className={`about__highlights ${
              visible ? "animate__animated animate__fadeInRight" : "anim-hidden"
            }`}
            style={{ animationDelay: "0.25s" }}
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
