import adminImage from "../../assets/images/admin/admin.jpg";
import sunlineLogo from "../../assets/images/fleet/sunline.jpg";
import reignboldLogo from "../../assets/images/fleet/reinbold.jpg";
import swanvalleyLogo from "../../assets/images/fleet/swanvalley.jpg";
import subsaharaLogo from "../../assets/images/fleet/subsahara.jpg";
import fleetexpansion from "../../assets/images/fleet/DSC05298.jpg";
import liveordertracking from "../../assets/images/fleet/image.jpg";
import customer from "../../assets/images/fleet/customer.jpg";
export default function NewsUpdates() {
  const news = [
    {
      title: "SADC Regional Route Expansion",
      date: "May 2026",
      image:
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop",
      description:
        "Naglink has officially expanded transport and logistics operations across the SADC region, now covering Zambia, Botswana, and South Africa with fast, secure, and reliable delivery services for commercial cargo and package transportation.",
    },
    {
      title: "24/7 Customer Support & Digital Engagement",
      date: "May 2026",
      image: customer,
      description:
        "Naglink now offers 24/7 customer support together with active engagement across Facebook, X, and Instagram platforms. Clients can also communicate directly through our personalized email platforms at info@naglink.co.zw and admin@naglink.co.zw for faster support and service updates.",
    },
    {
      title: "Live Order Tracking System Launch",
      date: "May 2026",
      image:liveordertracking,
      description:
        "Naglink has officially launched its live order tracking system, allowing clients to track deliveries directly from our website and receive real-time shipment updates, status notifications, and transport progress information across all operations.",
    },
    {
      title: "Fleet Expansion Across Zimbabwe",
      date: "May 2026",
      image: fleetexpansion,
      description:
        "Naglink continues expanding its transport and logistics fleet to improve nationwide delivery efficiency and reliability for industrial and commercial clients.",
    },
    {
      title: "Mining Logistics Operations Growth",
      date: "April 2026",
      image:
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
      description:
        "Our mining logistics division has increased operational capacity with new heavy-duty transportation support services across regional mining sectors.",
    },
    {
      title: "Strategic Client Partnerships",
      date: "March 2026",
      image: adminImage,
      description:
        "Naglink continues building strong partnerships with corporate clients through reliable logistics, transport coordination, and professional service delivery.",
    },
  ];

  const clients = [
    {
      name: "Sunline",
      logo: sunlineLogo,
    },
    {
      name: "Reignbold",
      logo: reignboldLogo,
    },
    {
      name: "Swan Valley",
      logo: swanvalleyLogo,
    },
    {
      name: "Subsahara",
      logo: subsaharaLogo,
    },
    {
      name: "West Villah",
      logo: "https://dummyimage.com/300x180/1d4ed8/ffffff&text=West+Villah",
    },
    {
      name: "Schnlub",
      logo: "https://dummyimage.com/300x180/0c4a6e/ffffff&text=Schnlub",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[420px] overflow-hidden">
        <img
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?q=80&w=1600&auto=format&fit=crop"
          alt="Naglink News"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-6">
          <div className="text-center max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              News & Updates
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-200">
              Stay informed with the latest developments, operations,
              partnerships, and company achievements from Naglink Logistics.
            </p>
          </div>
        </div>
      </div>

      {/* News Section */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Latest Company Updates
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
            Explore our latest operational updates, business growth,
            transportation projects, and logistics developments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {news.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 hover:-translate-y-2 transition duration-500"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[260px] object-cover hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-8">
                <span className="text-sm text-blue-600 font-semibold uppercase tracking-wider">
                  {item.date}
                </span>

                <h3 className="mt-3 text-2xl font-bold text-gray-900 leading-snug">
                  {item.title}
                </h3>

                <p className="mt-4 text-gray-600 leading-relaxed">
                  {item.description}
                </p>

                <button className="mt-6 px-6 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition duration-300">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clients Section */}
      <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-gray-900">
            Trusted By Our Clients
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-lg">
            We are proud to serve respected companies and organizations with
            reliable transport, logistics, and operational support services.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {clients.map((client, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center hover:shadow-2xl hover:-translate-y-1 transition duration-300"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-20 object-contain"
              />

              <h3 className="mt-4 text-center font-semibold text-gray-800">
                {client.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-blue-900 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold">
          Building Strong Logistics Partnerships
        </h2>

        <p className="mt-6 text-lg text-blue-100 max-w-3xl mx-auto">
          Naglink remains committed to delivering dependable transport,
          logistics, fleet solutions, and operational excellence across all
          sectors.
        </p>

        <button className="mt-10 px-10 py-4 bg-white text-blue-900 rounded-2xl font-semibold hover:bg-gray-100 transition duration-300">
          Contact Us
        </button>
      </section>
    </div>
  );
}
