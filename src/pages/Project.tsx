import Sidebar from "@/components/app-sidebar";
import Navbar from "@/components/Navbar";
import { Route, Routes } from "react-router-dom";
export default function Project() {
  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="bg-section-tabcontent w-full flex">
          <Routes>
            <Route  />
          </Routes>
        </main>
      </div>
    </>
  );
}
