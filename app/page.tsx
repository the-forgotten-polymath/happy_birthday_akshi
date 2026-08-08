import AppShell from "@/components/AppShell";
import HeroV2 from "@/components/sections/HeroV2";
import Marquee from "@/components/sections/Marquee";
import Numbers from "@/components/sections/Numbers";
import ScrollText from "@/components/sections/ScrollText";
import TwentyTwoV2 from "@/components/sections/TwentyTwoV2";
import Timeline from "@/components/sections/Timeline";
import Gallery from "@/components/sections/Gallery";
import Reasons from "@/components/sections/Reasons";
import GiftBox from "@/components/sections/GiftBox";
import ArcadeHub from "@/components/sections/ArcadeHub";
import Cake from "@/components/sections/Cake";
import LetterV2 from "@/components/sections/LetterV2";
import Finale from "@/components/sections/Finale";
import Gate from "@/components/ui/Gate";
import MusicPlayerBar from "@/components/ui/MusicPlayerBar";

export default function Home() {
  return (
    <Gate>
      <AppShell>
        <MusicPlayerBar />
        <main className="relative">
          <HeroV2 />
          <Marquee />
          <Numbers />
          <ScrollText />
          <TwentyTwoV2 />
          <Timeline />
          <Gallery />
          <Reasons />
          <GiftBox />
          <ArcadeHub />
          <Cake />
          <LetterV2 />
          <Finale />
        </main>
      </AppShell>
    </Gate>
  );
}
