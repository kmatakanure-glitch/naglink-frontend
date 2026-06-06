import { motion } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  MapPinned,
  Clock3,
  PackageCheck,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import truck1 from "../../assets/images/fleet/DSC05324.jpg";
import truck2 from "../../assets/images/fleet/DSC05309.jpg";
import truck3 from "../../assets/images/fleet/DSC05272.jpg";
import truck4 from "../../assets/images/fleet/DSC05336.jpg";
import truck5 from "../../assets/images/fleet/DSC05339.jpg";
import truck6 from "../../assets/images/fleet/DSC05267.jpg";
import truck7 from "../../assets/images/fleet/DSC05280.jpg";
import truck8 from "../../assets/images/fleet/DSC05315.jpg";

function Fleet() {
  const fleetGallery = [
    {
      image: truck1,
      title: "Howo Cargo Fleet",
    },
    {
      image: truck2,
      title: "Heavy Duty Road Transport",
    },
    {
      image: truck3,
      title: "Tipper Truck Operations",
    },
    {
      image: truck4,
      title: "Bulk Cargo Solutions",
    },
    {
      image: truck5,
      title: "Long Distance Logistics",
    },
    {
      image: truck6,
      title: "Construction & Mining Support",
    },
    {
      image: truck7,
      title: "Fleet Coordination",
    },
    {
      image: truck8,
      title: "Professional Freight Delivery",
    },
  ];

  const services = [
    {
      icon: <Truck size={34} />,
      title: "Road Freight Transport",
      text: "Reliable road freight services for local and long-distance cargo transportation.",
    },
    {
      icon: <PackageCheck size={34} />,
      title: "Bulk Cargo Movement",
      text: "Efficient movement of bulk materials, construction supplies, and industrial cargo.",
    },
    {
      icon: <Clock3 size={34} />,
      title: "Real-Time Tracking",
      text: "Online shipment monitoring and live delivery tracking for customer visibility.",
    },
    {
      icon: <ShieldCheck size={34} />,
      title: "Cargo Protection",
      text: "Professional cargo handling procedures with insured and secure transport operations.",
    },
  ];

  const stats = [
    {
      number: "20+",
      label: "Howo Trucks",
    },
    {
      number: "20+",
      label: "Tipper Trucks",
    },
    {
      number: "30T",
      label: "Heavy Duty Capacity",
    },
    {
      number: "24/7",
      label: "Online Tracking",
    },
  ];

  return (
    <main className="overflow-hidden bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] bg-slate-950">
        <div className="absolute inset-0">
          <img
            src={truck4}
            alt="Naglink Fleet"
            className="h-full w-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-6 py-20 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <p className="mb-5 font-semibold uppercase tracking-[6px] text-orange-400">
              Road Freight Transport
            </p>

            <h1 className="text-5xl font-bold leading-tight text-white md:text-7xl">
              Reliable Road
              <span className="block text-orange-400">
                Freight Solutions
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-9 text-slate-200 md:text-xl">
              Naglink Company provides professional road freight
              services with a modern fleet of Howo trucks, tipper
              trucks, Super Link trailers, and 30-tonne heavy-duty
              transport solutions designed for reliable cargo movement.
            </p>

            <button className="mt-10 flex items-center gap-2 bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600">
              Explore Our Fleet
              <ChevronRight />
            </button>
          </motion.div>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-14">
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img
              src={truck1}
              alt="Road Freight"
              className="h-[650px] w-full object-cover shadow-2xl"
            />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="mb-4 font-semibold uppercase tracking-[5px] text-orange-500">
              Road Transport Solutions
            </p>

            <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Professional Freight &
              <span className="block text-orange-500">
                Logistics Services
              </span>
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              Naglink Company delivers dependable road transport
              solutions for construction, mining, industrial, and
              commercial sectors through a fleet designed for
              efficiency, safety, and operational reliability.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              From local deliveries to large-scale cargo movement,
              our transport operations are supported by experienced
              logistics teams, real-time tracking systems, and
              professional fleet coordination.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-orange-500 bg-slate-100 p-6"
                >
                  <h3 className="text-4xl font-bold text-slate-900">
                    {item.number}
                  </h3>

                  <p className="mt-2 text-slate-600">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-14">
          <div className="mb-16 max-w-4xl">
            <p className="font-semibold uppercase tracking-[5px] text-orange-500">
              Our Capabilities
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Comprehensive Road Freight Services
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2,
                }}
                className="bg-white p-8 shadow-xl transition hover:-translate-y-2"
              >
                <div className="mb-6 text-orange-500">
                  {service.icon}
                </div>

                <h3 className="mb-4 text-2xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="leading-8 text-slate-600">
                  {service.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKING SECTION */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-14">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-[5px] text-orange-400">
              Real-Time Tracking
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-5xl">
              Online Visibility &
              <span className="block text-orange-400">
                Delivery Monitoring
              </span>
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-300">
              Our transport systems provide customers with real-time
              shipment visibility and delivery updates to improve
              transparency, coordination, and operational confidence.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Live delivery tracking",
                "Shipment status updates",
                "Professional fleet coordination",
                "Reliable cargo monitoring",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <CheckCircle2 className="text-orange-400" />

                  <p className="text-lg text-slate-200">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <img
              src={truck5}
              alt="Tracking"
              className="h-[600px] w-full object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* INSURANCE SECTION */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-14">
          <div>
            <img
              src={truck6}
              alt="Cargo Protection"
              className="h-[600px] w-full object-cover shadow-2xl"
            />
          </div>

          <div>
            <p className="mb-4 font-semibold uppercase tracking-[5px] text-orange-500">
              Cargo Protection
            </p>

            <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
              Safe & Secure
              <span className="block text-orange-500">
                Freight Handling
              </span>
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              Naglink Company prioritizes cargo safety through
              professional operational procedures, reliable fleet
              management, and insured transport coordination.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              We focus on minimizing transport risks while ensuring
              efficient movement of commercial, industrial, and
              construction cargo.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Professional cargo handling",
                "Reliable road transport operations",
                "Experienced logistics coordination",
                "Operational safety standards",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <CheckCircle2 className="text-orange-500" />

                  <p className="text-lg text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLEET TYPES */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-14">
          <div className="mb-16 text-center">
            <p className="font-semibold uppercase tracking-[5px] text-orange-500">
              Fleet Capacity
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Fleet Built For Heavy Transport
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Howo Trucks",
                text: "Reliable heavy-duty trucks for commercial freight and cargo movement.",
              },
              {
                title: "Tipper Trucks",
                text: "Efficient transport for sand, gravel, mining, and construction materials.",
              },
              {
                title: "Super Link Fleet",
                text: "Long-distance freight transport for large cargo capacity operations.",
              },
              {
                title: "30-Tonne Trucks",
                text: "Heavy-duty transport solutions for industrial and bulk cargo logistics.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 shadow-xl"
              >
                <h3 className="mb-5 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="leading-8 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-14">
          <div className="mb-16 text-center">
            <p className="font-semibold uppercase tracking-[5px] text-orange-500">
              Fleet Gallery
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Our Transport Operations
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {fleetGallery.map((truck, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group overflow-hidden bg-white shadow-2xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={truck.image}
                    alt={truck.title}
                    className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="bg-slate-950 p-6">
                  <h3 className="text-2xl font-bold text-white">
                    {truck.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-14">
          <div className="mb-16 max-w-4xl">
            <p className="font-semibold uppercase tracking-[5px] text-orange-400">
              Why Naglink Company
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              Reliable Freight Solutions Backed By Experience
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: <Truck />,
                title: "Modern Fleet",
              },
              {
                icon: <MapPinned />,
                title: "Reliable Logistics",
              },
              {
                icon: <Clock3 />,
                title: "24/7 Tracking",
              },
              {
                icon: <ShieldCheck />,
                title: "Cargo Protection",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border border-slate-700 p-8"
              >
                <div className="mb-6 text-orange-400">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-orange-500 py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 text-center lg:flex-row lg:px-14 lg:text-left">
          <div>
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Need Professional Road Freight Services?
            </h2>

            <p className="mt-4 text-lg text-orange-100">
              Partner with Naglink Company for reliable transport
              and logistics solutions.
            </p>
          </div>

          <button className="bg-slate-950 px-8 py-4 font-semibold text-white transition hover:bg-black">
            Contact Us
          </button>
        </div>
      </section>
    </main>
  );
}

export default Fleet;