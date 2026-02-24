import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";
import { MapPin, Phone, Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  const [ref, visible] = useInView();
  const { contact, personal } = PORTFOLIO;

  const items = [
    { icon: MapPin, label: personal.location, href: null },
    { icon: Mail, label: personal.email, href: `mailto:${personal.email}` },
    { icon: Github, label: "GitHub", href: personal.socials.github },
    { icon: Linkedin, label: "LinkedIn", href: personal.socials.linkedin },
  ];

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <h2
          className={`section-title ${
            visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
          }`}
        >
          {contact.heading}
        </h2>
        <div className="divider" />
        <p
          className={`section-subtitle ${
            visible ? "animate__animated animate__fadeIn" : "anim-hidden"
          }`}
          style={{ animationDelay: "0.1s" }}
        >
          {contact.subheading}
        </p>

        <div
          className={`contact__cards ${
            visible ? "animate__animated animate__fadeInUp" : "anim-hidden"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          {items.map(({ icon: Icon, label, href }, i) => {
            const inner = (
              <>
                <span className="contact__info-icon">
                  <Icon size={20} />
                </span>
                <span>{label}</span>
              </>
            );

            return href ? (
              <a
                key={i}
                href={href}
                className="glass-card contact__card"
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {inner}
              </a>
            ) : (
              <div key={i} className="glass-card contact__card">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
