import CustomizeTourForm from "@/components/home-page/customize-tour-form";
import EventsCatering from "@/components/home-page/events-catering";
import FeaturedTorus from "@/components/home-page/Featured-tours";
import Hero from "@/components/home-page/Hero";
import PromotionalPopup from "@/components/home-page/promotional-popup";
import ReviewsPage from "@/components/reviews/ReviewPage";
import TravelVideos from "@/components/travel-videos";

export default async function Home() {
  return (
    <div>
      <PromotionalPopup />
      <Hero />
      <FeaturedTorus />
      <CustomizeTourForm />
      <EventsCatering />
      <ReviewsPage />
      <TravelVideos />
    </div>
  );
}
