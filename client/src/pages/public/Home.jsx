import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  PackageSearch,
  Truck,
  Warehouse,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import About from "./About";
import Fleet from "./Fleet";
import Contact from "./Contact";

import hero1 from "../../assets/images/hero/DSC05274.jpg";
import hero2 from "../../assets/images/hero/DSC05280.jpg";
import hero3 from "../../assets/images/hero/DSC05284.jpg";
import hero4 from "../../assets/images/hero/DSC05295.jpg";
import hero5 from "../../assets/images/hero/DSC05311.jpg";
import hero6 from "../../assets/images/hero/DSC05400.jpg";
import hero7 from "../../assets/images/hero/DSC05403.jpg";

function Home() {
  const images = [hero1, hero2, hero3, hero4, hero5, hero6, hero7];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(slider);
  }, [images.length]);

  const services = [
    {
      title: "Freight Forwarding",
      description: "Secure and efficient cargo movement across Southern Africa.",
      icon: <Truck size={40} />,
    },
    {
      title: "Warehousing",
      description: "Safe storage and inventory management for goods.",
      icon: <Warehouse size={40} />,
    },
    {
      title: "Cross-Border Transport",
      description: "Reliable transport and customs coordination across borders.",
      icon: <Globe2 size={40} />,
    },
    {
      title: "Secure Logistics",
      description: "Professional handling with real-time shipment tracking.",
      icon: <ShieldCheck size={40} />,
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="px-3 py-4 lg:px-6">
        <div className="mx-auto max-w-[1500px]">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={current}
                src={images[current]}
                alt="Logistics"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />

            <div className="relative z-10 flex min-h-[88vh] items-center px-6 py-20 md:px-14 lg:px-24">
              <motion.div
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <p className="mb-6 inline-flex rounded-full bg-orange-500/10 px-5 py-2 text-sm font-semibold text-orange-300">
                  Trusted Cross-Border Logistics
                </p>

                <h1 className="text-4xl font-extrabold text-white md:text-6xl lg:text-7xl">
                  Reliable Freight &
                  <span className="block text-orange-400">
                    Logistics Across Africa
                  </span>
                </h1>

                <p className="mt-8 text-lg text-slate-200 md:text-xl">
                  Fast, secure, and tracked transport solutions for businesses
                  and individuals across Southern Africa.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/login?quote=true"
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition hover:bg-orange-600"
                  >
                    Get a Quote
                    <ArrowRight size={22} />
                  </Link>

                  <Link
                    to="/track-order"
                    className="inline-flex items-center gap-2 rounded-xl border border-white bg-white/10 px-8 py-4 text-white"
                  >
                    Track Shipment
                    <PackageSearch size={22} />
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2.5 rounded-full ${
                    current === index ? "w-8 bg-orange-500" : "w-2.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-slate-100 p-10 md:grid-cols-4">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-orange-500">10+</h2>
            <p>Years Experience</p>
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-bold text-orange-500">5000+</h2>
            <p>Deliveries</p>
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-bold text-orange-500">8+</h2>
            <p>Countries</p>
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-bold text-orange-500">98%</h2>
            <p>On-Time</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Our Services</h2>

          <p className="mt-6 text-slate-600">
            Reliable logistics solutions across Africa.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <div key={i} className="rounded-3xl border bg-white p-8 shadow">
                <div className="mb-4 text-orange-500">{s.icon}</div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="About">
        <About />
      </section>

      <section id="Fleet">
        <Fleet />
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#0B1F3A] p-12 text-center text-white">
          <h2 className="text-4xl font-bold md:text-5xl">
            Need Reliable Freight Solutions?
          </h2>

          <p className="mt-6 text-slate-300">
            Partner with Naglink Investments today.
          </p>

          <Link
            to="/login?quote=true"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-4 font-bold transition hover:bg-orange-600"
          >
            Get Quote
            <ArrowRight size={22} />
          </Link>
        </div>
      </section>

      <section id="Contact">
        <Contact />
      </section>
    </main>
  );
}

export default Home;