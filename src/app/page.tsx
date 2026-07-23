import CorporateTraining from "@/components/corporate-training";
import FinalCta from "@/components/final-cta";
import FirstAidCabinet from "@/components/firstaid-cabinet";
import Hero from "@/components/hero";
import OurCourses from "@/components/our-courses";
import WhyBeacon from "@/components/why-beacon";

export default function Home() {
  return (
    <>
      <Hero />

      <WhyBeacon />

      <OurCourses />

      <CorporateTraining />

      <FirstAidCabinet />

      <FinalCta />
    </>
  );
}
