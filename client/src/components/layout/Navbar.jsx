import { Link, NavLink } from "react-router-dom";
import { Menu, X, UserRound } from "lucide-react";
import { FaWhatsapp, FaFacebookF } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Fleet", path: "/fleet" },
    { name: "Gallery", path: "/gallery" },
    { name: "News & Updates", path: "/news-updates" },
    { name: "Track Order", path: "/track-order" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-sky-200 bg-gradient-to-r from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd] shadow-md backdrop-blur-md"
    >
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={logo}
            alt="Naglink Investments"
            className="h-12 w-auto object-contain md:h-14"
          />
        </Link>

        <div className="hidden items-center gap-6 xl:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-[14px] font-semibold transition ${
                  isActive
                    ? "text-orange-500"
                    : "text-slate-800 hover:text-orange-500"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-orange-400 hover:text-orange-500"
          >
            <UserRound size={17} />
            Login
          </Link>

          <Link
            to="/login?mode=register"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Register
          </Link>

          <Link
            to="/login?quote=true"
            className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Get Quote
          </Link>

          <a
            href="https://wa.me/263785917545"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white transition hover:scale-110"
          >
            <FaWhatsapp size={18} />
          </a>

          <a
            href="https://www.facebook.com/share/1ChhmnGZEa/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:scale-110"
          >
            <FaFacebookF size={16} />
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-800 hover:bg-white/40 xl:hidden"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-sky-200 bg-[#dbeafe] xl:hidden"
          >
            <div className="space-y-5 px-6 py-6">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block text-base font-semibold ${
                      isActive
                        ? "text-orange-500"
                        : "text-slate-800 hover:text-orange-500"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="flex flex-col gap-3 pt-4">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white/60 px-5 py-3 text-sm font-semibold text-slate-800"
                >
                  <UserRound size={18} />
                  Login
                </Link>

                <Link
                  to="/login?quote=true"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-semibold text-white"
                >
                  Get Quote
                </Link>
              </div>

              <div className="flex justify-center gap-4 pt-3">
                <a
                  href="https://wa.me/263785917545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white"
                >
                  <FaWhatsapp size={20} />
                </a>

                <a
                  href="https://www.facebook.com/share/1ChhmnGZEa/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white"
                >
                  <FaFacebookF size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Navbar;