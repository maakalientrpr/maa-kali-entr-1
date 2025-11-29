import AnnouncementBar from "@/components/AnnouncementBar";
import CustomizeTourForm from "@/components/home-page/customize-tour-form";
import EventsCatering from "@/components/home-page/events-catering";
import FeaturedTorus from "@/components/home-page/Featured-tours";
import Hero from "@/components/home-page/Hero";
import ReviewsPage from "@/components/reviews/ReviewPage";
import TravelVideos from "@/components/travel-videos";

export default async function Home() {
  return (
    <div>
      <AnnouncementBar />
      <Hero />
      <FeaturedTorus />
      <CustomizeTourForm />
      <EventsCatering />
      <TravelVideos />
     <ReviewsPage />
    </div>
  );
}
