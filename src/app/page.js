import Banner from "@/components/Banner";
import FeaturedOpportunities from "@/components/FeaturedOpportunities";
import FeaturedStartups from "@/components/FeaturedStartups";
import StartupStats from "@/components/StartupStats";
import WhyJoin from "@/components/WhyJoin";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
      <FeaturedStartups></FeaturedStartups>
      <FeaturedOpportunities></FeaturedOpportunities>
      <WhyJoin></WhyJoin>
      <StartupStats></StartupStats>
    </div>
  );
}
