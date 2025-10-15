"use client"; // Required for interactivity
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await axios.post(`${B_URI}/connect`, data);
      setStatus(res.data.message || "Form submitted successfully!");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus("Submission failed!");
    }
  };

  return (
    <div className="bg-black min-h-screen text-white p-4 relative">
      {/* Back Button */}
      <Link href="/" className="absolute top-5 left-6 opacity-80 text-white font-bold underline text-2xl hover:text-gray-100">
        Back
      </Link>

      {/* Heading */}
      <h1 className="text-4xl opacity-65 font-bold text-center mt-12 md:mt-16">
        Got a project or just want to say hi? <br />
            I’m only a message away
      </h1>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto mt-12 gap-8 items-stretch">
        
        {/* Left Box */}
        <div className="flex-1 flex justify-center items-center text-center p-6">
          <p className="capitalize font-bold text-1xl md:text-3xl">
            LET'S CONNECT
          </p>
        </div>

        {/* Divider Line */}
        <div className="hidden md:block w-1.5 bg-white"></div>

        {/* Right Box: Form */}
        <div className="flex-1 p-6">
          <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="text-white font-bold pl-0 py-2 focus:outline-none border-b-2 border-white placeholder-gray-400 bg-transparent"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="text-white font-bold pl-0 py-2 focus:outline-none border-b-2 border-white placeholder-gray-400 bg-transparent"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="text-white font-bold pl-0 py-2 focus:outline-none border-b-2 border-white placeholder-gray-400 bg-transparent resize-none h-32"
            />
            <button
              type="submit"
              className="bg-white transform transition-transform active:scale-99 text-gray-800 font-bold py-3 px-6 mt-4 shadow-inner shadow-black/50 hover:bg-gray-200 text-xl"
            >
              SUBMIT
            </button>
          </form>

          {status && <p className="mt-6 text-red-300 font-semibold">{status}</p>}
        </div>

      </div>
    </div>
  );
}
