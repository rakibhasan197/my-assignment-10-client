import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo + Description */}
          <div>
            <h2 className="text-xl font-bold text-indigo-600">
              StartupForge
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              A platform where founders and talented professionals connect,
              build startups, and grow together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-indigo-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/startups" className="hover:text-indigo-600">
                  Browse Startups
                </Link>
              </li>
              <li>
                <Link href="/opportunities" className="hover:text-indigo-600">
                  Browse Opportunities
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Social Links
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-600">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Contact
            </h3>
            <p className="text-sm text-gray-600">
              Email: mdrakibalhasanmdrakibalhasan0@gmail.com
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Phone: +880 1937134184
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Location: Bangladesh
            </p>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">

          <p>
            © {new Date().getFullYear()} StartupForge. All rights reserved.
          </p>

          <p className="mt-2 md:mt-0">
            Built with ❤️ for startup builders
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;