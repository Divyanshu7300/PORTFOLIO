"use client";

import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================
// DATA — Skills aur Sections
// ============================================================

const SKILLS = [
  {
    label: "Machine Learning",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    items: [
      { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Scikit-learn", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
      { name: "PyTorch", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
      { name: "Pandas", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
      { name: "NumPy", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
      { name: "PySpark", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" },
    ],
  },
  {
    label: "Backend",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    items: [
      { name: "FastAPI", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
      { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", dark: true },
      { name: "REST APIs", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
    ],
  },
  {
    label: "Databases",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    items: [
      { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
      { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    ],
  },
  {
    label: "Tools",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    items: [
      { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "Linux", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
    ],
  },
];

// Portfolio ke saare sections — order important hai
const SECTIONS = ["hero", "about", "skills", "projects", "contact"];

// ============================================================
// ANIMATION VARIANTS — Framer Motion ke liye
// ============================================================

// Har section ka enter/exit animation
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

// Children elements ke liye stagger effect
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// Individual child fade-in animation
const childFade = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================================
// SKILL CARD COMPONENT
// Active card = center mein bada, side cards = chhote dimmed
// ============================================================

function SkillCard({ skill, active, indexLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{
        opacity: active ? 1 : 0.4,
        y: 0,
        scale: active ? 1 : 0.82, // side cards thode chhote
      }}
      transition={{ duration: 0.35 }}
      className={`rounded-[24px] md:rounded-[30px] border backdrop-blur-sm transition-all duration-300 ${
        active
          ? "bg-white/[0.09] border-white/20 shadow-[0_24px_60px_-25px_rgba(255,255,255,0.18)] p-5 md:p-7"
          : "bg-white/[0.03] border-white/10 p-4 md:p-5"
      }`}
    >
      {/* Card Header — logo + label + index number */}
      <div
        className={`flex ${
          active ? "items-center justify-between" : "flex-col items-center"
        } gap-3 mb-4`}
      >
        <img
          src={skill.logo}
          alt={skill.label}
          className={`object-contain ${
            active ? "w-12 h-12 md:w-14 md:h-14" : "w-8 h-8 md:w-10 md:h-10"
          }`}
          // Logo load fail ho toh hide kar do — broken icon nahi dikhega
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className={active ? "text-right" : "text-center mt-1"}>
          <p
            className={`uppercase tracking-[0.18em] text-white/45 font-semibold ${
              active ? "text-[0.68rem]" : "text-[0.56rem]"
            }`}
          >
            {skill.label}
          </p>
          {/* Index number sirf active card pe dikhao */}
          {active && (
            <span className="text-white text-base md:text-xl font-semibold">
              {indexLabel}
            </span>
          )}
        </div>
      </div>

      {/* Card Body — active card mein full items, side mein preview */}
      {active ? (
        // Active card — saare items grid mein
        // 2 ya kam items = single column, zyada = 2 columns
        <div
          className={`grid gap-2.5 ${
            skill.items.length <= 2 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {skill.items.map((item) => (
            <span
              key={item.name}
              className="flex items-center gap-2.5 text-sm font-medium text-white border border-white/15 rounded-xl px-3 py-2.5 bg-white/[0.05] hover:bg-white/[0.10] hover:border-white/25 transition-all duration-300"
            >
              <img
                src={item.logo}
                alt={item.name}
                className={`w-5 h-5 object-contain flex-shrink-0 ${
                  item.dark ? "invert" : "" // dark logos ko invert karo
                }`}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="truncate">{item.name}</span>
            </span>
          ))}
        </div>
      ) : (
        // Side cards — sirf pehle 3 items text mein dikhao
        <div className="flex flex-col gap-2 items-center">
          {skill.items.slice(0, 3).map((item) => (
            <span
              key={item.name}
              className="w-full text-[0.6rem] md:text-[0.65rem] text-center text-white/50 border border-white/10 rounded-lg px-2 py-1.5 bg-white/[0.03] truncate"
            >
              {item.name}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============================================================
// MAIN PORTFOLIO PAGE COMPONENT
// ============================================================

export default function PortfolioPage() {
  // Projects backend se fetch honge
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Current section index (0=hero, 1=about, 2=skills, 3=projects, 4=contact)
  const [current, setCurrent] = useState(0);

  // Skills aur Projects ke liye horizontal slide index
  const [skillSlide, setSkillSlide] = useState(0);
  const [projectSlide, setProjectSlide] = useState(0);

  // Refs for Three.js canvas aur custom cursor
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  // Section scroll lock — ek baar ek hi scroll ho
  const lockRef = useRef(false);
  // Horizontal slide lock — rapid fire swipe prevent karo
  const horizontalLockRef = useRef(false);

  // ============================================================
  // FETCH PROJECTS from backend
  // ============================================================
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
      .then((r) => setProjects(Array.isArray(r.data) ? r.data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  // Section change hone pe slides reset karo
  useEffect(() => {
    if (SECTIONS[current] !== "projects") setProjectSlide(0);
    if (SECTIONS[current] !== "skills") setSkillSlide(0);
  }, [current]);

  // ============================================================
  // THREE.JS PARTICLE BACKGROUND
  // Floating particles jo mouse ke saath move karti hain
  // ============================================================
  useEffect(() => {
    let renderer, scene, camera, frameId;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let mouseX = 0;
    let mouseY = 0;

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

      // 1500 particles sphere mein distribute karo
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

        // Random slow drift velocity
        velocities.push({
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        });

        // Gray-white color range
        const gray = 0.6 + Math.random() * 0.4;
        colors[i * 3] = gray;
        colors[i * 3 + 1] = gray;
        colors[i * 3 + 2] = gray;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // Soft circular particle texture
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

      // Animation loop
      let time = 0;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        time += 0.01;
        const pos = geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] += velocities[i].x;
          pos[i * 3 + 1] += velocities[i].y;
          pos[i * 3 + 2] += velocities[i].z;

          // Wave effect + mouse influence
          const wave = Math.sin(time + i) * 0.002;
          pos[i * 3] += mouseX * 0.01 + wave;
          pos[i * 3 + 1] += mouseY * 0.01 + wave;

          // Boundary bounce
          const bound = 7;
          if (Math.abs(pos[i * 3]) > bound) velocities[i].x *= -1;
          if (Math.abs(pos[i * 3 + 1]) > bound) velocities[i].y *= -1;
          if (Math.abs(pos[i * 3 + 2]) > bound) velocities[i].z *= -1;
        }

        geometry.attributes.position.needsUpdate = true;
        particles.rotation.y = mouseX * 0.5;
        particles.rotation.x = mouseY * 0.5;
        // Mouse damping
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

  // ============================================================
  // CUSTOM CURSOR — smooth lag cursor
  // ============================================================
  useEffect(() => {
    let raf;
    let mx = -200, my = -200; // actual mouse position
    let cx = -200, cy = -200; // cursor ring position (lagged)

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    const loop = () => {
      // Smooth interpolation — ring cursor thoda peeche aata hai
      cx += (mx - cx) * 0.13;
      cy += (my - cy) * 0.13;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx - 20}px,${cy - 20}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ============================================================
  // NAVIGATION — section ke beech move karo
  // Lock prevent karta hai rapid multiple scrolls
  // ============================================================
  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= SECTIONS.length || lockRef.current) return;
    lockRef.current = true;
    setCurrent(idx);
    setTimeout(() => {
      lockRef.current = false;
    }, 700);
  }, []);

  // Horizontal slide trigger — skills/projects ke liye
  const triggerHorizontalSlide = useCallback(
    (direction) => {
      if (horizontalLockRef.current) return;
      horizontalLockRef.current = true;

      if (SECTIONS[current] === "skills") {
        setSkillSlide((s) =>
          direction === "next"
            ? Math.min(SKILLS.length - 1, s + 1)
            : Math.max(0, s - 1)
        );
      }
      if (SECTIONS[current] === "projects") {
        setProjectSlide((s) =>
          direction === "next"
            ? Math.min(Math.max(projects.length - 1, 0), s + 1)
            : Math.max(0, s - 1)
        );
      }

      setTimeout(() => {
        horizontalLockRef.current = false;
      }, 420);
    },
    [current, projects.length]
  );

  // ============================================================
  // MOUSE WHEEL — vertical scroll = section change
  // Skills/Projects mein horizontal slide bhi handle karo
  // ============================================================
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();

      // Skills section mein scroll = skill slide change
      if (SECTIONS[current] === "skills") {
        if (e.deltaY > 30 && skillSlide < SKILLS.length - 1) {
          setSkillSlide((s) => Math.min(SKILLS.length - 1, s + 1));
          return;
        }
        if (e.deltaY < -30 && skillSlide > 0) {
          setSkillSlide((s) => Math.max(0, s - 1));
          return;
        }
      }

      // Projects section mein scroll = project slide change
      if (SECTIONS[current] === "projects") {
        if (e.deltaY > 30 && projectSlide < projects.length - 1) {
          setProjectSlide((s) => Math.min(projects.length - 1, s + 1));
          return;
        }
        if (e.deltaY < -30 && projectSlide > 0) {
          setProjectSlide((s) => Math.max(0, s - 1));
          return;
        }
      }

      // Normal vertical navigation
      if (e.deltaY > 30) goTo(current + 1);
      if (e.deltaY < -30) goTo(current - 1);
    };

    // Keyboard navigation
    const onKey = (e) => {
      if (SECTIONS[current] === "skills") {
        if (e.key === "ArrowRight") { setSkillSlide((s) => Math.min(SKILLS.length - 1, s + 1)); return; }
        if (e.key === "ArrowLeft")  { setSkillSlide((s) => Math.max(0, s - 1)); return; }
      }
      if (SECTIONS[current] === "projects") {
        if (e.key === "ArrowRight") { setProjectSlide((s) => Math.min(projects.length - 1, s + 1)); return; }
        if (e.key === "ArrowLeft")  { setProjectSlide((s) => Math.max(0, s - 1)); return; }
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") goTo(current + 1);
      if (e.key === "ArrowUp"   || e.key === "PageUp")   goTo(current - 1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, [current, goTo, projectSlide, projects.length, skillSlide]);

  // ============================================================
  // TOUCH SUPPORT — mobile swipe gestures
  // ============================================================
  useEffect(() => {
    let startY = 0, startX = 0;

    const onStart = (e) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const onEnd = (e) => {
      const dy = startY - e.changedTouches[0].clientY;
      const dx = startX - e.changedTouches[0].clientX;

      // Horizontal swipe on skills
      if (SECTIONS[current] === "skills" && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
        if (dx > 0) setSkillSlide((s) => Math.min(SKILLS.length - 1, s + 1));
        if (dx < 0) setSkillSlide((s) => Math.max(0, s - 1));
        return;
      }
      // Horizontal swipe on projects
      if (SECTIONS[current] === "projects" && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
        if (dx > 0) setProjectSlide((s) => Math.min(projects.length - 1, s + 1));
        if (dx < 0) setProjectSlide((s) => Math.max(0, s - 1));
        return;
      }
      // Vertical swipe = section change
      if (dy > 50)  goTo(current + 1);
      if (dy < -50) goTo(current - 1);
    };

    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [current, goTo, projects.length]);

  // ============================================================
  // EDGE HOVER — mouse screen edge pe aane se slide change
  // Sirf desktop pe (768px+) aur skills/projects pe
  // ============================================================
  const handlePanelMouseMove = useCallback(
    (e) => {
      if (!["skills", "projects"].includes(SECTIONS[current])) return;
      if (window.innerWidth < 768) return;
      const x = e.clientX;
      const width = window.innerWidth;
      if (x >= width * 0.84) { triggerHorizontalSlide("next"); return; }
      if (x <= width * 0.16)   triggerHorizontalSlide("prev");
    },
    [current, triggerHorizontalSlide]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handlePanelMouseMove);
    return () => window.removeEventListener("mousemove", handlePanelMouseMove);
  }, [handlePanelMouseMove]);

  // ============================================================
  // DERIVED STATE
  // ============================================================

  // Current active skill aur uske neighbors (3 cards)
  const activeSkill = SKILLS[skillSlide];
  const skillCards = [
    SKILLS[skillSlide - 1] || null, // left side card
    activeSkill,                     // center active card
    SKILLS[skillSlide + 1] || null,  // right side card
  ];

  // Current active project
  const activeProject = projects[projectSlide];

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      {/* Global styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        * { cursor: none !important; box-sizing: border-box; }
        body { overflow: hidden; }
        ::-webkit-scrollbar { display: none; }

        /* Cursor ring pulse animation */
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0   rgba(255,255,255,0.3); }
          70%  { box-shadow: 0 0 0 12px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0   rgba(255,255,255,0); }
        }
        .cursor-ring { animation: pulse-ring 2.4s ease-out infinite; }

        /* White gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #fff 0%, #fff 70%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Three.js particle canvas — background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" />

      {/* Custom cursor — ring (lagged) */}
      <div
        ref={cursorRef}
        className="cursor-ring fixed top-0 left-0 w-10 h-10 rounded-full border border-white/40 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
      />
      {/* Custom cursor — dot (exact position) */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9999] hidden md:block"
      />

      {/* Top navigation bar */}
      <nav
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-5 md:py-6"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <a
          href="mailto:divyanshunagar0000@gmail.com"
          className="text-white/40 hover:text-white text-[0.65rem] md:text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300"
        >
          hello@divyanshu
        </a>

        {/* Desktop vertical dot navigation — left side */}
        <div className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col items-center gap-3">
          {SECTIONS.map((s, i) => (
            <button
              type="button"
              key={s}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                current === i
                  ? "h-8 w-1 bg-white"
                  : "h-3 w-1 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Mobile horizontal dot navigation */}
        <div className="flex md:hidden items-center gap-2">
          {SECTIONS.map((s, i) => (
            <button
              type="button"
              key={s}
              onClick={() => goTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                current === i ? "w-6 bg-white" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>

        <a
          href="https://linkedin.com/in/divyanshu0000"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white text-[0.65rem] md:text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300"
        >
          LinkedIn ↗
        </a>
      </nav>

      {/* Bottom left — current section name vertical */}
      <div className="fixed left-4 md:left-8 bottom-8 md:bottom-12 z-50 flex flex-col items-center gap-3">
        <div className="w-px h-12 md:h-16 bg-white/20" />
        <span
          className="text-white/30 text-[0.55rem] md:text-[0.6rem] tracking-[0.25em] uppercase"
          style={{ writingMode: "vertical-rl", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {SECTIONS[current]}
        </span>
      </div>

      {/* Bottom right — section counter */}
      <div
        className="fixed right-4 md:right-8 bottom-8 md:bottom-12 z-50 text-right"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <span className="text-white text-xs md:text-sm font-bold">
          {String(current + 1).padStart(2, "0")}
        </span>
        <span className="text-white/20 text-xs md:text-sm">
          {" "}/ {String(SECTIONS.length).padStart(2, "0")}
        </span>
      </div>

      {/* Main content — animated section transitions */}
      <div className="fixed inset-0 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">

          {/* ================================================
              SECTION 0 — HERO
          ================================================ */}
          {current === 0 && (
            <motion.section
              key="hero"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <motion.p
                variants={childFade}
                className="text-[0.65rem] md:text-xs tracking-[0.3em] uppercase text-white/40 mb-6 md:mb-8 font-medium"
              >
                Software Development Engineer
              </motion.p>

              <motion.h1
                variants={childFade}
                className="gradient-text font-black leading-none mb-1 tracking-tight"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "clamp(3.2rem,16vw,12rem)",
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
                  fontSize: "clamp(2.8rem,13vw,10rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                NAGAR
              </motion.h2>

              <motion.p
                variants={childFade}
                className="text-white/40 text-sm md:text-lg max-w-md mt-4 md:mt-6 leading-relaxed px-2"
              >
                Building scalable web apps & ML-powered products.
              </motion.p>

              <motion.div
                variants={childFade}
                className="flex flex-col sm:flex-row gap-4 mt-10 md:mt-12 w-full max-w-md justify-center"
              >
                <button
                  type="button"
                  onClick={() => goTo(SECTIONS.indexOf("projects"))}
                  className="relative min-w-[180px] px-8 py-3.5 rounded-full text-white text-sm font-semibold tracking-widest uppercase border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.15)]"
                >
                  View Work
                </button>
                <a
                  href="mailto:divyanshunagar0000@gmail.com"
                  className="relative min-w-[180px] px-8 py-3.5 rounded-full text-black text-sm font-bold tracking-widest uppercase bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-6px_rgba(255,255,255,0.35)] hover:bg-white/90 text-center"
                >
                  Hire Me
                </a>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                variants={childFade}
                className="absolute bottom-8 md:bottom-12 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
              >
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent"
                />
                <span className="text-white/20 text-[0.6rem] tracking-[0.2em] uppercase">scroll</span>
              </motion.div>
            </motion.section>
          )}

          {/* ================================================
              SECTION 1 — ABOUT
          ================================================ */}
          {current === 1 && (
            <motion.section
              key="about"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-4 sm:px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <motion.div variants={childFade} className="text-center md:text-left">
                  <p className="text-[0.7rem] tracking-[0.25em] uppercase text-white/40 mb-4">
                    About me
                  </p>
                  <h2
                    className="gradient-text font-black leading-none mb-6"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "clamp(2.6rem,8vw,6rem)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    WHO AM I?
                  </h2>
                </motion.div>

                <motion.div variants={stagger} initial="hidden" animate="visible">
                  <motion.p
                    variants={childFade}
                    className="text-white/70 text-base md:text-lg leading-relaxed text-center md:text-left"
                  >
                    I build scalable and interactive web applications while
                    exploring ML-powered features and modern engineering
                    practices, turning ideas into intuitive, high-performance
                    products.
                  </motion.p>
                </motion.div>
              </div>
            </motion.section>
          )}

          {/* ================================================
              SECTION 2 — SKILLS
              3-card carousel — left, active center, right
          ================================================ */}
          {current === 2 && (
            <motion.section
              key="skills"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-4 sm:px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-5xl w-full min-h-[72vh] flex flex-col justify-center">
                {/* Section heading */}
                <motion.div variants={childFade} className="mb-8 md:mb-12 text-center">
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

                {/* 3-card grid — no overflow hidden so side cards don't clip */}
                <div className="max-w-5xl mx-auto w-full px-2">
                  <div className="grid grid-cols-3 gap-4 md:gap-6 items-center">
                    {skillCards.map((skill, index) =>
                      skill ? (
                        <SkillCard
                          key={`${skill.label}-${index}`}
                          skill={skill}
                          active={index === 1}
                          indexLabel={String(skillSlide + 1).padStart(2, "0")}
                        />
                      ) : (
                        // Empty placeholder jab pehla ya aakhri slide ho
                        <div
                          key={`placeholder-${skillSlide}-${index}`}
                          className="h-[220px] md:h-[300px] opacity-0"
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Navigation — arrows + dot indicators */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Arrow buttons */}
                  <div className="flex items-center gap-2 order-2 sm:order-1">
                    <button
                      type="button"
                      onClick={() => setSkillSlide((s) => Math.max(0, s - 1))}
                      disabled={skillSlide === 0}
                      className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 bg-white/[0.04] text-white/50 text-sm transition-all duration-300 hover:border-white/35 hover:bg-white/[0.09] hover:text-white disabled:opacity-25 disabled:pointer-events-none"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setSkillSlide((s) => Math.min(SKILLS.length - 1, s + 1))}
                      disabled={skillSlide === SKILLS.length - 1}
                      className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 bg-white/[0.04] text-white/50 text-sm transition-all duration-300 hover:border-white/35 hover:bg-white/[0.09] hover:text-white disabled:opacity-25 disabled:pointer-events-none"
                    >
                      →
                    </button>
                  </div>

                  {/* Dot indicators */}
                  <div className="flex justify-center gap-2 order-1 sm:order-2">
                    {SKILLS.map((skill, i) => (
                      <button
                        type="button"
                        key={skill.label}
                        onClick={() => setSkillSlide(i)}
                        className={`rounded-full transition-all duration-300 ${
                          i === skillSlide
                            ? "w-8 h-2 bg-white"
                            : "w-2 h-2 bg-white/25 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* ================================================
              SECTION 3 — PROJECTS
              Backend se fetch hote hain projects
          ================================================ */}
          {current === 3 && (
            <motion.section
              key="projects"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-4 sm:px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-5xl w-full min-h-[72vh] py-4 md:py-6 flex flex-col justify-center">
                {/* Section heading + project count */}
                <motion.div
                  variants={childFade}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-7"
                >
                  <div className="text-center md:text-left">
                    <p className="text-[0.7rem] tracking-[0.25em] uppercase text-white/40 mb-2">Work</p>
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
                  <span className="text-white/30 text-sm tabular-nums text-center md:text-right">
                    {loading ? "—" : `${projects.length} total`}
                  </span>
                </motion.div>

                {/* Loading state */}
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
                ) : projects.length ? (
                  <>
                    {/* Project card */}
                    <div className="overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.a
                          key={activeProject?._id || projectSlide}
                          href={activeProject?.projectUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: 40, scale: 0.96 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -40, scale: 0.96 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="block rounded-3xl overflow-hidden group border border-white/[0.10] bg-white/[0.04] backdrop-blur-sm transition-all duration-[400ms] hover:border-white/25 hover:bg-white/[0.06] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] max-w-3xl mx-auto"
                        >
                          {/* Project image */}
                          <div className="h-56 md:h-72 overflow-hidden bg-white/5">
                            <img
                              src={activeProject?.imageUrl}
                              alt={activeProject?.title}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />
                          </div>

                          {/* Project info */}
                          <div className="p-6 md:p-8 bg-gradient-to-b from-transparent to-white/[0.02]">
                            <div className="flex items-start justify-between mb-4">
                              <span className="text-white/30 text-xs tracking-widest uppercase tabular-nums">
                                {String(projectSlide + 1).padStart(2, "0")}
                              </span>
                              <span className="text-white/30 text-sm group-hover:text-white/70 transition-colors duration-300">↗</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight leading-snug text-center md:text-left">
                              {activeProject?.title}
                            </h3>
                            <p className="text-white/55 text-sm md:text-base leading-relaxed mb-5 text-center md:text-left min-h-[72px]">
                              {activeProject?.description}
                            </p>
                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                              {activeProject?.technologies?.slice(0, 6).map((tech) => (
                                <span
                                  key={tech}
                                  className="text-[0.72rem] font-medium px-3 py-1.5 rounded-full border border-white/15 text-white/80 tracking-wide bg-white/[0.05]"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.a>
                      </AnimatePresence>
                    </div>

                    {/* Project navigation */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-7">
                      <div className="flex items-center gap-2 order-2 sm:order-1">
                        <button
                          type="button"
                          onClick={() => setProjectSlide((s) => Math.max(0, s - 1))}
                          disabled={projectSlide === 0}
                          className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 bg-white/[0.04] text-white/50 text-sm transition-all duration-300 hover:border-white/35 hover:bg-white/[0.09] hover:text-white disabled:opacity-25 disabled:pointer-events-none"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => setProjectSlide((s) => Math.min(projects.length - 1, s + 1))}
                          disabled={projectSlide >= projects.length - 1}
                          className="w-11 h-11 rounded-full flex items-center justify-center border border-white/15 bg-white/[0.04] text-white/50 text-sm transition-all duration-300 hover:border-white/35 hover:bg-white/[0.09] hover:text-white disabled:opacity-25 disabled:pointer-events-none"
                        >
                          →
                        </button>
                      </div>
                      <div className="flex justify-center gap-2 order-1 sm:order-2 flex-wrap max-w-xl">
                        {projects.map((project, i) => (
                          <button
                            type="button"
                            key={project._id || i}
                            onClick={() => setProjectSlide(i)}
                            className={`rounded-full transition-all duration-300 ${
                              i === projectSlide
                                ? "w-8 h-2 bg-white"
                                : "w-2 h-2 bg-white/25 hover:bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  // No projects fallback
                  <div className="text-center py-20 text-white/35 text-sm tracking-[0.2em] uppercase">
                    No projects found from backend
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {/* ================================================
              SECTION 4 — CONTACT
          ================================================ */}
          {current === 4 && (
            <motion.section
              key="contact"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full h-full flex items-center justify-center px-4 sm:px-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <div className="max-w-2xl w-full text-center min-h-[72vh] flex flex-col justify-center">
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
                  className="text-white/50 text-base md:text-lg mb-10 leading-relaxed"
                >
                  I'm only a message away. Let's build something unforgettable together.
                </motion.p>

                <motion.div
                  variants={childFade}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Link href="/contact">
                    <button
                      type="button"
                      className="min-w-[180px] px-8 py-3.5 rounded-full text-white text-sm font-semibold tracking-widest uppercase border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_-8px_rgba(255,255,255,0.15)]"
                    >
                      Send Message
                    </button>
                  </Link>
                  <a
                    href="mailto:divyanshunagar0000@gmail.com"
                    className="min-w-[180px] px-8 py-3.5 rounded-full text-black text-sm font-bold tracking-widest uppercase bg-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_12px_32px_-6px_rgba(255,255,255,0.35)] text-center"
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

        </AnimatePresence>
      </div>
    </>
  );
}