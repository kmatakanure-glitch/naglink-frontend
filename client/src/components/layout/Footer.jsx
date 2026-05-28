import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-950 via-sky-700 to-blue-900 px-6 py-16 text-white md:px-20 lg:px-32">
      {/* Top Section */}
      <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-0">
        {/* Logo + Description */}
        <div className="max-w-sm">
          <div className="mb-4 flex items-center gap-2">
            <img
              src={logo}
              alt="Mwanawevhu Logistics"
              className="h-24 w-auto object-contain"
            />
          </div>

          <p className="leading-relaxed text-slate-200">
            Reliable truck hire, tipper hire, cargo movement, and modern order
            tracking solutions for safe and professional deliveries.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Company</h3>

          <ul className="space-y-2 text-slate-200">
           <li>
  <a
    href="#Home"
    className="transition hover:text-white"
  >
    Home
  </a>
</li>

            <li>
              <Link to="/about" className="transition hover:text-white">
                About us
              </Link>
            </li>

            <li>
              <Link to="/services" className="transition hover:text-white">
                Services
              </Link>
            </li>

            <li>
              <Link to="/fleet" className="transition hover:text-white">
                Fleet
              </Link>
            </li>

            <li>
              <Link to="/contact" className="transition hover:text-white">
                Contact us
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="max-w-sm">
          <h3 className="mb-4 text-lg font-semibold">
            Subscribe to our newsletter
          </h3>

          <p className="mb-4 text-slate-200">
            Get transport updates, service news, fleet availability, and
            logistics information sent to your inbox.
          </p>

          <div className="flex overflow-hidden rounded-none bg-white/10">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/15 px-4 py-3 text-white outline-none placeholder:text-slate-300"
            />

            <button className="bg-gradient-to-r from-white via-sky-100 to-sky-300 px-5 font-semibold text-blue-950 transition hover:bg-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-12 border-t border-white/20 pt-6 text-center">
        <p className="text-sm text-slate-300">
          Copyright {new Date().getFullYear()} © Naglink Logistics. All
          Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;