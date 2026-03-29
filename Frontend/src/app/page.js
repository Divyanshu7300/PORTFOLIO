"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ─── Data ─── */
const SKILLS = [
  {
    label: "Frontend",
    icon: "⚡",
    items: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Backend",
    icon: "🛠",
    items: ["Node.js", "Express", "MongoDB", "REST APIs"],
  },
  {
    label: "Machine Learning",
    icon: "🧠",
    items: ["Python", "Pandas", "NumPy", "Scikit-learn"],
  },
  {
    label: "Core",
    icon: "📐",
    items: ["DSA (Python)", "Git & GitHub", "Problem Solving"],
  },
];

// Sections array — add/remove freely, everything auto-adjusts
const SECTIONS = ["hero", "about", "skills", "projects", "contact"];

/* ─── Variants ─── */
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -60,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const childFade = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ════════════════════════════════════════════ */
export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [slide, setSlide] = useState(0);
  const [isAnimating, setAnimating] = useState(false);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const lockRef = useRef(false);

  /* ── Fetch projects ── */
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
      .then((r) => setProjects(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* ── Reset slide when leaving projects section ── */
  useEffect(() => {
    if (SECTIONS[current] !== "projects") setSlide(0);
  }, [current]);

  /* ── Three.js Particle Background ── */
  useEffect(() => {
    let renderer, scene, camera, frameId;
    let W = window.innerWidth,
      H = window.innerHeight;
    let mouseX = 0,
      mouseY = 0;

    const init = async () => {
      const THREE = await import("three");

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000000, 5, 15);

      camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.z = 8;

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      const particleCount = 1500;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = [];

      for (let i = 0; i < particleCount; i++) {
        const radius = 4 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        velocities.push({
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        });

        const gray = 0.6 + Math.random() * 0.4;
        colors[i * 3] = gray;
        colors[i * 3 + 1] = gray;
        colors[i * 3 + 2] = gray;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const createCircleTexture = () => {
        const size = 128;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createRadialGradient(
          size / 2, size / 2, 0,
          size / 2, size / 2, size / 2
        );
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
        gradient.addColorStop(0.5, "rgba(255,255,255,0.3)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(canvas);
      };

      const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        map: createCircleTexture(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      const light = new THREE.PointLight(0xffffff, 1);
      light.position.set(2, 3, 4);
      scene.add(light);

      const onMouseMove = (e) => {
        mouseX = (e.clientX / W) * 2 - 1;
        mouseY = (e.clientY / H) * 2 - 1;
      };
      window.addEventListener("mousemove", onMouseMove);

      let time = 0;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.01;
        const pos = geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] += velocities[i].x;
          pos[i * 3 + 1] += velocities[i].y;
          pos[i * 3 + 2] += velocities[i].z;

          const wave = Math.sin(time + i) * 0.002;
          pos[i * 3] += mouseX * 0.01 + wave;
          pos[i * 3 + 1] += mouseY * 0.01 + wave;

          const bound = 7;
          if (Math.abs(pos[i * 3]) > bound) velocities[i].x *= -1;
          if (Math.abs(pos[i * 3 + 1]) > bound) velocities[i].y *= -1;
          if (Math.abs(pos[i * 3 + 2]) > bound) velocities[i].z *= -1;
        }

        geometry.attributes.position.needsUpdate = true;
        particles.rotation.y = mouseX * 0.5;
        particles.rotation.x = mouseY * 0.5;
        mouseX *= 0.95;
        mouseY *= 0.95;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        W = window.innerWidth;
        H = window.innerHeight;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      };
      window.addEventListener("resize", onResize);

      return () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);
        renderer.dispose();
      };
    };

    init();
  }, []);

  /* ── Smooth cursor ── */
  useEffect(() => {
    let raf,
      mx = -200,
      my = -200,
      cx = -200,
      cy = -200;
    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
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

  /* ── Section navigation ── */
  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= SECTIONS.length || lockRef.current) return;
    lockRef.current = true;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => {
      lockRef.current = false;
      setAnimating(false);
    }, 900);
  }, []);

  /* ── Wheel & key handling ── */
  useEffect(() => {
    // On projects section, only allow vertical section scroll if at first/last slide
    const onWheel = (e) => {
      e.preventDefault();
      const isProjects = SECTIONS[current] === "projects";
      const maxSlide = Math.max(0, projects.length - 3);

      if (isProjects) {
        if (e.deltaY > 30) {
          if (slide < maxSlide) {
            setSlide((s) => Math.min(maxSlide, s + 1));
          } else {
            goTo(current + 1);
          }
        }
        if (e.deltaY < -30) {
          if (slide > 0) {
            setSlide((s) => Math.max(0, s - 1));
          } else {
            goTo(current - 1);
          }
        }
      } else {
        if (e.deltaY > 30) goTo(current + 1);
        if (e.deltaY < -30) goTo(current - 1);
      }
    };

    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(current + 1);
      if (e.key === "ArrowUp" || e.key === "PageUp") goTo(current - 1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [current, goTo, slide, projects.length]);

  /* ── Touch swipe (vertical = section, horizontal = project slide) ── */
  useEffect(() => {
    let startY = 0;
    let startX = 0;
    const onStart = (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };
    const onEnd = (e) => {
      const dy = startY - e.changedTouches[0].clientY;
      const dx = startX - e.changedTouches[0].clientX;
      const isProjects = SECTIONS[current] === "projects";
      const maxSlide = Math.max(0, projects.length - 3);

      if (isProjects && Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe on projects
        if (dx > 50) setSlide((s) => Math.min(maxSlide, s + 1));
        if (dx < -50) setSlide((s) => Math.max(0, s - 1));
      } else {
        if (dy > 50) goTo(current + 1);
        if (dy < -50) goTo(current - 1);
      }
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [current, goTo, projects.length]);

  const maxSlide = Math.max(0, projects.length - 3);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        * { cursor: none !important; box-sizing: border-box; }
        body { overflow: hidden; }
        ::-webkit-scrollbar { display: none; }

        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(255,255,255,0.3); }
          70%  { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0   rgba(255,255,255,0); }
        }
        .cursor-ring { animation: pulse-ring 2.4s ease-out infinite; }

        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #fff 70%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* ── Three.js Canvas ── */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" />

      {/* ── Custom Cursor ── */}
      <div
        ref={cursorRef}
        className="cursor-ring fixed top-0 left-0 w-10 h-10 rounded-full border border-white/40 pointer-events-none z-[9999] mix-blend-difference"
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9999]"
      />

      {/* ── Navigation ── */}
      <nav
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-12 py-6"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <a
          href="mailto:divyanshunagar0000@gmail.com"
          className="text-white/40 hover:text-white text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:scale-105 hover:translate-x-2"
        >
          hello@divyanshu
        </a>

        {/* Center dots — dynamic, works for any number of sections */}
        <div className="flex items-center gap-3">
          {SECTIONS.map((s, i) => (
            <button
              key={s}
              onClick={() => goTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                current === i ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        <a
          href="https://linkedin.com/in/divyanshu0000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:scale-105 hover:-translate-x-2"
        >
          LinkedIn ↗
        </a>
      </nav>

      {/* ── Side section label ── */}
      <div className="fixed left-8 bottom-12 z-50 flex flex-col items-center gap-3">
        <div className="w-px h-16 bg-white/20" />
        <span
          className="text-white/30 text-[0.6rem] tracking-[0.25em] uppercase"
          style={{ writingMode: "vertical-rl", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {SECTIONS[current]}
        </span>
      </div>

      {/* ── Section counter — auto updates for any section count ── */}
      <div
        className="fixed right-8 bottom-12 z-50 text-right"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <span className="text-white text-sm font-bold">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/20 text-sm">
          {" "}/ {String(SECTIONS.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Sections ── */}
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">

          {/* ── HERO ── */}
          {current === 0 && (
            <motion.section
              key="hero"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex flex-col items-center justify-center text-center px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <motion.p
                variants={childFade}
                className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8 font-medium"
              >
                Software Development Engineer
              </motion.p>

              <motion.h1
                variants={childFade}
                className="gradient-text font-black leading-none mb-1 tracking-tight"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(5rem,16vw,12rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                DIVYANSHU
              </motion.h1>

              <motion.h2
                variants={childFade}
                className="font-black leading-none text-white/40 mb-4 tracking-tight"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(4rem,13vw,10rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                NAGAR
              </motion.h2>

              <motion.p
                variants={childFade}
                className="text-white/40 text-base md:text-lg max-w-md mt-6 leading-relaxed"
              >
                Building scalable web apps & ML-powered products.
              </motion.p>

              <motion.div variants={childFade} className="flex gap-4 mt-12">
                <button
                  onClick={() => goTo(SECTIONS.indexOf("projects"))}
                  className="
                    relative px-8 py-3.5 rounded-full
                    text-white text-sm font-semibold tracking-widest uppercase
                    border border-white/20
                    bg-white/5 backdrop-blur-sm
                    transition-all duration-300
                    hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5
                    hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.15)]
                  "
                >
                  View Work
                </button>

                <a
                  href="mailto:divyanshunagar0000@gmail.com"
                  className="
                    relative px-8 py-3.5 rounded-full
                    text-black text-sm font-bold tracking-widest uppercase
                    bg-white
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_32px_-6px_rgba(255,255,255,0.35)]
                    hover:bg-white/90
                  "
                >
                  Hire Me
                </a>
              </motion.div>

              <motion.div
                variants={childFade}
                className="absolute bottom-20 flex flex-col items-center gap-2"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
                />
                <span className="text-white/20 text-[0.6rem] tracking-[0.2em] uppercase">
                  scroll
                </span>
              </motion.div>
            </motion.section>
          )}

          {/* ── ABOUT ── */}
          {current === 1 && (
            <motion.section
              key="about"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-4xl w-full grid md:grid-cols-2 gap-16 items-center">
                <motion.div variants={childFade}>
                  <p className="text-[0.7rem] tracking-[0.25em] uppercase text-white/40 mb-4">
                    About me
                  </p>
                  <h2
                    className="gradient-text font-black leading-none mb-6"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(3rem,8vw,6rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    WHO AM I?
                  </h2>
                  <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/5" />
                  </div>
                </motion.div>

                <motion.div variants={stagger} initial="hidden" animate="visible">
                  <motion.p
                    variants={childFade}
                    className="text-white/70 text-lg leading-relaxed"
                  >
                    I build scalable and interactive web applications while
                    exploring ML-powered features and modern engineering
                    practices — turning ideas into intuitive, high-performance
                    products.
                  </motion.p>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* ── SKILLS ── */}
          {current === 2 && (
            <motion.section
              key="skills"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-6 py-20 overflow-y-auto"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-6xl w-full">
                <motion.div variants={childFade} className="mb-12 text-center">
                  <p className="text-[0.7rem] tracking-[0.25em] uppercase text-white/40 mb-3">
                    Expertise
                  </p>
                  <h2
                    className="gradient-text font-black"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(2.5rem,6vw,5rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Tech Stack
                  </h2>
                </motion.div>

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {SKILLS.map((skill) => (
                    <motion.div
                      key={skill.label}
                      variants={childFade}
                      className="
                        p-6 rounded-2xl bg-white/5
                        border border-white/[0.08]
                        backdrop-blur-sm
                        transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                        hover:-translate-y-2
                        hover:border-white/30
                        hover:bg-white/[0.08]
                        hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]
                      "
                    >
                      <div className="text-3xl mb-4 leading-none">{skill.icon}</div>
                      <p className="text-[0.65rem] tracking-[0.18em] uppercase text-white/50 font-semibold mb-5">
                        {skill.label}
                      </p>
                      <div className="flex flex-col gap-2">
                        {skill.items.map((item) => (
                          <span
                            key={item}
                            className="
                              block text-sm font-medium text-white/60
                              border border-white/10 rounded-lg
                              px-3 py-2 text-center
                              transition-all duration-300
                              hover:bg-white hover:text-black hover:translate-x-1
                              hover:border-white
                            "
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* ── PROJECTS ── */}
          {current === 3 && (
            <motion.section
              key="projects"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-6xl w-full py-12">
                {/* Header */}
                <motion.div
                  variants={childFade}
                  className="flex items-end justify-between mb-8"
                >
                  <div>
                    <p className="text-[0.7rem] tracking-[0.25em] uppercase text-white/40 mb-2">
                      Work
                    </p>
                    <h2
                      className="gradient-text font-black"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "clamp(2.5rem,6vw,5rem)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Projects
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-white/30 text-sm tabular-nums">
                      {loading ? "—" : `${projects.length} total`}
                    </span>

                    {/* Arrow nav — only shows if more than 3 projects */}
                    {!loading && projects.length > 3 && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSlide((s) => Math.max(0, s - 1))}
                          disabled={slide === 0}
                          className="
                            w-9 h-9 rounded-full flex items-center justify-center
                            border border-white/15 bg-white/[0.04]
                            text-white/50 text-sm
                            transition-all duration-300
                            hover:border-white/35 hover:bg-white/[0.09] hover:text-white
                            disabled:opacity-25 disabled:pointer-events-none
                          "
                        >
                          ←
                        </button>
                        <button
                          onClick={() => setSlide((s) => Math.min(maxSlide, s + 1))}
                          disabled={slide >= maxSlide}
                          className="
                            w-9 h-9 rounded-full flex items-center justify-center
                            border border-white/15 bg-white/[0.04]
                            text-white/50 text-sm
                            transition-all duration-300
                            hover:border-white/35 hover:bg-white/[0.09] hover:text-white
                            disabled:opacity-25 disabled:pointer-events-none
                          "
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Loading */}
                {loading ? (
                  <div className="flex gap-3 justify-center py-20">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 bg-white rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Cards grid — animates on slide change */}
                    <div className="overflow-hidden">
                      <motion.div
                        key={slide}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                      >
                        {projects.slice(slide, slide + 3).map((project, index) => (
                          <a
                            key={project._id}
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              block rounded-2xl overflow-hidden group
                              border border-white/[0.08]
                              bg-white/[0.03] backdrop-blur-sm
                              transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]
                              hover:-translate-y-2
                              hover:border-white/25
                              hover:bg-white/[0.06]
                              hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]
                            "
                          >
                            {/* Image */}
                            <div className="h-52 overflow-hidden bg-white/5">
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              />
                            </div>

                            {/* Body */}
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-3">
                                <span className="text-white/30 text-xs tracking-widest uppercase tabular-nums">
                                  {String(slide + index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-white/30 text-sm group-hover:text-white/70 transition-colors duration-300">
                                  ↗
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-white mb-2 tracking-tight leading-snug">
                                {project.title}
                              </h3>
                              <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {project.technologies.slice(0, 3).map((tech, idx) => (
                                  <span
                                    key={idx}
                                    className="
                                      text-[0.7rem] font-medium
                                      px-2.5 py-1 rounded-full
                                      border border-white/15 text-white/45
                                      tracking-wide
                                    "
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </a>
                        ))}
                      </motion.div>
                    </div>

                    {/* Dots — only if more than 3 projects */}
                    {projects.length > 3 && (
                      <div className="flex justify-center gap-2 mt-7">
                        {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setSlide(i)}
                            className={`rounded-full transition-all duration-300 ${
                              i === slide
                                ? "w-5 h-1.5 bg-white"
                                : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.section>
          )}

          {/* ── CONTACT ── */}
          {current === 4 && (
            <motion.section
              key="contact"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-2xl w-full text-center">
                <motion.p
                  variants={childFade}
                  className="text-[0.7rem] tracking-[0.28em] uppercase text-white/40 mb-6"
                >
                  Let's talk
                </motion.p>

                <motion.h2
                  variants={childFade}
                  className="gradient-text font-black mb-6"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "clamp(3rem,9vw,7rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Got a Project?
                </motion.h2>

                <motion.p
                  variants={childFade}
                  className="text-white/50 text-lg mb-10 leading-relaxed"
                >
                  I'm only a message away. Let's build something unforgettable together.
                </motion.p>

                <motion.div
                  variants={childFade}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Link href="/contact">
                    <button
                      className="
                        px-8 py-3.5 rounded-full
                        text-white text-sm font-semibold tracking-widest uppercase
                        border border-white/20
                        bg-white/5 backdrop-blur-sm
                        transition-all duration-300
                        hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5
                        hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.15)]
                      "
                    >
                      Send Message
                    </button>
                  </Link>

                  <a
                    href="mailto:divyanshunagar0000@gmail.com"
                    className="
                      px-8 py-3.5 rounded-full
                      text-black text-sm font-bold tracking-widest uppercase
                      bg-white
                      transition-all duration-300
                      hover:-translate-y-0.5 hover:bg-white/90
                      hover:shadow-[0_12px_32px_-6px_rgba(255,255,255,0.35)]
                    "
                  >
                    Direct Email
                  </a>
                </motion.div>

                <motion.p
                  variants={childFade}
                  className="text-white/20 text-xs tracking-[0.15em] uppercase mt-16"
                >
                  © 2025 Divyanshu Nagar
                </motion.p>
              </div>
            </motion.section>
          )}

          {/*
            ── ADD MORE SECTIONS BELOW ──
            Copy this template and add the section name to SECTIONS array above.
            Counter, nav dots, side label — sab auto update hoga.

            {current === 5 && (
              <motion.section
                key="new-section"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full h-full flex items-center justify-center px-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <div className="max-w-4xl w-full">
                  ...your content...
                </div>
              </motion.section>
            )}
          */}

        </AnimatePresence>
      </div>
    </>
  );
}