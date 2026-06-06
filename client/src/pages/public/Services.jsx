import { motion } from "framer-motion";

import serviceHero from "../../assets/images/hero/DSC05280.jpg";

import hinoImg from "../../assets/images/services/hino.jpg";
import tipperImg from "../../assets/images/services/tipper.jpg";
import bulkImg from "../../assets/images/services/bulk.jpg";

function Services() {
  const services = [
    {
      title: "LTL Shipping",
      image: hinoImg,
      description:
        "Cost-effective shared load transport across Zimbabwe & SADC for flexible, smaller shipments.",
      features: [
        "Shared truck capacity (cost-saving)",
        "Regional SADC coverage",
        "Daily & scheduled departures",
        "Safe consolidated handling",
      ],
      number: "01",
      margin: "mt-0",
      borderGradient: "linear-gradient(to right, #ffffff, #bae6fd, #38bdf8)",
      descClass:
        "bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 text-white",
    },
    {
      title: "FTL Shipping",
      image: tipperImg,
      description:
        "Dedicated full truckload transport for fast, secure and direct delivery across Southern Africa.",
      features: [
        "Exclusive truck allocation",
        "Faster transit times",
        "High-value cargo protection",
        "Cross-border logistics support",
      ],
      number: "02",
      margin: "mt-0 lg:mt-12",
      borderGradient: "linear-gradient(to right, #ffffff, #bae6fd, #38bdf8)",
      descClass:
        "bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 text-white",
    },
    {
      title: "Bulk Cargo Transport",
      image: bulkImg,
      description:
        "Specialised bulk hauling for agriculture, mining, and industrial materials across Zimbabwe & SADC.",
      features: [
        "High-volume cargo capacity",
        "Agricultural & mineral transport",
        "Construction material logistics",
        "Heavy-duty fleet support",
      ],
      number: "03",
      margin: "mt-0 lg:mt-24",
      borderGradient: "linear-gradient(to right, #1e1b4b, #581c87, #7e22ce)",
      descClass:
        "bg-gradient-to-r from-white via-sky-100 to-sky-300 text-blue-950",
    },
  ];

  return(

 <main className="min-h-screen bg-gradient-to-r from-blue-400 via-sky-200 to-white pb-24">
      {/* HERO */}
      <section className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative min-h-[460px] w-full overflow-hidden shadow-2xl shadow-blue-950/30"
        >
          <img
            src={serviceHero}
            alt="Our logistics services"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-black/50 to-white/10" />

          <div className="relative z-10 flex min-h-[460px] flex-col justify-center px-6 md:px-16 lg:px-24">
            <p className="mb-5 w-fit rounded-full border border-white/40 bg-white/15 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
              Premium Logistics Services
            </p>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Smart, reliable and scalable transport solutions across Africa.
            </h1>

            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-100">
              From consolidated LTL shipments to full truckload and bulk cargo,
              we deliver efficiency, safety, and real-time logistics reliability.
            </p>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-14 md:grid-cols-4">
        {[
          { label: "Cross-border Routes", value: "10+" },
          { label: "Fleet Vehicles", value: "50+" },
          { label: "On-time Delivery", value: "98%" },
          { label: "Clients Served", value: "1,200+" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-2xl bg-white/60 p-6 text-center shadow-xl backdrop-blur"
          >
            <h3 className="text-3xl font-bold text-blue-950">{stat.value}</h3>
            <p className="mt-2 text-sm font-medium text-slate-600">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* WHAT WE DO */}
      <div className="px-6 text-center lg:px-24">
        <h2 className="text-4xl font-semibold text-blue-950">What We Do</h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg font-medium leading-8 text-slate-700">
          We provide end-to-end logistics solutions including truck hire,
          tipper transport, and bulk cargo movement tailored for mining,
          agriculture, construction, and commercial industries.
        </p>
      </div>

      {/* SERVICES */}
      <section className="px-4 py-16 sm:px-6 lg:px-20">
        <div className="flex flex-col items-center justify-center gap-14 lg:flex-row lg:items-start">
          {services.map((service) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex w-full max-w-[430px] flex-col items-center ${service.margin}`}
            >
              <div
                className="relative h-[460px] w-full overflow-hidden p-7 shadow-2xl"
                style={{ background: service.borderGradient }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />

                {/* description overlay */}
                <div
                  className={`absolute bottom-8 left-6 right-6 border border-white/20 px-5 py-5 text-center shadow-2xl backdrop-blur-md ${service.descClass}`}
                >
                  <p className="text-sm font-medium leading-6">
                    {service.description}
                  </p>
                </div>
              </div>

              <h3 className="mt-6 text-center text-2xl font-bold text-blue-950">
                {service.title}
              </h3>

              {/* FEATURES */}
              <ul className="mt-4 space-y-2 text-center text-sm text-slate-600">
                {service.features.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>

              <div className="mt-3 text-5xl font-light text-blue-950">
                {service.number}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mt-10 max-w-6xl px-6">
        <h2 className="text-center text-4xl font-semibold text-blue-950">
          How It Works
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Request Quote",
              desc: "Share your cargo details and destination.",
            },
            {
              title: "We Plan Logistics",
              desc: "We assign the right truck and optimize route.",
            },
            {
              title: "Safe Delivery",
              desc: "Your cargo is delivered securely and on time.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/60 p-6 text-center shadow-xl backdrop-blur"
            >
              <div className="text-3xl font-bold text-blue-950">
                0{i + 1}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-blue-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 bg-blue-950 px-6 py-16 text-center text-white">
        <h2 className="text-4xl font-bold">
          Ready to move your cargo with confidence?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-200">
          Get a fast, reliable logistics quote tailored to your business needs.
        </p>

        <button className="mt-8 rounded-full bg-sky-400 px-8 py-4 font-semibold text-blue-950 shadow-lg transition hover:bg-sky-300">
          Request a Quote
        </button>
      </section>
    </main>
  );
}

export default Services;