import { motion } from "framer-motion";
import {
  Truck,
  Globe,
  ShieldCheck,
  Clock3,
  PackageCheck,
  Users,
  ChevronRight,
} from "lucide-react";

import adminImage from "../../assets/images/admin/admin.jpg"; 
import companyVideo from "../../assets/videos/company-video.mp4";

import team1 from "../../assets/images/fleet/our team.jpg";
import team2 from "../../assets/images/fleet/admin.jpg";
import team3 from "../../assets/images/fleet/drivers.jpg";
import team4 from "../../assets/images/fleet/logistics.jpg";

function About() {
  const services = [
    {
      icon: <Truck size={34} />,
      title: "Transport & Fleet Management",
      text: "Professional truck hire, tipper hire, and heavy cargo movement services tailored for businesses and individuals.",
    },
    {
      icon: <PackageCheck size={34} />,
      title: "Cargo Handling",
      text: "Efficient cargo movement with professional loading, dispatching, and delivery coordination.",
    },
    {
      icon: <Clock3 size={34} />,
      title: "24/7 Tracking",
      text: "Reliable cargo monitoring and delivery status updates to ensure transparency and trust.",
    },
    {
      icon: <Globe size={34} />,
      title: "Reliable Logistics",
      text: "Providing dependable logistics support for construction, mining, commercial, and industrial transport.",
    },
  ];

  const values = [
    {
      title: "Reliability",
      text: "We deliver dependable transport solutions with consistency and professionalism.",
    },
    {
      title: "Safety",
      text: "We prioritize cargo security, driver safety, and operational excellence.",
    },
    {
      title: "Customer Commitment",
      text: "Every shipment matters. We focus on long-term relationships and service quality.",
    },
    {
      title: "Efficiency",
      text: "Smart planning and modern logistics systems ensure smooth deliveries.",
    },
  ];

  const stats = [
    { number: "10+", label: "Years Operating" },
    { number: "20+", label: "Howo Trucks" },
    { number: "20+", label: "Tipper Trucks" },
    { number: "24/7", label: "Order Tracking" },
  ];

  const teamMembers = [
    {
      src: team1,
      name: "Operations Team",
      title: "Fleet & Order Management",
    },
    {
      src: team2,
      name: "Admin Team",
      title: "Customer Support & Bookings",
    },
    {
      src: team3,
      name: "Drivers Team",
      title: "Delivery Operations",
    },
    {
      src: team4,
      name: "Logistics Team",
      title: "Transport Planning",
    },
  ];

  return (
    <main className="overflow-hidden bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] bg-gradient-to-br from-slate-950 via-blue-950 to-sky-900">
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-center px-6 py-20 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <p className="mb-4 text-sm font-semibold uppercase tracking-[6px] text-orange-400">
              About Naglink Company
            </p>

            <h1 className="mb-8 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Driving Reliable
              <span className="block text-orange-400">
                Logistics Since 2016
              </span>
            </h1>

            <p className="max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
              Naglink Company has been providing trusted transport,
              freight, and logistics solutions for over 10 years. We
              specialize in truck hire, tipper hire, bulk cargo movement,
              and professional transport operations built on reliability,
              safety, and customer trust.
            </p>

            <button className="mt-10 flex items-center gap-2 bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600">
              Learn More
              <ChevronRight />
            </button>
          </motion.div>
        </div>
      </section>

      {/* COMPANY INTRO */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-14">
          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <img
              src={adminImage}
              alt="Naglink Director"
              className="h-[650px] w-full object-cover shadow-2xl"
            />
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="mb-3 font-semibold uppercase tracking-[5px] text-orange-500">
              Our Company
            </p>

            <h2 className="mb-8 text-4xl font-bold text-slate-900 md:text-5xl">
              Building Logistics Excellence For Over 10 Years
            </h2>

            <p className="mb-6 text-lg leading-9 text-slate-600">
              Founded in <strong>2016</strong>, Naglink Company has grown
              into a trusted logistics and transport company dedicated to
              delivering excellence in cargo movement and fleet services.
            </p>

            <p className="mb-10 text-lg leading-9 text-slate-600">
              Through professionalism, strong operational systems, and a
              customer-first approach, we continue to support businesses
              and industries with reliable transport solutions.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-orange-500 bg-slate-100 p-6"
                >
                  <h3 className="text-4xl font-bold text-slate-900">
                    {item.number}
                  </h3>
                  <p className="mt-2 text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
{/* COMPANY VIDEO SECTION */}
<section className="bg-slate-950 py-24">
  <div className="mx-auto max-w-7xl px-6 lg:px-14">
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="overflow-hidden rounded-[30px] bg-slate-900 shadow-2xl"
    >
      {/* TEXT */}
      <div className="px-6 pt-10 text-center md:px-12">
        <p className="mb-3 font-semibold uppercase tracking-[5px] text-orange-400">
          Watch Our Journey
        </p>

        <h2 className="mx-auto max-w-4xl text-3xl font-bold text-white md:text-5xl">
          Moving Businesses Forward Through Reliable Logistics
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Discover how Naglink Company continues to deliver trusted
          freight, transport, and logistics solutions through
          professionalism, experience, and operational excellence.
        </p>
      </div>

      {/* VIDEO */}
      <div className="mt-10">
        <video
          className="h-[300px] w-full object-cover md:h-[600px]"
          autoPlay
          muted
          loop
          playsInline
          controls
        >
          <source src={companyVideo} type="video/mp4" />
        </video>
      </div>
    </motion.div>
  </div>
</section>
      {/* SERVICES */}
      <section className="bg-slate-100 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-14">
          <div className="mb-16 text-center">
            <p className="font-semibold uppercase tracking-[5px] text-orange-500">
              What We Do
            </p>

            <h2 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
              Logistics Solutions That Move Business
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
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

     {/* OUR PEOPLE / TEAM SECTION - DSV STYLE */}
<section className="bg-white py-28">
  <div className="mx-auto max-w-7xl px-6 lg:px-14">
    {/* HEADING */}
    <div className="mb-24 max-w-4xl">
      <p className="mb-4 font-semibold uppercase tracking-[5px] text-orange-500">
        Meet Our People
      </p>

      <h2 className="text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
        Dedicated Professionals Driving
        <span className="block text-orange-500">
          Naglink Company Forward
        </span>
      </h2>

      <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600">
        Behind every successful delivery is a team committed to
        professionalism, reliability, and operational excellence.
        From logistics planning to fleet operations, our people
        make transport happen every day.
      </p>
    </div>

    {/* TEAM STORIES */}
    <div className="space-y-32">
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className={`grid items-center gap-12 lg:grid-cols-2 ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* IMAGE */}
          <div
            className={`${
              index % 2 !== 0 ? "lg:order-2" : ""
            } overflow-hidden`}
          >
            <img
              src={member.src}
              alt={member.name}
              className="h-[350px] w-full object-cover shadow-2xl sm:h-[500px] lg:h-[600px]"
            />
          </div>

          {/* TEXT */}
          <div
            className={`${
              index % 2 !== 0 ? "lg:order-1" : ""
            }`}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-[5px] text-orange-500">
              Our Team
            </p>

            <h3 className="mb-5 text-3xl font-bold text-slate-900 md:text-5xl">
              {member.name}
            </h3>

            <p className="mb-8 text-xl font-medium text-slate-700">
              {member.title}
            </p>

            <p className="max-w-xl text-lg leading-9 text-slate-600">
              At Naglink Company, our{" "}
              <span className="font-semibold text-slate-900">
                {member.name.toLowerCase()}
              </span>{" "}
              plays a critical role in ensuring smooth transport
              operations, professional customer support, cargo
              movement, and efficient logistics coordination.
              Their dedication helps us maintain high standards
              of service and reliability every single day.
            </p>

            <div className="mt-10 h-[2px] w-20 bg-orange-500" />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* VALUES */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-14">
          <div className="mb-16 text-center">
            <p className="font-semibold uppercase tracking-[5px] text-orange-400">
              Our Values
            </p>

            <h2 className="mt-4 text-4xl font-bold md:text-5xl">
              What Drives Naglink Company
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="border border-slate-700 p-8"
              >
                <ShieldCheck className="mb-6 text-orange-400" />

                <h3 className="mb-4 text-2xl font-bold">
                  {value.title}
                </h3>

                <p className="leading-8 text-slate-300">
                  {value.text}
                </p>
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
              Ready To Move Your Cargo?
            </h2>

            <p className="mt-4 text-lg text-orange-100">
              Partner with Naglink Company for trusted transport
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

export default About;