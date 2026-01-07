import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getAnnouncement } from "@/actions/announcement";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const announcement = await getAnnouncement();

  return (
    <div>
      <Navbar />
      <AnnouncementBar
        message={announcement?.text || "Welcome to Maakalitravels!"}
      />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
