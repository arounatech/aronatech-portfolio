import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";
import { Phone, Mail, Rocket, FileDown } from "lucide-react";
import generateResumePDF from "../utils/generateResumePDF";

export default function Hero() {
  const [ref, visible] = useInView({ threshold: 0.1 });
  const { name, role, bio, phone, email } = PORTFOLIO.personal;

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className="container hero__inner">
        <div className="hero__text">
          <p
            className={`hero__greeting ${
              visible ? "animate__animated animate__fadeInDown" : "anim-hidden"
            }`}
          >
            Hello, I&apos;m
          </p>

          <h1
            className={`hero__name ${
              visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
            }`}
          >
            {name}
          </h1>

          <p
            className={`hero__role ${
              visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
            }`}
            style={{ animationDelay: "0.15s" }}
          >
            {role}
          </p>

          <p
            className={`hero__bio ${
              visible ? "animate__animated animate__fadeIn" : "anim-hidden"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            {bio}
          </p>

          <div
            className={`hero__actions ${
              visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
            }`}
            style={{ animationDelay: "0.45s" }}
          >
            <a href={`tel:${phone}`} className="glass-btn glass-btn--primary">
              <Phone size={16} /> Call Me
            </a>
            <a href={`mailto:${email}`} className="glass-btn">
              <Mail size={16} /> Email
            </a>
            <a href="#projects" className="glass-btn">
              <Rocket size={16} /> View Projects
            </a>
            <button
              type="button"
              className="glass-btn glass-btn--accent"
              onClick={() => generateResumePDF()}
            >
              <FileDown size={16} /> Download Resume
            </button>
          </div>
        </div>

        <div
          className={`hero__avatar-wrapper ${
            visible ? "animate__animated animate__zoomIn" : "anim-hidden"
          }`}
          style={{ animationDelay: "0.3s" }}
        >
          <div className="hero__avatar-glow" aria-hidden="true" />
          <img
            src="/1763410278091.jpeg"
            alt={`${name} profile photo`}
            className="hero__avatar"
            width="280"
            height="280"
          />
        </div>
      </div>
    </section>
  );
}
