import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";

function Contact() {
  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-r from-blue-950 via-sky-300 to-white pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-none rounded-br-[50px] sm:rounded-br-[90px]">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-950/90 via-black/45 to-white/10" />

        <div className="h-[320px] bg-[url('/src/assets/images/hero/DSC05280.jpg')] bg-cover bg-center sm:h-[380px]" />

        <div className="absolute inset-0 z-20 flex items-center">
          <div className="px-4 sm:px-6 md:px-16 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="mb-4 w-fit rounded-full border border-white/40 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur sm:text-sm">
                Contact Us
              </p>

              <h1 className="max-w-4xl text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-6xl">
                Get in touch for transport bookings and enquiries.
              </h1>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-100 sm:text-lg md:leading-8">
                Contact our team for quotes, bookings, tracking support, truck
                availability, and general logistics assistance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="px-3 pt-14 sm:px-6 md:px-10 lg:px-20">
        {/* MATCHING TITLE STYLE */}
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          transition={{ duration: 1.2 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h1 className="mb-2 text-center text-3xl font-bold text-blue-950 sm:text-5xl">
            CONTACT{" "}
            <span className="font-light underline decoration-1 underline-offset-8">
              US
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-center text-lg font-medium text-slate-700">
            Reach out to us for truck hire, logistics support, transport
            bookings, cargo enquiries, and professional delivery services.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* CONTACT DETAILS */}
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-[24px] bg-gradient-to-r from-blue-950 via-sky-500 to-blue-800 p-[6px] shadow-2xl sm:rounded-[35px]"
          >
            <div className="h-full rounded-[20px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:rounded-[28px] sm:p-7">
              <h2 className="mb-7 text-2xl font-bold text-blue-950 sm:text-3xl">
                Contact Details
              </h2>

              <div className="space-y-7">
                {[
                  ["Phone", "+263 71 037 2685", Phone],
                  ["Email", "info@naglink.co.zw", Mail],
                  ["Address", "41336 Old Mutare Road Near Econet Masasa,Harare,Zimbabwe", MapPin],
                  [
                    "Working Hours",
                    "Monday - Saturday, 8:00 AM - 8:00 PM",
                    Clock,
                  ],
                ].map(([title, value, Icon]) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="rounded-xl bg-gradient-to-r from-blue-950 via-sky-600 to-blue-800 p-3 text-white shadow-lg">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-950">
                        {title}
                      </h3>

                      <p className="break-words text-slate-700">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-9 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-950 via-sky-600 to-blue-800 px-6 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:opacity-90">
                <MessageCircle size={22} />
                Chat With US
              </button>
            </div>
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-[24px] bg-gradient-to-r from-purple-900 via-blue-800 to-sky-500 p-[6px] shadow-2xl sm:rounded-[35px] lg:col-span-2"
          >
            <div className="h-full rounded-[20px] bg-gradient-to-r from-slate-100 via-sky-100 to-white p-5 sm:rounded-[28px] sm:p-7">
              <h2 className="mb-7 text-2xl font-bold text-blue-950 sm:text-3xl">
                Send a Message
              </h2>

              <form className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="h-14 rounded-2xl border-[3px] border-sky-200 bg-white/80 px-5 text-base outline-none transition focus:border-blue-700"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="h-14 rounded-2xl border-[3px] border-sky-200 bg-white/80 px-5 text-base outline-none transition focus:border-blue-700"
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="h-14 rounded-2xl border-[3px] border-sky-200 bg-white/80 px-5 text-base outline-none transition focus:border-blue-700"
                  />

                  <input
                    type="text"
                    placeholder="Subject"
                    className="h-14 rounded-2xl border-[3px] border-sky-200 bg-white/80 px-5 text-base outline-none transition focus:border-blue-700"
                  />
                </div>

                <textarea
                  rows="7"
                  placeholder="Write your message..."
                  className="resize-none rounded-2xl border-[3px] border-sky-200 bg-white/80 p-5 text-base outline-none transition focus:border-blue-700"
                />

                <button
                  type="button"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-950 via-sky-600 to-blue-800 px-8 text-lg font-semibold text-white shadow-lg transition duration-300 hover:scale-[1.02] hover:opacity-90 md:w-fit"
                >
                  <Send size={22} />
                  Send Message
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Contact;