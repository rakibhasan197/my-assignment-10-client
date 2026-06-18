"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Startups", value: "120+" },
  { label: "Developers", value: "500+" },
  { label: "Opportunities", value: "300+" },
  { label: "Success Rate", value: "85%" },
];

const StartupStats = () => {
  return (
    <section className="py-20 bg-indigo-50">
      <div className="mx-auto max-w-7xl px-4 text-center">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-gray-900"
        >
          StartupForge Statistics
        </motion.h2>

        {/* Stats Grid */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">

          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow"
            >
              <p className="text-3xl font-bold text-indigo-600">
                {item.value}
              </p>
              <p className="text-gray-600 mt-2">
                {item.label}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default StartupStats;