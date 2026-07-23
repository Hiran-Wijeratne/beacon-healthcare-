import CorporateTraining from "@/components/corporate-training";
import EcgDivider from "@/components/ecg-divider";
import FinalCta from "@/components/final-cta";
import FirstAidCabinet from "@/components/firstaid-cabinet";
import Hero from "@/components/hero";
import OurCourses from "@/components/our-courses";
import WhyBeacon from "@/components/why-beacon";

export default function Home() {
  return (
    <>
      <Hero />

      <EcgDivider />

      <WhyBeacon />

      <OurCourses />

      <CorporateTraining />

      <FirstAidCabinet />

      <FinalCta />
    </>
  );
}
