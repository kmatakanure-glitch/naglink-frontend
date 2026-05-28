import truck1 from "../../assets/images/fleet/DSC05324.jpg";
import truck2 from "../../assets/images/fleet/DSC05309.jpg";
import truck3 from "../../assets/images/fleet/DSC05272.jpg";
import truck4 from "../../assets/images/fleet/DSC05336.jpg";
import truck5 from "../../assets/images/fleet/DSC05339.jpg";
import truck6 from "../../assets/images/fleet/DSC05267.jpg";
import truck7 from "../../assets/images/fleet/DSC05280.jpg";
import truck8 from "../../assets/images/fleet/DSC05315.jpg";
import companyVideo from "../../assets/videos/company-video.mp4";
import truck9 from "../../assets/images/fleet/DSC05272.jpg";
import truck10 from "../../assets/images/fleet/DSC05284.jpg";
import truck11 from "../../assets/images/fleet/our team.jpg";
import truck12 from "../../assets/images/fleet/drivers.jpg";
import truck13 from "../../assets/images/fleet/DSC05286.jpg";
import truck14 from "../../assets/images/fleet/DSC05316.jpg";
import truck15 from "../../assets/images/fleet/DSC05310.jpg";
import truck16 from "../../assets/images/fleet/DSC05329.jpg";
import truck17 from "../../assets/images/fleet/DSC05326.jpg";
import truck18 from "../../assets/images/fleet/DSC05338.jpg";
import truck19 from "../../assets/images/fleet/DSC05312.jpg";
import truck20 from "../../assets/images/fleet/DSC05295.jpg";

export default function Gallery() {
  const images = [
    truck1,
    truck2,
    truck3,
    truck4,
    truck5,
    truck6,
    truck7,
    truck8,
    truck9,
    truck10,
    truck11,
    truck12,
    truck13,
    truck14,
    truck15,
    truck16,
    truck17,
    truck18,
    truck19,
    truck20
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={companyVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-6xl font-bold text-center px-4">
            Our Gallery
          </h1>
        </div>
      </div>

      {/* Intro */}
      <div className="text-center py-16 px-6">
        <h2 className="text-4xl font-bold text-gray-900">
          Inside Naglink Operations
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
          Explore our operations, projects, professional team,
          and commitment to excellence across all sectors.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-20">
        {images.map((image, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl shadow-lg group"
          >
            <img
              src={image}
              alt={`Fleet image ${index + 1}`}
              className="w-full h-[300px] object-cover transition duration-500 group-hover:scale-110"
            />
          </div>
        ))}
      </div>
    </div>
  );
}