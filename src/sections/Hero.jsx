import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";
import {
  Mail,
  Rocket,
  FileDown,
  ShieldCheck,
  ServerCog,
  Sparkles,
} from "lucide-react";
import downloadResume from "../utils/downloadResume";

export default function Hero() {
  const [ref, visible] = useInView({ threshold: 0.1 });
  const { name, role, bio, email } = PORTFOLIO.personal;
  const { projects, skillGroups } = PORTFOLIO;

  const totalSkills = skillGroups.reduce(
    (sum, group) => sum + group.skills.length,
    0
  );
  const metrics = [
    { label: "Projects Shipped", value: `${projects.length}+` },
    { label: "Technologies", value: `${totalSkills}+` },
    { label: "Core Focus", value: "Full Stack Developer" },
  ];

  return (
    <section id="hero" className="hero" ref={ref}>
      <div className="container hero__inner">
        <div className="hero__text">
          <p
            className={`hero__greeting ${
              visible ? "reveal reveal-down is-visible" : "reveal reveal-down"
            }`}
            style={{ "--delay": "60ms" }}
          >
            Hello, I&apos;m
          </p>

          <h1
            className={`hero__name hero__name--creative ${
              visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
            }`}
            style={{ "--delay": "120ms" }}
          >
            <span>{name}</span>
            <span className="hero__name-highlight">Building secure systems at scale.</span>
          </h1>

          <p
            className={`hero__role ${
              visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
            }`}
            style={{ "--delay": "180ms" }}
          >
            {role}
          </p>

          <p
            className={`hero__bio ${
              visible ? "reveal reveal-fade is-visible" : "reveal reveal-fade"
            }`}
            style={{ "--delay": "240ms" }}
          >
            {bio}
          </p>

          <div
            className={`hero__metrics ${
              visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
            }`}
            style={{ "--delay": "280ms" }}
          >
            {metrics.map((metric) => (
              <div className="glass-card hero__metric-card" key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>

          <div
            className={`hero__actions ${
              visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
            }`}
            style={{ "--delay": "340ms" }}
          >
            <a href={`mailto:${email}`} className="glass-btn">
              <Mail size={16} /> Email
            </a>
            <a href="#projects" className="glass-btn">
              <Rocket size={16} /> View Projects
            </a>
            <button
              type="button"
              className="glass-btn glass-btn--accent"
              onClick={() => downloadResume()}
            >
              <FileDown size={16} /> Download Resume
            </button>
          </div>
        </div>

        <div
          className={`hero__avatar-wrapper ${
            visible ? "reveal reveal-scale is-visible" : "reveal reveal-scale"
          }`}
          style={{ "--delay": "200ms" }}
        >
          <div className="hero__visual-shell glass-card" aria-hidden="true">
            <div className="hero__orb hero__orb--a" />
            <div className="hero__orb hero__orb--b" />
            <div className="hero__radial-ring hero__radial-ring--outer" />
            <div className="hero__radial-ring hero__radial-ring--inner" />
            <img
              src="/1763410278091.jpeg"
              alt={`${name} profile photo`}
              className="hero__avatar"
              width="320"
              height="320"
            />
          </div>

          <div className="hero__floating hero__floating--one glass-card">
            <ShieldCheck size={16} />
            <span>Secure-by-Design APIs</span>
          </div>
          <div className="hero__floating hero__floating--two glass-card">
            <ServerCog size={16} />
            <span>Cloud-Native Delivery</span>
          </div>
          <div className="hero__floating hero__floating--three glass-card">
            <Sparkles size={16} />
            <span>DevSecOps Automation</span>
          </div>
        </div>
      </div>
    </section>
  );
}
