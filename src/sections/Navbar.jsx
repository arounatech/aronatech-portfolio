import { useState, useEffect, useCallback } from "react";
import PORTFOLIO from "../config/constants";
import { FileDown } from "lucide-react";
import generateResumePDF from "../utils/generateResumePDF";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container navbar__inner">
        <a href="#hero" className="navbar__logo" aria-label="Home">
          Arona<span style={{ color: "var(--accent-secondary)" }}> Tech</span>
        </a>

        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {PORTFOLIO.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="navbar__link"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="navbar__cta-item">
            <button
              type="button"
              className="glass-btn glass-btn--accent navbar__cta"
              onClick={() => { closeMenu(); generateResumePDF(); }}
            >
              <FileDown size={16} /> Resume
            </button>
          </li>
        </ul>

        <button
          className={`navbar__toggle ${menuOpen ? "navbar__toggle--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Overlay to close mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: -1,
            background: "rgba(0,0,0,0.4)",
          }}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
