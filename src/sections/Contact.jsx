import { createElement, useMemo, useState } from "react";
import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";
import { MapPin, Mail, Github, Linkedin, Send } from "lucide-react";
import { sendContactMessage } from "../utils/contactApi";

export default function Contact() {
  const [ref, visible] = useInView();
  const { contact, personal } = PORTFOLIO;
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const labels = useMemo(
    () => ({
      name: contact.fields.name || "Name",
      email: contact.fields.email || "Email",
      subject: contact.fields.subject || "Subject",
      message: contact.fields.message || "Message",
    }),
    [contact.fields]
  );

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const next = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim() || form.name.trim().length < 2) {
      next.name = "Please enter your name.";
    }

    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      next.email = "Please enter a valid email.";
    }

    if (!form.subject.trim() || form.subject.trim().length < 4) {
      next.subject = "Please add a clear subject.";
    }

    if (!form.message.trim() || form.message.trim().length < 12) {
      next.message = "Please write a longer message.";
    }

    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website.trim(),
      });

      setStatus({
        type: "success",
        message: contact.successMessage || "Thanks! Your message has been sent.",
      });
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: "",
      });
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.message ||
          "Message could not be sent now. Please try again later.",
      });
    } finally {
      setSubmitting(false);
    }
  };

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
            visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
          }`}
          style={{ "--delay": "40ms" }}
        >
          {contact.heading}
        </h2>
        <div className="divider" />
        <p
          className={`section-subtitle ${
            visible ? "reveal reveal-fade is-visible" : "reveal reveal-fade"
          }`}
          style={{ "--delay": "120ms" }}
        >
          {contact.subheading}
        </p>

        <div className="contact__layout">
          <form
            className={`glass-card contact__form ${
              visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
            }`}
            style={{ "--delay": "180ms" }}
            onSubmit={onSubmit}
            noValidate
          >
            <div className="contact__form-row">
              <label className="contact__field-label" htmlFor="name">
                {labels.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className={`contact__field ${errors.name ? "contact__field--error" : ""}`}
                value={form.name}
                onChange={onFieldChange}
                maxLength={120}
                required
              />
              {errors.name && <span className="contact__field-error">{errors.name}</span>}
            </div>

            <div className="contact__form-row">
              <label className="contact__field-label" htmlFor="email">
                {labels.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`contact__field ${errors.email ? "contact__field--error" : ""}`}
                value={form.email}
                onChange={onFieldChange}
                maxLength={180}
                required
              />
              {errors.email && (
                <span className="contact__field-error">{errors.email}</span>
              )}
            </div>

            <div className="contact__form-row">
              <label className="contact__field-label" htmlFor="subject">
                {labels.subject}
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                className={`contact__field ${errors.subject ? "contact__field--error" : ""}`}
                value={form.subject}
                onChange={onFieldChange}
                maxLength={180}
                required
              />
              {errors.subject && (
                <span className="contact__field-error">{errors.subject}</span>
              )}
            </div>

            <div className="contact__form-row contact__honeypot">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={onFieldChange}
              />
            </div>

            <div className="contact__form-row">
              <label className="contact__field-label" htmlFor="message">
                {labels.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className={`contact__field contact__textarea ${
                  errors.message ? "contact__field--error" : ""
                }`}
                value={form.message}
                onChange={onFieldChange}
                maxLength={2000}
                required
              />
              {errors.message && (
                <span className="contact__field-error">{errors.message}</span>
              )}
            </div>

            {status.message && (
              <p
                className={`contact__status ${
                  status.type === "success"
                    ? "contact__status--success"
                    : "contact__status--error"
                }`}
                role="status"
              >
                {status.message}
              </p>
            )}

            <button
              className="glass-btn glass-btn--accent contact__submit"
              type="submit"
              disabled={submitting}
            >
              <Send size={16} />
              {submitting ? "Sending..." : contact.submitLabel}
            </button>
          </form>

          <div
            className={`contact__cards ${
              visible ? "reveal reveal-up is-visible" : "reveal reveal-up"
            }`}
            style={{ "--delay": "240ms" }}
          >
            {items.map(({ icon: Icon, label, href }, i) => {
              const inner = (
                <>
                  <span className="contact__info-icon">{createElement(Icon, { size: 20 })}</span>
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
      </div>
    </section>
  );
}
