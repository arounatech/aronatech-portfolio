import { lazy, Suspense } from "react";
import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";
import {
  Server,
  Code2,
  Terminal,
  Layers,
  Shield,
  Database,
} from "lucide-react";

const RadarChart = lazy(() => import("../components/RadarChart"));

const GROUP_ICONS = {
  "Server Stacks": Server,
  "PHP Frameworks": Code2,
  "Languages & Runtimes": Terminal,
  "Frameworks & Libraries": Layers,
  "DevOps & DevSecOps": Shield,
  "Databases": Database,
};

export default function Skills() {
  const [ref, visible] = useInView();
  const { skillGroups, radarSkills } = PORTFOLIO;

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="container">
        <h2
          className={`section-title ${
            visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
          }`}
          style={{ "--delay": "40ms" }}
        >
          Skills &amp; Expertise
        </h2>
        <div className="divider" />
        <p
          className={`section-subtitle ${
            visible ? "reveal reveal-fade is-visible" : "reveal reveal-fade"
          }`}
          style={{ "--delay": "120ms" }}
        >
          A snapshot of my technical toolkit — backend-first, security-minded.
        </p>

        {/* D3 Radar Chart */}
        <div
          className={`skills__radar-wrapper ${
            visible ? "reveal reveal-scale is-visible" : "reveal reveal-scale"
          }`}
          style={{ "--delay": "180ms" }}
        >
          <Suspense fallback={<div className="skills__radar-skeleton" />}>
            <RadarChart skills={radarSkills} />
          </Suspense>
        </div>

        {/* Skill group cards with icons + animated bars */}
        <div className="skills__groups">
          {skillGroups.map((group, gi) => {
            const Icon = GROUP_ICONS[group.group] || Code2;
            return (
              <div
                key={group.group}
                className={`glass-card skill-group ${
                  visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
                }`}
                style={{ "--delay": `${Math.round(100 * gi + 280)}ms` }}
              >
                <div className="skill-group__header">
                  <span className="skill-group__icon-wrap">
                    <Icon size={20} />
                  </span>
                  <h3 className="skill-group__title">{group.group}</h3>
                </div>

                <div className="skill-group__list">
                  {group.skills.map((s, si) => (
                    <div className="skill-bar" key={s.name}>
                      <div className="skill-bar__top">
                        <span className="skill-bar__name">{s.name}</span>
                        <span className="skill-bar__pct">{s.level}%</span>
                      </div>
                      <div className="skill-bar__track">
                        <div
                          className="skill-bar__fill"
                          style={{
                            width: visible ? `${s.level}%` : "0%",
                            transitionDelay: `${0.08 * si + 0.3}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
