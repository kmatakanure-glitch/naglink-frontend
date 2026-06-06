import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";


function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;