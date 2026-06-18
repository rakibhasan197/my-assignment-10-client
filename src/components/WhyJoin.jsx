"use client";

import { motion } from "framer-motion";

const WhyJoin = () => {
  const features = [
    {
      title: "Find Startup Teams",
      desc: "Connect with founders and join exciting startup projects.",
    },
    {
      title: "Build Your Career",
      desc: "Work on real-world ideas and improve your skills.",
    },
    {
      title: "Remote Opportunities",
      desc: "Work from anywhere with global startup teams.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center text-gray-900"
        >
          Why Join <span className="text-indigo-600">StartupForge</span>
        </motion.h2>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 border rounded-xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {item.desc}
              </p>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default WhyJoin;