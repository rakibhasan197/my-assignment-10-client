import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import StartupStats from "@/components/StartupStats";
import WhyJoin from "@/components/WhyJoin";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Banner></Banner>
    <WhyJoin></WhyJoin>
    <StartupStats></StartupStats>
    </div>
  );
}
