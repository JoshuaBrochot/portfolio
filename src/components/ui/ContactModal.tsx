"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "loading" | "success" | "error";

const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3, delay: 0.2 } },
};

// Animation slide depuis le haut (mobile: fullscreen, desktop: panel)
const PANEL_VARIANTS = {
  hidden: { y: "-100%" },
  visible: {
    y: "0%",
    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const },
  },
  exit: {
    y: "-100%",
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const },
  },
};

// Stagger sur les champs du formulaire
const FIELD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.35 + i * 0.07, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Désactiver le scroll quand le modal est ouvert
  useEffect(() => {
    const lenis = (window as any).lenis

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
    return () => {
      document.body.style.overflow = ''
      if (lenis) lenis.start()
    }
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Une erreur est survenue.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });

      // Fermeture automatique après succès
      setTimeout(() => {
        onClose();
        setTimeout(() => setStatus("idle"), 600);
      }, 2200);
    } catch {
      setErrorMsg("Impossible de contacter le serveur.");
      setStatus("error");
    }
  }

  const fields = [
    { id: "name",    label: "Nom",     type: "input",    inputType: "text",  placeholder: "John Doe" },
    { id: "email",   label: "Email",   type: "input",    inputType: "email", placeholder: "vous@exemple.fr" },
    { id: "subject", label: "Sujet",   type: "input",    inputType: "text",  placeholder: "Proposition de stage" },
    { id: "message", label: "Message", type: "textarea", inputType: "",      placeholder: "Bonjour Joshua..." },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay sombre ── */}
          <motion.div
            key="contact-overlay"
            variants={OVERLAY_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              cursor: "pointer",
            }}
            aria-hidden="true"
          />

          {/* ── Panneau principal (slide from top) ── */}
          <motion.div
            key="contact-panel"
            variants={PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Formulaire de contact"
            className="fixed z-[99998] bg-[var(--bg-card)] overflow-y-auto
              top-0 left-0 right-0 bottom-0 p-5
              sm:top-0 sm:left-1/2 sm:-translate-x-1/2 sm:bottom-auto sm:right-auto sm:w-[640px] sm:max-h-[90dvh] sm:border sm:border-[var(--accent-border)] sm:border-t-0 sm:rounded-b-2xl sm:p-8 md:p-12"
          >
            {/* ── Header modal ── */}
            <div className="flex justify-between items-start mb-6 sm:mb-8">
              <div>
                <p className="font-mono text-[10px] sm:text-[11px] tracking-widest uppercase text-[var(--accent)] mb-1.5">
                  // contact
                </p>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-[2.2rem] text-[var(--text-primary)] leading-tight">
                  Travaillons ensemble
                </h2>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={onClose}
                aria-label="Fermer le formulaire de contact"
                className="bg-transparent border border-[var(--accent-border)] rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0 text-[var(--text-muted)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {/* Croix SVG */}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* ── Succès ── */}
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 sm:py-12"
                >
                  {/* Icône check */}
                  <div className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full border-2 border-[var(--accent)] flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12L10 17L19 8"
                        stroke="var(--accent)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text-primary)] mb-2">
                    Message envoyé !
                  </p>
                  <p className="font-mono text-xs sm:text-[0.85rem] text-[var(--text-muted)]">
                    Je reviendrai vers toi rapidement.
                  </p>
                </motion.div>
              ) : (
                /* ── Formulaire ── */
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 sm:gap-5"
                >
                  {fields.map((field, i) => (
                    <motion.div
                      key={field.id}
                      custom={i}
                      variants={FIELD_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      className="flex flex-col gap-1.5"
                    >
                      <label
                        htmlFor={field.id}
                        className="font-mono text-[10px] sm:text-[11px] tracking-wider uppercase text-[var(--text-muted)]"
                      >
                        {field.label}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          id={field.id}
                          name={field.id}
                          value={form[field.id]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                          rows={5}
                          className="font-mono text-sm sm:text-[0.9rem] text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--accent-border)] rounded-lg px-3 py-2.5 sm:px-4 sm:py-3.5 outline-none resize-vertical transition-all duration-200 w-full box-border focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-ghost)]"
                        />
                      ) : (
                        <input
                          ref={i === 0 ? firstInputRef : undefined}
                          id={field.id}
                          name={field.id}
                          type={field.inputType}
                          value={form[field.id]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          required
                          className="font-mono text-sm sm:text-[0.9rem] text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--accent-border)] rounded-lg px-3 py-2.5 sm:px-4 sm:py-3.5 outline-none transition-all duration-200 w-full box-border focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-ghost)]"
                        />
                      )}
                    </motion.div>
                  ))}

                  {/* Message d'erreur */}
                  {status === "error" && (
                    <p className="font-mono text-xs sm:text-[0.8rem] text-[#FF6B6B] border border-[rgba(255,107,107,0.3)] rounded-lg p-3 sm:p-4 bg-[rgba(255,107,107,0.05)]">
                      {errorMsg}
                    </p>
                  )}

                  {/* Bouton envoyer */}
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    custom={4}
                    variants={FIELD_VARIANTS}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-mono font-medium text-sm sm:text-[0.9rem] tracking-wider flex items-center justify-center gap-2.5"
                    style={{
                      background: status === "loading" ? "var(--accent-ghost)" : "var(--accent)",
                      color: status === "loading" ? "var(--accent)" : "#0A0A0A",
                      border: "none",
                      pointerEvents: status === "loading" ? "none" : "auto",
                    }}
                  >
                    {status === "loading" ? (
                      <>
                        {/* Spinner SVG */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{ animation: "spin 0.8s linear infinite" }}
                        >
                          <circle
                            cx="8" cy="8" r="6"
                            stroke="var(--accent)"
                            strokeWidth="2"
                            strokeDasharray="28"
                            strokeDashoffset="10"
                            strokeLinecap="round"
                          />
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        Envoyer le message
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M1 7H13M8 2L13 7L8 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
