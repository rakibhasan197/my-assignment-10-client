import Link from "next/link";

const Banner = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-50 to-white py-20">
      <div className="mx-auto max-w-7xl px-4">

        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10">

          {/* LEFT CONTENT */}
          <div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Build Your Dream <span className="text-indigo-600">Startup Team</span>
            </h1>

            <p className="mt-5 text-gray-600 text-lg">
              StartupForge connects founders with talented developers, designers, and marketers.
              Find the right people or join exciting startup opportunities today.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex gap-4">

              <Link
                href="/startups"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Browse Startups
              </Link>

              <Link
                href="/opportunities"
                className="px-6 py-3 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition"
              >
                Explore Opportunities
              </Link>

            </div>

            {/* SMALL INFO */}
            <div className="mt-8 flex gap-6 text-sm text-gray-500">

              <div>
                <p className="font-bold text-gray-900">100+</p>
                Startups
              </div>

              <div>
                <p className="font-bold text-gray-900">500+</p>
                Members
              </div>

              <div>
                <p className="font-bold text-gray-900">200+</p>
                Opportunities
              </div>

            </div>

          </div>

          {/* RIGHT CONTENT (ILLUSTRATION / CARD MOCK) */}
          <div className="flex justify-center">

            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">

              <h3 className="text-lg font-semibold text-gray-800">
                🔥 Featured Startup
              </h3>

              <div className="mt-4 space-y-3">

                <div className="p-3 border rounded-lg">
                  <p className="font-semibold">Startup Name</p>
                  <p className="text-sm text-gray-500">AI SaaS Platform</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <p className="font-semibold">Founder</p>
                  <p className="text-sm text-gray-500">John Doe</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <p className="font-semibold">Need</p>
                  <p className="text-sm text-gray-500">Frontend Developer</p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Banner;