import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { GamificationLayer } from "./GamificationLayer";
export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <GamificationLayer />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};
