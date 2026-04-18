import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PORTFOLIO from "../config/constants";
import useInView from "../hooks/useInView";
import { MapPin, Mail, Github, Linkedin, Send, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "../utils/contactApi";

export default function Contact() {
  const MODAL_EXIT_MS = 220;
  const [ref, visible] = useInView();
  const { contact, personal } = PORTFOLIO;
  const modalCloseTimeoutRef = useRef(null);
  const modalEnterFrameRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({
    open: false,
    closing: false,
    visible: false,
    type: "success",
    title: "",
    message: "",
    details: [],
  });
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

  const hideModalImmediate = () =>
    setModal((prev) => ({
      ...prev,
      open: false,
      closing: false,
      visible: false,
    }));

  const closeModal = () =>
    setModal((prev) => {
      if (!prev.open || prev.closing) return prev;
      return {
        ...prev,
        closing: true,
      };
    });

  const openModal = ({ type, title, message, details = [] }) => {
    if (modalCloseTimeoutRef.current) {
      clearTimeout(modalCloseTimeoutRef.current);
      modalCloseTimeoutRef.current = null;
    }
    if (modalEnterFrameRef.current) {
      cancelAnimationFrame(modalEnterFrameRef.current);
      modalEnterFrameRef.current = null;
    }
    setModal({
      open: true,
      closing: false,
      visible: false,
      type,
      title,
      message,
      details,
    });
    modalEnterFrameRef.current = requestAnimationFrame(() => {
      modalEnterFrameRef.current = requestAnimationFrame(() => {
        setModal((prev) =>
          prev.open && !prev.closing
            ? {
                ...prev,
                visible: true,
              }
            : prev
        );
      });
    });
  };

  useEffect(() => {
    if (!modal.open) return undefined;
    const { overflow: previousOverflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modal.open]);

  useEffect(() => {
    if (!modal.open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [modal.open]);

  useEffect(() => {
    if (!modal.closing) return undefined;
    modalCloseTimeoutRef.current = setTimeout(() => {
      setModal((prev) => ({
        ...prev,
        open: false,
        closing: false,
        visible: false,
      }));
      modalCloseTimeoutRef.current = null;
    }, MODAL_EXIT_MS);

    return () => {
      if (modalCloseTimeoutRef.current) {
        clearTimeout(modalCloseTimeoutRef.current);
        modalCloseTimeoutRef.current = null;
      }
    };
  }, [modal.closing, MODAL_EXIT_MS]);

  useEffect(
    () => () => {
      if (modalCloseTimeoutRef.current) {
        clearTimeout(modalCloseTimeoutRef.current);
      }
      if (modalEnterFrameRef.current) {
        cancelAnimationFrame(modalEnterFrameRef.current);
      }
    },
    []
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
    const issues = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanName = form.name.trim();
    const cleanSubject = form.subject.trim();
    const cleanMessage = form.message.trim();

    if (cleanName.includes("<") || cleanName.includes(">")) {
      next.name = "Name contains invalid characters.";
      issues.push("Use plain text in your name.");
    }

    if (!cleanName || cleanName.length < 2 || cleanName.length > 120) {
      next.name = "Please enter your name.";
      issues.push("Name must be between 2 and 120 characters.");
    }

    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      next.email = "Please enter a valid email.";
      issues.push("Email address is invalid.");
    }

    if (
      !cleanSubject ||
      cleanSubject.length < 4 ||
      cleanSubject.length > 180 ||
      cleanSubject.includes("<") ||
      cleanSubject.includes(">")
    ) {
      next.subject = "Please add a clear subject.";
      issues.push("Subject must be 4-180 characters without HTML.");
    }

    if (!cleanMessage || cleanMessage.length < 12 || cleanMessage.length > 2000) {
      next.message = "Please write a longer message.";
      issues.push("Message must be between 12 and 2000 characters.");
    }

    const payloadSize = new Blob([
      JSON.stringify({
        name: cleanName,
        email: form.email.trim(),
        subject: cleanSubject,
        message: cleanMessage,
      }),
    ]).size;
    if (payloadSize > 20000) {
      next.message = "Your message is too long.";
      issues.push("Payload exceeds safe request size.");
    }

    return { next, issues };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    hideModalImmediate();

    const { next: nextErrors, issues } = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      openModal({
        type: "error",
        title: "Please review your message",
        message: "We found a few issues in the form input.",
        details: issues,
      });
      return;
    }

    setSubmitting(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      openModal({
        type: "success",
        title: "Message sent",
        message: contact.successMessage || "Thanks! Your message has been sent.",
      });
      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      openModal({
        type: "error",
        title: "Sending failed",
        message:
          error?.message ||
          "Failed to send message. Please try again.",
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

  const modalContent =
    modal.open &&
    createPortal(
      <div
        className={[
          "contact-modal__backdrop",
          modal.closing ? "contact-modal__backdrop--closing" : "",
          modal.visible ? "contact-modal__backdrop--open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={modal.title}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal();
          }
        }}
      >
        <div
          className={[
            "contact-modal",
            `contact-modal--${modal.type}`,
            modal.closing ? "contact-modal--closing" : "",
            modal.visible ? "contact-modal--open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <button
            type="button"
            className="contact-modal__close"
            onClick={closeModal}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          <div className="contact-modal__icon" aria-hidden="true">
            {modal.type === "success" ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <h3 className="contact-modal__title">{modal.title}</h3>
          <p className="contact-modal__message">{modal.message}</p>
          {modal.details.length > 0 && (
            <ul className="contact-modal__list">
              {modal.details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="glass-btn glass-btn--accent contact-modal__action"
            onClick={closeModal}
          >
            Got it
          </button>
        </div>
      </div>,
      document.body
    );

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

      {modalContent}
    </section>
  );
}
