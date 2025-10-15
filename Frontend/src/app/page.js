"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching projects from backend...");
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${B_URI}/projects`);
        console.log("Projects fetched successfully:", res.data);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className="bg-black text-white min-h-screen font-sans relative overflow-hidden cursor-none">

      {/* Custom Cursor */}
      <div className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full mix-blend-difference pointer-events-none z-50"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-12 z-40 flex justify-between items-center px-6">
        <div className="text-white text-sm uppercase font-bold hover:underline">
          <a href="mailto:divyanshunagar0000@gmail.com">HELLO@DIVYANSHU.COM</a>
        </div>
        <div className="text-white text-sm uppercase font-bold hover:underline">
          <a href="https://linkedin.com/in/divyanshu0000" target="_blank" rel="noopener noreferrer">
            LINKEDIN.COM/IN/DIVYANSHU0000
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold uppercase mb-6"
        >
          Hi, I’m Divyanshu
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl mt-4 font-bold uppercase"
        >
          Let’s build something amazing together!
        </motion.p>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold uppercase mb-4"
        >
          About Me
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-gray-300 text-lg md:text-xl"
        >
          I specialize in creating responsive and user-friendly web applications using modern technologies. I love turning ideas into reality with clean code, beautiful UI, and smooth animations.
        </motion.p>
      </section>

      {/* Tech Stack / Skills */}
      <section className="bg-white opacity-80 px-6 py-16 max-w-6xl mx-auto text-gray-800 rounded-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold uppercase  text-gray-800 text-center mb-10"
        >
          💻 Tech Stack & Skills
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-12 text-gray-800 ">
          <div>
            <h3 className="font-bold uppercase mb-2">Frontend:</h3>
            <p>Next.js / React, Tailwind CSS, Three.js, Framer Motion, Responsive Design</p>
          </div>
          <div>
            <h3 className="font-bold uppercase mb-2">Backend:</h3>
            <p>Node.js, Express, MongoDB, Socket.IO</p>
          </div>
          <div>
            <h3 className="font-bold uppercase mb-2">Full-Stack / Integration:</h3>
            <p>Axios / Fetch, Form handling, Async operations, Deployment (Vercel/Render/Heroku)</p>
          </div>
          <div>
            <h3 className="font-bold uppercase mb-2">Professional Practices:</h3>
            <p>Git & GitHub, Clean code, Environment variables, UI/UX design</p>
          </div>
        </div>
      </section>

{/* Projects Section */}
<section className="max-w-6xl mx-auto px-6 py-16">
  <motion.h2
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-3xl md:text-4xl font-bold uppercase text-center mb-16"
  >
    Projects
  </motion.h2>

  {loading ? (
    <div className="text-center py-20">
      <div className="animate-pulse text-lg">Loading projects...</div>
    </div>
  ) : (
    <div className="space-y-24">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          className={`flex flex-col md:flex-row items-center gap-6 ${
            index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* Project Image */}
          <div className="md:w-1/2 h-64 md:h-80 bg-gray-800 overflow-hidden rounded-xl shadow-lg">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Project Info */}
          <div className="md:w-1/2 p-6 bg-black text-white rounded-xl border-2 border-white shadow-lg">
            <motion.h3
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-2xl font-bold uppercase mb-4"
            >
              {project.title}
            </motion.h3>
            <motion.p
              initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-300 mb-4"
            >
              {project.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-sm uppercase bg-gray-700 px-2 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  )}
</section>


      {/* Contact Section */}
      <section className="bg-white opacity-80 px-6 py-16 max-w-6xl mx-auto text-center rounded-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl text-gray-800 md:text-4xl font-bold uppercase mb-6"
        >
          Got a project or just want to say hi?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-gray-700 mb-8"
        >
          I’m only a message away.
        </motion.p>
        <Link href="/contact">
          <button className="border-2 border-black px-8 py-4 font-bold uppercase hover:bg-gray-300 text-black transition">
            Send Message
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-500 text-sm uppercase">
        © 2025 Divyanshu. Built with Next.js & Tailwind CSS.
      </footer>

      {/* Custom Cursor Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('mousemove', (e) => {
            const cursor = document.querySelector('.fixed.w-6.h-6');
            if (cursor) {
              cursor.style.left = e.clientX + 'px';
              cursor.style.top = e.clientY + 'px';
            }
          });
        `
      }} />
    </main>
  );
}
