import PORTFOLIO from "../config/constants";

export default function Footer() {
  const { footer } = PORTFOLIO;

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__copy">{footer.copy}</span>
        <nav className="footer__links" aria-label="Footer links">
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="footer__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
