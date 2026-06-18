"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Banner = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat py-24"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d')",
      }}
    >

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">

          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Build Your Dream{" "}
              <span className="text-indigo-300">Startup Team</span>
            </h1>

            <p className="mt-5 text-gray-200 text-lg leading-relaxed">
              StartupForge connects founders with talented developers, designers, and marketers.
              Find the right people or join exciting startup opportunities today.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                href="/startups"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Browse Startups
              </Link>

              <Link
                href="/opportunities"
                className="px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-black transition"
              >
                Explore Opportunities
              </Link>

            </div>

            {/* STATS */}
            <div className="mt-10 grid grid-cols-3 gap-6 text-center text-white">

              <div>
                <p className="text-2xl font-bold">100+</p>
                <p className="text-sm text-gray-300">Startups</p>
              </div>

              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-gray-300">Members</p>
              </div>

              <div>
                <p className="text-2xl font-bold">200+</p>
                <p className="text-sm text-gray-300">Opportunities</p>
              </div>

            </div>

          </motion.div>

          {/* RIGHT CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >

            <div className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-6 w-full max-w-md text-white">

              <h3 className="text-lg font-semibold">
                🔥 Featured Startup
              </h3>

              <p className="text-sm text-gray-200 mt-1">
                Latest opportunity from the platform
              </p>

              <div className="mt-5 space-y-3">

                <div className="p-3 border border-white/20 rounded-lg">
                  <p className="font-semibold">Startup Name</p>
                  <p className="text-sm text-gray-300">AI SaaS Platform</p>
                </div>

                <div className="p-3 border border-white/20 rounded-lg">
                  <p className="font-semibold">Founder</p>
                  <p className="text-sm text-gray-300">John Doe</p>
                </div>

                <div className="p-3 border border-white/20 rounded-lg">
                  <p className="font-semibold">Need</p>
                  <p className="text-sm text-gray-300">Frontend Developer</p>
                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Banner;