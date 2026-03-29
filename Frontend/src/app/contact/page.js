"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { motion } from "framer-motion";

const childFade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ContactPage() {
  const [status, setStatus] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  /* ── Smooth cursor ── */
  useEffect(() => {
    let raf, mx = -200, my = -200, cx = -200, cy = -200;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener("mousemove", onMove);
    const loop = () => {
      cx += (mx - cx) * 0.13;
      cy += (my - cy) * 0.13;
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate(${cx - 20}px,${cy - 20}px)`;
      if (cursorDotRef.current)
        cursorDotRef.current.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/connect`, data);
      setStatus(res.data.message || "Message sent — I'll get back to you soon.");
      setIsSuccess(true);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Try emailing me directly.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        * { cursor: none !important; box-sizing: border-box; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { display: none; }

        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0    rgba(255,255,255,0.3); }
          70%  { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0    rgba(255,255,255,0); }
        }
        .cursor-ring { animation: pulse-ring 2.4s ease-out infinite; }

        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #fff 70%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Input focus line animation */
        .field-line {
          position: relative;
        }
        .field-line::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: white;
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .field-line:focus-within::after { width: 100%; }
      `}</style>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="cursor-ring fixed top-0 left-0 w-10 h-10 rounded-full border border-white/40 pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9999]"
      />

      {/* Page */}
      <div
        className="bg-black min-h-screen text-white relative"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {/* Subtle noise overlay */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
        />

        {/* ── Nav ── */}
        <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:-translate-x-1"
          >
            <span className="text-base leading-none">←</span>
            <span>Back</span>
          </Link>

          <a
            href="mailto:divyanshunagar0000@gmail.com"
            className="text-white/40 hover:text-white text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:scale-105"
          >
            hello@divyanshu
          </a>
        </nav>

        {/* Side label */}
        <div className="fixed left-8 bottom-12 z-50 flex flex-col items-center gap-3">
          <div className="w-px h-16 bg-white/20" />
          <span
            className="text-white/30 text-[0.6rem] tracking-[0.25em] uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            contact
          </span>
        </div>

        {/* ── Main ── */}
        <main className="min-h-screen flex flex-col items-center justify-center px-6 py-28">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="w-full max-w-5xl"
          >
            {/* Eyebrow */}
            <motion.p
              variants={childFade}
              className="text-[0.7rem] tracking-[0.28em] uppercase text-white/40 mb-4 text-center"
            >
              Let's talk
            </motion.p>

            {/* Heading */}
            <motion.h1
              variants={childFade}
              className="gradient-text font-black text-center mb-16 leading-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(2.8rem,8vw,6.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Got a Project?
            </motion.h1>

            {/* Two-column layout */}
            <div className="grid md:grid-cols-[1fr_1px_1.4fr] gap-0 items-start">

              {/* Left — info */}
              <motion.div
                variants={childFade}
                className="pr-0 md:pr-16 pb-12 md:pb-0 flex flex-col justify-center gap-10"
              >
                <div>
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-3">
                    What I'm open to
                  </p>
                  <ul className="flex flex-col gap-2">
                    {["Freelance Projects", "Full-time Roles", "Open Source Collabs", "Quick Consultations"].map((item) => (
                      <li
                        key={item}
                        className="
                          text-sm font-medium text-white/55
                          border border-white/[0.08] rounded-lg
                          px-4 py-2.5
                          transition-all duration-300
                          hover:text-white hover:border-white/25 hover:bg-white/[0.04] hover:translate-x-1
                        "
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase text-white/30 mb-3">
                    Reach me directly
                  </p>
                  <a
                    href="mailto:divyanshunagar0000@gmail.com"
                    className="text-sm text-white/55 hover:text-white transition-colors duration-300 break-all"
                  >
                    divyanshunagar0000@gmail.com ↗
                  </a>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="hidden md:block w-px self-stretch bg-white/10 mx-8" />

              {/* Right — form */}
              <motion.div variants={childFade} className="pl-0 md:pl-8">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-8 w-full"
                >
                  {/* Name */}
                  <div className="field-line border-b border-white/15 pb-3">
                    <label className="text-[0.6rem] tracking-[0.2em] uppercase text-white/30 block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                      className="
                        w-full bg-transparent text-white text-base font-medium
                        placeholder-white/20 focus:outline-none
                      "
                    />
                  </div>

                  {/* Email */}
                  <div className="field-line border-b border-white/15 pb-3">
                    <label className="text-[0.6rem] tracking-[0.2em] uppercase text-white/30 block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      required
                      className="
                        w-full bg-transparent text-white text-base font-medium
                        placeholder-white/20 focus:outline-none
                      "
                    />
                  </div>

                  {/* Message */}
                  <div className="field-line border-b border-white/15 pb-3">
                    <label className="text-[0.6rem] tracking-[0.2em] uppercase text-white/30 block mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      placeholder="Tell me about your project..."
                      required
                      rows={4}
                      className="
                        w-full bg-transparent text-white text-base font-medium
                        placeholder-white/20 focus:outline-none resize-none
                      "
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex items-center gap-5 mt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        px-8 py-3.5 rounded-full
                        bg-white text-black text-sm font-bold tracking-widest uppercase
                        transition-all duration-300
                        hover:-translate-y-0.5 hover:bg-white/90
                        hover:shadow-[0_12px_32px_-6px_rgba(255,255,255,0.35)]
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0
                      "
                    >
                      {isSubmitting ? "Sending…" : "Send Message"}
                    </button>

                    {/* Status */}
                    {status && (
                      <motion.p
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-sm font-medium ${
                          isSuccess ? "text-white/60" : "text-red-400/80"
                        }`}
                      >
                        {status}
                      </motion.p>
                    )}
                  </div>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <p
          className="fixed bottom-6 right-10 text-white/20 text-[0.65rem] tracking-[0.15em] uppercase z-40"
        >
          © 2025 Divyanshu Nagar
        </p>
      </div>
    </>
  );
}