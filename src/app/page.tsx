import CorporateTraining from "@/components/corporate-training";
import FinalCta from "@/components/final-cta";
import Hero from "@/components/hero";
import OurCourses from "@/components/our-courses";
import Preparation from "@/components/preparation";
import ScrollVideo from "@/components/scroll-video";
import WhyBeacon from "@/components/why-beacon";

export default function Home() {
  return (
    <>
      <Hero />

      <ScrollVideo src="/videos/beacon-hero.mp4" />

      <WhyBeacon />

      <OurCourses />

      <CorporateTraining />

      <Preparation />

      <FinalCta />
    </>
  );
}
