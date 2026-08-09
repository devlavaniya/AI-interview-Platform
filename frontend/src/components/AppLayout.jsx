import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (

    <div className="flex min-h-screen bg-[#090909]">

      <Sidebar />

      <div className="flex flex-1 flex-col ml-72">

        <Navbar />

        <main className="flex-1 p-8">

          <Outlet />

        </main>

      </div>

    </div>

  );
}